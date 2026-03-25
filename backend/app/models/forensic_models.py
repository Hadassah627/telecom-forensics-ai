from sqlalchemy import Column, Integer, String, DateTime, Float
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
