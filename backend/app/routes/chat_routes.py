from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.chat_service import ChatService

router = APIRouter(tags=["chat"])


class ChatRequest(BaseModel):
    message: str


@router.post("")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    message = request.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="message is required")

    try:
        output = ChatService.process_query(message, db)
        return {
            "result": output["result"],
            "explanation": output["explanation"],
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {exc}")
