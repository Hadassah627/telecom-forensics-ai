from collections import defaultdict
from datetime import timedelta

from sqlalchemy import and_, desc, func, or_
from sqlalchemy.orm import Session

from app.models.forensic_models import CDR, CrimeEvent, TowerDump


class AnalysisService:
    """Service layer for forensic analysis queries using SQLAlchemy ORM."""

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

        return [
            {
                "tower_id": row.tower_id,
                "time": row.time.isoformat() if row.time else None,
                "location": row.location,
            }
            for row in rows
        ]

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
            matched_numbers.append(
                {
                    "number": row.number,
                    "tower_id": row.tower_id,
                    "time": row.time.isoformat() if row.time else None,
                    "location": row.location,
                }
            )

        crime_payload = {
            "id": crime.id,
            "crime": crime.crime,
            "tower": crime.tower,
            "time": crime.time.isoformat() if crime.time else None,
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
