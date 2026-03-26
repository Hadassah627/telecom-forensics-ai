from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class CDR(Base):
    """Call Detail Record Model"""
    __tablename__ = "cdr"

    id = Column(Integer, primary_key=True, index=True)
    caller = Column(String(20), nullable=False, index=True)
    receiver = Column(String(20), nullable=False, index=True)
    time = Column(DateTime, nullable=False, index=True)
    duration = Column(Integer, nullable=False)  # Duration in seconds
    tower_id = Column(String(50), nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<CDR(caller={self.caller}, receiver={self.receiver}, duration={self.duration})>"


class TowerDump(Base):
    """Tower Dump/Tower Location Data Model"""
    __tablename__ = "tower_dump"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String(20), nullable=False, index=True)
    tower_id = Column(String(50), nullable=False, index=True)
    time = Column(DateTime, nullable=False, index=True)
    location = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<TowerDump(number={self.number}, tower_id={self.tower_id}, location={self.location})>"


class IPDR(Base):
    """IP Detail Record Model"""
    __tablename__ = "ipdr"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String(20), nullable=False, index=True)
    ip = Column(String(15), nullable=False, index=True)
    time = Column(DateTime, nullable=False, index=True)
    site = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<IPDR(number={self.number}, ip={self.ip}, site={self.site})>"


class CrimeEvent(Base):
    """Crime Event Data Model"""
    __tablename__ = "crime_events"

    id = Column(Integer, primary_key=True, index=True)
    crime = Column(String(255), nullable=False, index=True)
    tower = Column(String(50), nullable=False, index=True)
    time = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<CrimeEvent(crime={self.crime}, tower={self.tower}, time={self.time})>"


class Case(Base):
    """Saved analysis case snapshot model."""
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    data_json = Column(JSON, nullable=False)
    report_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    def __repr__(self):
        return f"<Case(id={self.id}, name={self.name})>"


class Session(Base):
    """Investigation chat session model."""
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    name = Column(String(255), nullable=False, index=True)

    history_items = relationship(
        "HistoryItem",
        back_populates="session",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self):
        return f"<Session(id={self.id}, name={self.name})>"


class HistoryItem(Base):
    """Single query/result history entry tied to a session."""
    __tablename__ = "history_items"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    query_text = Column(String(2000), nullable=False)
    summary_text = Column(String(4000), nullable=False)
    report_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    session = relationship("Session", back_populates="history_items")

    def __repr__(self):
        return f"<HistoryItem(id={self.id}, session_id={self.session_id})>"
