from datetime import datetime
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session as DbSession

from app.database import get_db
from app.models.forensic_models import HistoryItem, Session

router = APIRouter(tags=["session-history"])


class SessionCreateRequest(BaseModel):
    name: Optional[str] = Field(default=None, max_length=255)


class HistoryAddRequest(BaseModel):
    session_id: int
    query_text: str = Field(..., min_length=1, max_length=2000)
    summary_text: str = Field(..., min_length=1, max_length=4000)
    report_json: Dict[str, Any] = Field(default_factory=dict)


@router.post("/session/create")
def create_session(request: SessionCreateRequest, db: DbSession = Depends(get_db)):
    session_name = (request.name or '').strip()
    if not session_name:
        session_name = f"Session {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"

    session_item = Session(name=session_name)
    db.add(session_item)
    db.commit()
    db.refresh(session_item)

    return {
        "session_id": session_item.id,
        "name": session_item.name,
        "created_at": session_item.created_at.isoformat() if session_item.created_at else None,
    }


@router.get("/session/list")
def list_sessions(db: DbSession = Depends(get_db)):
    session_items = (
        db.query(Session)
        .order_by(Session.created_at.desc(), Session.id.desc())
        .limit(100)
        .all()
    )

    return [
        {
            "id": item.id,
            "name": item.name,
            "created_at": item.created_at.isoformat() if item.created_at else None,
        }
        for item in session_items
    ]


@router.post("/history/add")
def add_history_item(request: HistoryAddRequest, db: DbSession = Depends(get_db)):
    session_item = db.query(Session).filter(Session.id == request.session_id).first()
    if not session_item:
        raise HTTPException(status_code=404, detail="Session not found")

    history_item = HistoryItem(
        session_id=request.session_id,
        query_text=request.query_text.strip(),
        summary_text=request.summary_text.strip(),
        report_json=request.report_json,
    )
    db.add(history_item)
    db.commit()
    db.refresh(history_item)

    return {
        "id": history_item.id,
        "session_id": history_item.session_id,
        "created_at": history_item.created_at.isoformat() if history_item.created_at else None,
    }


@router.get("/history/{session_id}")
def get_history(session_id: int, db: DbSession = Depends(get_db)):
    session_item = db.query(Session).filter(Session.id == session_id).first()
    if not session_item:
        raise HTTPException(status_code=404, detail="Session not found")

    items = (
        db.query(HistoryItem)
        .filter(HistoryItem.session_id == session_id)
        .order_by(HistoryItem.created_at.desc(), HistoryItem.id.desc())
        .all()
    )

    return [
        {
            "id": item.id,
            "session_id": item.session_id,
            "query_text": item.query_text,
            "summary_text": item.summary_text,
            "report_json": item.report_json or {},
            "created_at": item.created_at.isoformat() if item.created_at else None,
        }
        for item in items
    ]


@router.delete("/session/clear-all")
def clear_all_sessions(db: DbSession = Depends(get_db)):
    """Delete all sessions and their history items"""
    try:
        db.query(HistoryItem).delete()
        db.query(Session).delete()
        db.commit()
        return {"message": "All sessions cleared successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to clear sessions: {str(e)}")
