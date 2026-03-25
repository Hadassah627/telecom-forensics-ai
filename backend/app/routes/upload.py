import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.forensic_models import CDR, TowerDump, IPDR, CrimeEvent

router = APIRouter(tags=["upload"])


def parse_datetime(value):
    """Helper to parse datetime from various formats"""
    if pd.isna(value):
        return None
    if isinstance(value, datetime):
        return value
    # Try common datetime formats
    formats = ['%Y-%m-%d %H:%M:%S', '%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y', '%Y/%m/%d']
    for fmt in formats:
        try:
            return pd.to_datetime(value, format=fmt)
        except:
            continue
    # Fall back to pandas parsing
    try:
        return pd.to_datetime(value)
    except:
        return None


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    dataset_type: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Upload Excel file and store data in appropriate table.
    
    Args:
        file: Excel file (.xlsx or .xls)
        dataset_type: Type of dataset (cdr, tower, ipdr, crime)
        db: Database session
    
    Returns:
        JSON with success status and number of rows inserted
    """
    
    # Validate dataset_type
    valid_types = ['cdr', 'tower', 'ipdr', 'crime']
    if dataset_type.lower() not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid dataset_type. Must be one of: {', '.join(valid_types)}"
        )
    
    try:
        # Read Excel file
        contents = await file.read()
        excel_file = io.BytesIO(contents)
        
        # Try reading with openpyxl engine first (for .xlsx files)
        try:
            df = pd.read_excel(excel_file, engine='openpyxl')
        except:
            # Fall back to other engines
            excel_file.seek(0)
            df = pd.read_excel(excel_file)
        
        if df.empty:
            raise HTTPException(
                status_code=400,
                detail="Excel file is empty"
            )
        
        # Process based on dataset_type
        dataset_type = dataset_type.lower()
        rows_inserted = 0
        
        if dataset_type == 'cdr':
            rows_inserted = _insert_cdr_data(df, db)
        elif dataset_type == 'tower':
            rows_inserted = _insert_tower_data(df, db)
        elif dataset_type == 'ipdr':
            rows_inserted = _insert_ipdr_data(df, db)
        elif dataset_type == 'crime':
            rows_inserted = _insert_crime_data(df, db)
        
        db.commit()
        
        return {
            "success": True,
            "rows": rows_inserted,
            "dataset_type": dataset_type,
            "message": f"Successfully uploaded {rows_inserted} rows of {dataset_type.upper()} data"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )


def _insert_cdr_data(df: pd.DataFrame, db: Session) -> int:
    """
    Insert CDR (Call Detail Record) data.
    Expected columns: caller, receiver, time, duration, tower_id
    """
    rows_inserted = 0
    
    # Normalize column names to lowercase
    df.columns = [col.lower().strip() for col in df.columns]
    
    required_cols = ['caller', 'receiver', 'time', 'duration', 'tower_id']
    missing = [col for col in required_cols if col not in df.columns]
    if missing:
        raise ValueError(f"CDR data missing required columns: {missing}")
    
    for _, row in df.iterrows():
        try:
            parsed_time = parse_datetime(row['time'])
            if parsed_time is None:
                continue
            
            cdr = CDR(
                caller=str(row['caller']).strip(),
                receiver=str(row['receiver']).strip(),
                time=parsed_time,
                duration=int(float(row['duration'])) if pd.notna(row['duration']) else 0,
                tower_id=str(row['tower_id']).strip()
            )
            db.add(cdr)
            rows_inserted += 1
        except Exception as e:
            # Skip rows with errors
            continue
    
    return rows_inserted


def _insert_tower_data(df: pd.DataFrame, db: Session) -> int:
    """
    Insert Tower Dump data.
    Expected columns: number, tower_id, time, location
    """
    rows_inserted = 0
    
    # Normalize column names
    df.columns = [col.lower().strip() for col in df.columns]
    
    required_cols = ['number', 'tower_id', 'time', 'location']
    missing = [col for col in required_cols if col not in df.columns]
    if missing:
        raise ValueError(f"Tower data missing required columns: {missing}")
    
    for _, row in df.iterrows():
        try:
            parsed_time = parse_datetime(row['time'])
            if parsed_time is None:
                continue
            
            tower = TowerDump(
                number=str(row['number']).strip(),
                tower_id=str(row['tower_id']).strip(),
                time=parsed_time,
                location=str(row['location']).strip()
            )
            db.add(tower)
            rows_inserted += 1
        except Exception as e:
            continue
    
    return rows_inserted


def _insert_ipdr_data(df: pd.DataFrame, db: Session) -> int:
    """
    Insert IPDR (IP Detail Record) data.
    Expected columns: number, ip, time, site
    """
    rows_inserted = 0
    
    # Normalize column names
    df.columns = [col.lower().strip() for col in df.columns]
    
    required_cols = ['number', 'ip', 'time', 'site']
    missing = [col for col in required_cols if col not in df.columns]
    if missing:
        raise ValueError(f"IPDR data missing required columns: {missing}")
    
    for _, row in df.iterrows():
        try:
            parsed_time = parse_datetime(row['time'])
            if parsed_time is None:
                continue
            
            ipdr = IPDR(
                number=str(row['number']).strip(),
                ip=str(row['ip']).strip(),
                time=parsed_time,
                site=str(row['site']).strip()
            )
            db.add(ipdr)
            rows_inserted += 1
        except Exception as e:
            continue
    
    return rows_inserted


def _insert_crime_data(df: pd.DataFrame, db: Session) -> int:
    """
    Insert Crime Event data.
    Expected columns: crime, tower, time
    """
    rows_inserted = 0
    
    # Normalize column names
    df.columns = [col.lower().strip() for col in df.columns]
    
    required_cols = ['crime', 'tower', 'time']
    missing = [col for col in required_cols if col not in df.columns]
    if missing:
        raise ValueError(f"Crime data missing required columns: {missing}")
    
    for _, row in df.iterrows():
        try:
            parsed_time = parse_datetime(row['time'])
            if parsed_time is None:
                continue
            
            crime = CrimeEvent(
                crime=str(row['crime']).strip(),
                tower=str(row['tower']).strip(),
                time=parsed_time
            )
            db.add(crime)
            rows_inserted += 1
        except Exception as e:
            continue
    
    return rows_inserted
