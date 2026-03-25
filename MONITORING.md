# Development Server Monitor - Status Report

**Status**: ✅ Both servers are running

## Backend Server
- **Service**: FastAPI (Uvicorn)
- **Port**: 8000
- **URL**: http://localhost:8000
- **Status**: Running
- **Documentation**: 
  - Swagger UI: http://localhost:8000/docs
  - ReDoc: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health
- **Test Endpoint**: http://localhost:8000/test

## Frontend Server
- **Service**: React + Vite
- **Port**: 5173
- **URL**: http://localhost:5173
- **Status**: Running
- **Hot Reload**: Enabled

## Application Features Ready

### Landing Page (/)
✅ Project title and description
✅ 6 feature cards with descriptions
✅ "Analyse" button (top right)
✅ Professional styling

### Analysis Page (/analysis)
✅ File upload input
✅ Dataset type dropdown (CDR / Tower / IPDR / Crime)
✅ Start Analysis button
✅ Form validation
✅ Success/error messages

### Navigation
✅ API status indicator
✅ Route navigation
✅ Responsive design

## Connection Status
- Frontend → Backend: ✅ Connected
- API test endpoint: ✅ Responding
- CORS: ✅ Configured

## Quick Access Links
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/health
- **Test API**: http://localhost:8000/test

## How to Monitor

### Check Backend Logs
Look at the backend command window for:
- `Uvicorn running on http://0.0.0.0:8000`
- Request logs as you interact with the frontend

### Check Frontend Logs
Look at the frontend command window for:
- `Local: http://localhost:5173`
- Vite dev server activity
- HMR (Hot Module Reload) updates

### Test the Connection
1. Open http://localhost:5173 in your browser
2. Check if "✓ API Connected" appears in the navigation
3. Try clicking "Analyse" button
4. Go to http://localhost:8000/docs to test API endpoints

## Stopping Servers

To stop either server:
1. Go to the respective command window
2. Press `Ctrl+C`

Both will gracefully terminate.

## Troubleshooting

### If API shows "✗ API Disconnected"
1. Verify backend is running on port 8000
2. Check no firewall is blocking the connection
3. Look at browser console for CORS errors
4. Backend may need restart

### If frontend won't start
1. Ensure npm install completed: `npm install` from frontend directory
2. Check port 5173 is not in use: `netstat -ano | findstr :5173`
3. Kill process on port 5173 if needed

### If backend won't start
1. Verify Python is installed: `python --version`
2. Check virtual environment is activated (if using one)
3. Verify requirements installed: `pip install -r requirements.txt`
4. Check .env DATABASE_URL is correct

---

**Started**: March 26, 2026
**Project**: Telecom Forensics AI - Phase 1
