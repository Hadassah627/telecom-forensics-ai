from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.forensic_models import Case

router = APIRouter(tags=["case"])


class CaseSaveRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    data_json: Dict[str, Any] = Field(default_factory=dict)
    report_json: Dict[str, Any] = Field(default_factory=dict)


@router.post("/save")
def save_case(request: CaseSaveRequest, db: Session = Depends(get_db)):
    case_name = request.name.strip()
    if not case_name:
        raise HTTPException(status_code=400, detail="Case name is required")

    new_case = Case(
        name=case_name,
        data_json=request.data_json,
        report_json=request.report_json,
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    return {
        "id": new_case.id,
        "name": new_case.name,
        "created_at": new_case.created_at.isoformat() if new_case.created_at else None,
    }


@router.get("/list")
def list_cases(db: Session = Depends(get_db)):
    case_items = (
        db.query(Case)
        .order_by(Case.created_at.desc(), Case.id.desc())
        .limit(100)
        .all()
    )

    return [
        {
            "id": case_item.id,
            "name": case_item.name,
            "created_at": case_item.created_at.isoformat() if case_item.created_at else None,
        }
        for case_item in case_items
    ]


@router.get("/load/{case_id}")
def load_case(case_id: int, db: Session = Depends(get_db)):
    case_item = db.query(Case).filter(Case.id == case_id).first()
    if not case_item:
        raise HTTPException(status_code=404, detail="Case not found")

    return {
        "id": case_item.id,
        "name": case_item.name,
        "data_json": case_item.data_json or {},
        "report_json": case_item.report_json or {},
        "created_at": case_item.created_at.isoformat() if case_item.created_at else None,
    }
