from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import API_TITLE, API_VERSION, API_DESCRIPTION, CORS_ALLOWED_ORIGINS
from app.routes.test import router as test_router
from app.routes.upload import router as upload_router
from app.routes.analysis_routes import router as analysis_router
from app.routes.chat_routes import router as chat_router
from app.routes.case_routes import router as case_router
from app.routes.session_history_routes import router as session_history_router
from app.database import engine, Base

# Import models to ensure they are registered
from app.models.forensic_models import CDR, TowerDump, IPDR, CrimeEvent, Case, Session, HistoryItem

# Create all tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=API_DESCRIPTION,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(test_router)
app.include_router(upload_router)
app.include_router(analysis_router, prefix="/analysis")
app.include_router(chat_router, prefix="/chat")
app.include_router(case_router, prefix="/case")
app.include_router(session_history_router)

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "name": API_TITLE,
        "version": API_VERSION,
        "description": API_DESCRIPTION,
        "endpoints": {
            "test": "/test",
            "upload": "/upload",
            "analysis": "/analysis",
            "chat": "/chat",
            "case": "/case",
            "session_create": "/session/create",
            "session_list": "/session/list",
            "history_add": "/history/add",
            "history_list": "/history/{session_id}",
            "docs": "/docs",
            "openapi": "/openapi.json",
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "telecom-forensics-api"}
