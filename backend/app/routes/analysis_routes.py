from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.analysis_service import AnalysisService
from app.services.graph_service import GraphService

router = APIRouter(tags=["analysis"])


@router.get("/frequent/{number}")
def frequent_calls(number: str, db: Session = Depends(get_db)):
    try:
        data = AnalysisService.get_frequent_contacts(db, number)
        return {"number": number, "results": data}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to get frequent calls: {exc}")


@router.get("/common")
def common_contacts(
    num1: str = Query(..., description="First number"),
    num2: str = Query(..., description="Second number"),
    db: Session = Depends(get_db),
):
    try:
        data = AnalysisService.get_common_contacts(db, num1, num2)
        return {"num1": num1, "num2": num2, "common_contacts": data}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to get common contacts: {exc}")


@router.get("/movement/{number}")
def movement_tracking(number: str, db: Session = Depends(get_db)):
    try:
        data = AnalysisService.get_movement(db, number)
        return {"number": number, "movement": data}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to get movement data: {exc}")


@router.get("/crime/{crime_id}")
def crime_tower_match(crime_id: int, db: Session = Depends(get_db)):
    try:
        crime, numbers = AnalysisService.get_crime_tower_match(db, crime_id)
        if not crime:
            raise HTTPException(status_code=404, detail="Crime event not found")
        return {"crime": crime, "nearby_numbers": numbers}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to get crime tower match: {exc}")


@router.get("/link/{number}")
def link_analysis(number: str, db: Session = Depends(get_db)):
    try:
        links = AnalysisService.get_links(db, number)
        graph_data = GraphService.build_graph_from_links(links)
        return {
            "number": number,
            "links": links,
            "nodes": graph_data["nodes"],
            "edges": graph_data["edges"],
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to get link analysis: {exc}")
