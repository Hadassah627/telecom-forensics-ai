# Phase 2 Testing Guide

## Quick Start Testing

### 1. Prerequisites
- Backend running on http://localhost:8000
- Frontend running on http://localhost:5173
- Sample data files in `sample_data/` directory

### 2. Start Backend (if not running)

Terminal 1:
```bash
cd backend
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 3. Start Frontend (if not running)

Terminal 2:
```bash
cd frontend
npm run dev
```

You should see:
```
Local: http://localhost:5173
```

### 4. Test File Upload

1. **Open Frontend**
   - Navigate to http://localhost:5173
   - Click "Analyse" button in top right

2. **Upload CDR Data**
   - Select "CDR (Call Detail Records)" from dropdown
   - Click file upload area
   - Select `sample_data/cdr_sample.xlsx`
   - Click "Start Analysis"
   - Expected: `Successfully uploaded 5 rows of CDR data`

3. **Upload Tower Data**
   - Select "Tower Data" from dropdown
   - Upload `sample_data/tower_sample.xlsx`
   - Click "Start Analysis"
   - Expected: `Successfully uploaded 5 rows of tower data`

4. **Upload IPDR Data**
   - Select "IPDR (IP Detail Records)" from dropdown
   - Upload `sample_data/ipdr_sample.xlsx`
   - Click "Start Analysis"
   - Expected: `Successfully uploaded 5 rows of ipdr data`

5. **Upload Crime Data**
   - Select "Crime Scene Data" from dropdown
   - Upload `sample_data/crime_sample.xlsx`
   - Click "Start Analysis"
   - Expected: `Successfully uploaded 5 rows of crime data`

### 5. Verify Data in Database

#### Using Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your project
3. Go to "SQL Editor"
4. Run queries:

```sql
-- Check CDR records
SELECT COUNT(*) as cdr_count FROM cdr;
SELECT * FROM cdr LIMIT 5;

-- Check Tower records
SELECT COUNT(*) as tower_count FROM tower_dump;
SELECT * FROM tower_dump LIMIT 5;

-- Check IPDR records
SELECT COUNT(*) as ipdr_count FROM ipdr;
SELECT * FROM ipdr LIMIT 5;

-- Check Crime records
SELECT COUNT(*) as crime_count FROM crime_events;
SELECT * FROM crime_events LIMIT 5;
```

#### Using pgAdmin or Database Tool

1. Connect using DATABASE_URL from .env
2. Browse tables and verify data

### 6. API Testing with Swagger UI

1. Open http://localhost:8000/docs
2. Find POST /upload endpoint
3. Click "Try it out"
4. Upload a file and set dataset_type
5. Click "Execute"
6. View response

### 7. Test Error Handling

**Test 1: Missing File**
- Click "Start Analysis" without selecting file
- Expected: "Please select a file before starting analysis"

**Test 2: Invalid Dataset Type**
- Use developer tools to change dataset_type to "invalid"
- Expected: 400 error with message about valid types

**Test 3: Empty Excel File**
- Create empty Excel file
- Upload it
- Expected: "Excel file is empty"

**Test 4: Missing Required Columns**
- Create Excel with wrong column names
- Upload it
- Expected: Error with missing column names

### 8. Performance Testing

Create larger test files:

```python
import pandas as pd
from datetime import datetime, timedelta

# Generate 1000 rows of CDR data
data = {
    'caller': ['0800' + str(i % 9999).zfill(4) for i in range(1000)],
    'receiver': ['0800' + str((i+1) % 9999).zfill(4) for i in range(1000)],
    'time': [datetime(2026, 1, 15) + timedelta(seconds=i*60) for i in range(1000)],
    'duration': [120 + (i % 300) for i in range(1000)],
    'tower_id': [f'TOWER_{i % 50:03d}' for i in range(1000)],
}

df = pd.DataFrame(data)
df.to_excel('sample_data/cdr_large_1000.xlsx', index=False)
```

Upload this and measure time/rows.

### 9. Check Logs

**Backend Logs:**
- Watch terminal for upload requests
- Look for any errors or warnings

**Frontend Logs:**
- Press F12 in browser
- Check Console tab for upload requests
- Check Network tab for API calls

### 10. Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 Not Found on /upload | Backend not running or file not in database |
| CORS Error | Check CORS_ALLOWED_ORIGINS in backend config |
| Database Connection Error | Verify DATABASE_URL in .env |
| File format not recognized | Ensure file is .xlsx or .xls (not .csv) |
| Column name mismatch | Check column names are exact (case-insensitive) |
| DateTime parsing failed | Ensure dates are in standard format (YYYY-MM-DD) |

### 11. Success Criteria

✅ All files upload successfully
✅ Correct number of rows inserted
✅ Data appears in database
✅ Error messages are helpful
✅ Frontend shows success/error messages
✅ API responds with correct JSON
✅ Database tables are created automatically

### 12. Next Steps

After Phase 2 testing is successful:

1. Create more comprehensive test datasets
2. Test with real forensic data (when available)
3. Implement Phase 3 features:
   - Data analysis endpoints
   - Filtering and search
   - Data visualization
   - NetworkX analysis

---

**Phase 2 Status**: Ready for Testing ✅
