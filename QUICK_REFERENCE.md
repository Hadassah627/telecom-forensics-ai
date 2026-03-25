# Phase 2 Quick Reference

## Start Development Environment

```bash
# Terminal 1 - Backend
cd backend
python main.py
# Runs on http://localhost:8000

# Terminal 2 - Frontend  
cd frontend
npm run dev
# Runs on http://localhost:5173
```

## Generate Test Data

```bash
# Root directory
python generate_sample_data.py
# Creates Excel files in sample_data/
```

## Test File Upload

1. Go to http://localhost:5173
2. Click "Analyse" button
3. Select dataset type (CDR, Tower, IPDR, Crime)
4. Upload Excel file from sample_data/
5. Click "Start Analysis"
6. View success message with row count

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /upload | Upload Excel file |
| GET | /test | Test API |
| GET | /health | Health check |
| GET | /docs | Swagger API docs |

## Files Structure

**Backend**
- `app/models/forensic_models.py` - Database models (4 tables)
- `app/routes/upload.py` - Upload endpoint with Pandas processing
- `requirements.txt` - Dependencies (includes pandas, openpyxl)

**Frontend**
- `src/pages/Analysis.jsx` - Real API integration with error handling

**Documentation**
- `PHASE2.md` - Detailed Phase 2 info
- `TESTING_GUIDE.md` - Step-by-step testing
- `PHASE2_SUMMARY.md` - Completion summary

**Sample Data**
- `sample_data/*.xlsx` - Test files (5 rows each)
- `generate_sample_data.py` - Script to create test data

## Database

Tables created automatically on startup:
- `cdr` - Call detail records
- `tower_dump` - Tower/location data
- `ipdr` - IP detail records
- `crime_events` - Crime information

## Required Columns

| Dataset | Columns |
|---------|---------|
| CDR | caller, receiver, time, duration, tower_id |
| Tower | number, tower_id, time, location |
| IPDR | number, ip, time, site |
| Crime | crime, tower, time |

## Configuration

`.env` file settings:
```
DATABASE_URL=postgresql://...  # Supabase connection string
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
```

## Success Response

```json
{
  "success": true,
  "rows": 5,
  "dataset_type": "cdr",
  "message": "Successfully uploaded 5 rows of CDR data"
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error | Backend running on 8000? |
| Database error | Check DATABASE_URL in .env |
| File not found | Use .xlsx or .xls files |
| Column error | Check exact column names |

## Next Steps

1. Test all 4 dataset types
2. Verify data in Supabase
3. Check API docs at /docs
4. Plan Phase 3 features

---

See TESTING_GUIDE.md for detailed testing procedures.
