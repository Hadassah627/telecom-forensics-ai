import os
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

# Database Configuration
# For local development, fall back to a sqlite file if DATABASE_URL is not set.
# This avoids hard-failing when the developer doesn't have a Postgres URL configured.
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Fallback to a local sqlite DB for quick local development/testing
    DATABASE_URL = "sqlite:///./dev.db"
    # Note: sqlite URLs don't need sslmode adjustments below

# Ensure the URL format is correct for SQLAlchemy
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Supabase Postgres requires TLS. If sslmode is missing on a Supabase host,
# append sslmode=require to avoid connection issues across environments.
parsed = urlparse(DATABASE_URL)
if "supabase.co" in (parsed.hostname or "") and "sslmode=" not in DATABASE_URL:
    separator = "&" if "?" in DATABASE_URL else "?"
    DATABASE_URL = f"{DATABASE_URL}{separator}sslmode=require"

# SQLAlchemy engine configuration
SQLALCHEMY_KWARGS = {
    "echo": False,
    "pool_pre_ping": True,
    "pool_size": 20,
    "max_overflow": 40,
}

# API Configuration
API_TITLE = "Telecom Forensics AI API"
API_VERSION = "0.0.1"
API_DESCRIPTION = "AI-powered forensic analysis API for telecommunications data"

# CORS Configuration
# Include the ports commonly used by this project's frontend during development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
