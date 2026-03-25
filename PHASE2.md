# Phase 2 Implementation Guide

## What's New in Phase 2

### Backend Enhancements

**New Files:**
- `backend/app/models/forensic_models.py` - SQLAlchemy models for forensic data
- `backend/app/routes/upload.py` - File upload and data import endpoint

**Updated Files:**
- `backend/requirements.txt` - Added pandas, openpyxl, python-multipart
- `backend/app/__init__.py` - Added upload router and table creation

### New API Endpoint

#### POST /upload
Upload Excel files and store in Supabase PostgreSQL

**Request:**
```
POST /upload
Content-Type: multipart/form-data

file: <Excel file>
dataset_type: "cdr" | "tower" | "ipdr" | "crime"
```

**Response:**
```json
{
  "success": true,
  "rows": 150,
  "dataset_type": "cdr",
  "message": "Successfully uploaded 150 rows of CDR data"
}
```

**Error Response:**
```json
{
  "detail": "Error message here"
}
```

### Supported Dataset Types

1. **CDR (Call Detail Records)**
   - Required columns: caller, receiver, time, duration, tower_id
   - Stores phone call metadata

2. **Tower**
   - Required columns: number, tower_id, time, location
   - Stores cell tower data and device locations

3. **IPDR (IP Detail Records)**
   - Required columns: number, ip, time, site
   - Stores internet usage data

4. **Crime**
   - Required columns: crime, tower, time
   - Stores crime event information

### Database Schema

#### CDR Table
```sql
id (Integer, Primary Key)
caller (String)
receiver (String)
time (DateTime)
duration (Integer)
tower_id (String)
created_at (DateTime, auto)
```

#### Tower Dump Table
```sql
id (Integer, Primary Key)
number (String)
tower_id (String)
time (DateTime)
location (String)
created_at (DateTime, auto)
```

#### IPDR Table
```sql
id (Integer, Primary Key)
number (String)
ip (String)
time (DateTime)
site (String)
created_at (DateTime, auto)
```

#### Crime Events Table
```sql
id (Integer, Primary Key)
crime (String)
tower (String)
time (DateTime)
created_at (DateTime, auto)
```

### Frontend Enhancements

**Updated Files:**
- `frontend/src/pages/Analysis.jsx` - Now sends actual file uploads to backend

**Features:**
- File upload with FormData
- Proper error handling
- Success/error messages with response data
- Loading state management
- Form reset after successful upload

### How to Test Phase 2

1. **Create Sample Excel Files**

Create test Excel files with the required columns:

**CDR Data (cdr_sample.xlsx)**
```
caller | receiver | time              | duration | tower_id
08001111111 | 08002222222 | 2026-01-15 10:30:00 | 120 | TOWER_ID_001
08001111111 | 08003333333 | 2026-01-15 11:45:00 | 300 | TOWER_ID_002
```

**Tower Data (tower_sample.xlsx)**
```
number | tower_id | time              | location
08001111111 | TOWER_ID_001 | 2026-01-15 10:00:00 | Downtown Area
08001111111 | TOWER_ID_002 | 2026-01-15 11:00:00 | Airport Area
```

**IPDR Data (ipdr_sample.xlsx)**
```
number | ip | time              | site
08001111111 | 192.168.1.1 | 2026-01-15 09:00:00 | Facebook.com
08001111111 | 192.168.1.2 | 2026-01-15 10:00:00 | Twitter.com
```

**Crime Data (crime_sample.xlsx)**
```
crime | tower | time
Robbery | TOWER_ID_001 | 2026-01-15 10:30:00
Theft | TOWER_ID_002 | 2026-01-15 11:45:00
```

2. **Start the Application**

```bash
# Backend
cd backend
python main.py

# Frontend
cd frontend
npm run dev
```

3. **Test Upload**

- Open http://localhost:5173
- Click "Analyse" button
- Select dataset type
- Choose Excel file
- Click "Start Analysis"
- Check response message

4. **Verify Data in Database**

Using Supabase dashboard:
- Go to SQL Editor
- Query: `SELECT COUNT(*) FROM cdr;`
- Or use pgAdmin to browse tables

### Error Handling

**Common Issues:**

1. **File not found error**
   - Ensure file path is correct
   - File must be Excel format (.xlsx or .xls)

2. **Invalid columns error**
   - Check column names match requirements
   - Column names are case-insensitive but must match
   - Extra columns are ignored

3. **DateTime parsing error**
   - Supported formats: YYYY-MM-DD HH:MM:SS, YYYY-MM-DD, DD/MM/YYYY, etc.
   - Invalid dates are skipped with warning

4. **Database connection error**
   - Verify DATABASE_URL in .env
   - Check Supabase connection is active
   - Verify internet connectivity

### API Documentation

View interactive API docs at: http://localhost:8000/docs

Try endpoints:
- POST /upload - Upload files
- GET /test - Test endpoint
- GET /health - Health check

### Next Steps (Phase 3)

- [ ] Create data analysis endpoints
- [ ] Implement filtering and searching
- [ ] Add data visualization
- [ ] Create relationship analysis
- [ ] Implement NetworkX graph analysis
- [ ] Add export functionality
- [ ] Create dashboard views

---

**Status**: Phase 2 - File Upload & Data Import ✅
