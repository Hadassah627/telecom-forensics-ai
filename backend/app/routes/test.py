from fastapi import APIRouter

router = APIRouter(tags=["test"])

@router.get("/test")
async def test_endpoint():
    """
    Test endpoint to verify API is working.
    Returns a simple success message.
    """
    return {"message": "API working", "status": "success"}
