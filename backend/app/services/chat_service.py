import json
import re
from typing import Any, Dict, List

from sqlalchemy.orm import Session

from app.services.analysis_service import AnalysisService
from app.services.graph_service import GraphService
from app.services.grok_client import send_to_grok


class ChatService:
    """Parse user chat queries, run forensic analysis, and request AI explanation."""

    @staticmethod
    def parse_query(text: str) -> Dict[str, Any]:
        lower_text = text.lower().strip()
        numbers: List[str] = re.findall(r"\d+", lower_text)

        if "common" in lower_text:
            if len(numbers) < 2:
                raise ValueError("Common contacts query requires two numbers (num1 and num2).")
            return {
                "intent": "common",
                "params": {"num1": numbers[0], "num2": numbers[1]},
            }

        if "frequent" in lower_text:
            if not numbers:
                raise ValueError("Frequent calls query requires one number.")
            return {
                "intent": "frequent",
                "params": {"number": numbers[0]},
            }

        if "movement" in lower_text:
            if not numbers:
                raise ValueError("Movement query requires one number.")
            return {
                "intent": "movement",
                "params": {"number": numbers[0]},
            }

        if "crime" in lower_text:
            if not numbers:
                raise ValueError("Crime query requires one crime id.")
            return {
                "intent": "crime",
                "params": {"crime_id": int(numbers[0])},
            }

        if "link" in lower_text:
            if not numbers:
                raise ValueError("Link query requires one number.")
            return {
                "intent": "link",
                "params": {"number": numbers[0]},
            }

        raise ValueError("Unsupported query. Use one of: frequent, common, movement, crime, link.")

    @staticmethod
    def process_query(text: str, db: Session) -> Dict[str, Any]:
        parsed = ChatService.parse_query(text)
        intent = parsed["intent"]
        params = parsed["params"]

        if intent == "frequent":
            result = {
                "number": params["number"],
                "results": AnalysisService.get_frequent_contacts(db, params["number"]),
            }
        elif intent == "common":
            result = {
                "num1": params["num1"],
                "num2": params["num2"],
                "common_contacts": AnalysisService.get_common_contacts(db, params["num1"], params["num2"]),
            }
        elif intent == "movement":
            result = {
                "number": params["number"],
                "movement": AnalysisService.get_movement(db, params["number"]),
            }
        elif intent == "crime":
            crime, nearby_numbers = AnalysisService.get_crime_tower_match(db, params["crime_id"])
            result = {
                "crime": crime,
                "nearby_numbers": nearby_numbers,
            }
        elif intent == "link":
            links = AnalysisService.get_links(db, params["number"])
            graph_data = GraphService.build_graph_from_links(links)
            result = {
                "number": params["number"],
                "links": links,
                "nodes": graph_data["nodes"],
                "edges": graph_data["edges"],
            }
        else:
            raise ValueError("Unsupported intent")

        risk_data = AnalysisService.detect_risk(db, result)
        result.update(risk_data)

        prompt = f"""
You are a telecom forensic analysis assistant.

Return answer in clean report format.

Use markdown formatting.

Format:

### Analysis Report

**Key Observations**
- item
- item

**Details**
- item

**Next Steps**
1. step
2. step

Data:
{json.dumps(result, default=str)}
"""
        explanation = send_to_grok(prompt)

        if "#" not in explanation and "**" not in explanation and "- " not in explanation:
            explanation = f"### Analysis Report\n\n**Details**\n- {explanation}"

        return {"result": result, "explanation": explanation}
