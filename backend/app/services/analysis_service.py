from collections import defaultdict
from datetime import timedelta

from sqlalchemy import and_, desc, func, or_
from sqlalchemy.orm import Session

from app.models.forensic_models import CDR, CrimeEvent, TowerDump


TOWER_COORDINATES = {
    "t1": {"lat": 12.9716, "lng": 77.5946, "location": "Bangalore"},
    "t2": {"lat": 28.6139, "lng": 77.2090, "location": "Delhi"},
    "t3": {"lat": 17.3850, "lng": 78.4867, "location": "Hyderabad"},
    "t4": {"lat": 19.0760, "lng": 72.8777, "location": "Mumbai"},
    "t5": {"lat": 13.0827, "lng": 80.2707, "location": "Chennai"},
    "t6": {"lat": 18.5204, "lng": 73.8567, "location": "Pune"},
}


LOCATION_COORDINATES = {
    "bangalore": {"lat": 12.9716, "lng": 77.5946},
    "bengaluru": {"lat": 12.9716, "lng": 77.5946},
    "delhi": {"lat": 28.6139, "lng": 77.2090},
    "hyderabad": {"lat": 17.3850, "lng": 78.4867},
    "mumbai": {"lat": 19.0760, "lng": 72.8777},
    "chennai": {"lat": 13.0827, "lng": 80.2707},
    "pune": {"lat": 18.5204, "lng": 73.8567},
}


class AnalysisService:
    """Service layer for forensic analysis queries using SQLAlchemy ORM."""

    @staticmethod
    def get_tower_coordinates(tower_id: str, location: str = None):
        key = str(tower_id or "").strip().lower()
        mapped = TOWER_COORDINATES.get(key)
        if mapped:
            return {
                "lat": mapped["lat"],
                "lng": mapped["lng"],
                "location": location or mapped.get("location"),
            }

        location_key = str(location or "").strip().lower()
        loc = LOCATION_COORDINATES.get(location_key)
        if loc:
            return {"lat": loc["lat"], "lng": loc["lng"], "location": location}

        return {"lat": None, "lng": None, "location": location}

    @staticmethod
    def get_frequent_contacts(db: Session, number: str):
        """Return the most contacted numbers for the given phone number."""
        outgoing = (
            db.query(CDR.receiver.label("number"), func.count(CDR.id).label("count"))
            .filter(CDR.caller == number)
            .group_by(CDR.receiver)
            .all()
        )

        incoming = (
            db.query(CDR.caller.label("number"), func.count(CDR.id).label("count"))
            .filter(CDR.receiver == number)
            .group_by(CDR.caller)
            .all()
        )

        merged_counts = defaultdict(int)
        for row in outgoing:
            merged_counts[str(row.number)] += int(row.count)
        for row in incoming:
            merged_counts[str(row.number)] += int(row.count)

        data = [{"number": key, "count": value} for key, value in merged_counts.items()]
        data.sort(key=lambda x: x["count"], reverse=True)
        return data

    @staticmethod
    def get_common_contacts(db: Session, num1: str, num2: str):
        """Find common receivers contacted by num1 and num2."""
        num1_receivers = (
            db.query(CDR.receiver)
            .filter(CDR.caller == num1)
            .distinct()
            .subquery()
        )

        num2_receivers = (
            db.query(CDR.receiver)
            .filter(CDR.caller == num2)
            .distinct()
            .subquery()
        )

        rows = (
            db.query(num1_receivers.c.receiver)
            .join(num2_receivers, num1_receivers.c.receiver == num2_receivers.c.receiver)
            .all()
        )

        return [{"number": str(row.receiver)} for row in rows]

    @staticmethod
    def get_movement(db: Session, number: str):
        """Return movement history (tower/time/location) ordered by time."""
        rows = (
            db.query(TowerDump)
            .filter(TowerDump.number == number)
            .order_by(TowerDump.time.asc())
            .all()
        )

        movement = []
        for row in rows:
            coords = AnalysisService.get_tower_coordinates(row.tower_id, row.location)
            movement.append(
                {
                    "tower_id": row.tower_id,
                    "time": row.time.isoformat() if row.time else None,
                    "location": coords.get("location"),
                    "lat": coords.get("lat"),
                    "lng": coords.get("lng"),
                }
            )

        return movement

    @staticmethod
    def get_crime_tower_match(db: Session, crime_id: int):
        """
        Find numbers near the crime by matching tower and nearby time window.

        Window used: +/- 1 hour around the crime time.
        """
        crime = db.query(CrimeEvent).filter(CrimeEvent.id == crime_id).first()
        if not crime:
            return None, []

        start_time = crime.time - timedelta(hours=1)
        end_time = crime.time + timedelta(hours=1)

        rows = (
            db.query(TowerDump)
            .filter(
                and_(
                    TowerDump.tower_id == crime.tower,
                    TowerDump.time >= start_time,
                    TowerDump.time <= end_time,
                )
            )
            .order_by(TowerDump.time.asc())
            .all()
        )

        matched_numbers = []
        seen = set()
        for row in rows:
            if row.number in seen:
                continue
            seen.add(row.number)
            coords = AnalysisService.get_tower_coordinates(row.tower_id, row.location)
            matched_numbers.append(
                {
                    "number": row.number,
                    "tower_id": row.tower_id,
                    "time": row.time.isoformat() if row.time else None,
                    "location": coords.get("location"),
                    "lat": coords.get("lat"),
                    "lng": coords.get("lng"),
                }
            )

        crime_coords = AnalysisService.get_tower_coordinates(crime.tower)
        crime_payload = {
            "id": crime.id,
            "crime": crime.crime,
            "tower": crime.tower,
            "time": crime.time.isoformat() if crime.time else None,
            "location": crime_coords.get("location"),
            "lat": crime_coords.get("lat"),
            "lng": crime_coords.get("lng"),
        }

        return crime_payload, matched_numbers

    @staticmethod
    def get_links(db: Session, number: str):
        """Return caller-receiver links directly connected to the given number."""
        rows = (
            db.query(CDR.caller, CDR.receiver)
            .filter(or_(CDR.caller == number, CDR.receiver == number))
            .all()
        )

        return [{"caller": str(row.caller), "receiver": str(row.receiver)} for row in rows]

    @staticmethod
    def detect_risk(db: Session, result: dict):
        """Detect suspicious patterns and return risk score metadata."""
        reasons = []
        suspects = set()
        suspect_towers = set()
        score = 0

        frequent_results = result.get("results") or []
        if frequent_results:
            hot_contacts = [item for item in frequent_results if int(item.get("count", 0)) >= 5]
            if hot_contacts:
                score += 1
                reasons.append("High call volume detected with repeated contacts.")
                suspects.update(str(item.get("number")) for item in hot_contacts if item.get("number"))

        nearby_numbers = result.get("nearby_numbers") or []
        crime = result.get("crime") or {}
        if crime and nearby_numbers:
            score += 2
            reasons.append("Multiple numbers found near the crime tower and time window.")
            suspects.update(str(item.get("number")) for item in nearby_numbers if item.get("number"))
            suspect_towers.update(str(item.get("tower_id")) for item in nearby_numbers if item.get("tower_id"))

        links = result.get("links") or []
        if len(links) >= 6:
            score += 1
            reasons.append("Frequent communication links detected in the network graph.")
            for link in links:
                if link.get("caller"):
                    suspects.add(str(link["caller"]))
                if link.get("receiver"):
                    suspects.add(str(link["receiver"]))

        candidate_numbers = {str(result.get("number"))} if result.get("number") else set()
        candidate_numbers.update(str(n) for n in suspects if n)
        candidate_numbers.discard("None")

        if candidate_numbers:
            late_calls = (
                db.query(CDR)
                .filter(
                    (CDR.caller.in_(candidate_numbers)) | (CDR.receiver.in_(candidate_numbers))
                )
                .all()
            )
            late_count = sum(1 for row in late_calls if row.time and (row.time.hour >= 23 or row.time.hour < 5))
            if late_count >= 3:
                score += 1
                reasons.append("Late-night communication activity observed.")

        if score >= 3:
            risk_level = "HIGH"
        elif score >= 2:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        if not reasons:
            reasons.append("No major risk indicators were triggered by current rules.")

        return {
            "risk_level": risk_level,
            "risk_reason": reasons,
            "suspects": sorted(suspects),
            "suspect_towers": sorted(suspect_towers),
        }
