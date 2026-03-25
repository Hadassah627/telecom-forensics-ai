# Getting Started with Telecom Forensics AI

A step-by-step guide to set up and run the project locally.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version` && `npm --version`

2. **Python** (3.10 or higher)
   - Download from: https://www.python.org/
   - Verify: `python --version`

3. **Git** (for version control)
   - Download from: https://git-scm.com/

4. **Supabase Account** (for PostgreSQL database)
   - Sign up at: https://supabase.com/
   - Create a new project to get database credentials

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/telecom-forensics-ai.git
cd telecom-forensics-ai
```

### Step 2: Set Up Backend

1. **Navigate to backend folder**:
```bash
cd backend
```

2. **Create Python virtual environment**:
```bash
python -m venv venv
```

3. **Activate virtual environment**:
   - **Windows**: `venv\Scripts\activate`
   - **macOS/Linux**: `source venv/bin/activate`

4. **Install Python dependencies**:
```bash
pip install -r requirements.txt
```

5. **Create `.env` file**:
```bash
cp .env.example .env
```

6. **Edit `.env` file** with your Supabase credentials:
```
DATABASE_URL=postgresql://postgres:yourpassword@db.supabaseproject.co:5432/postgres
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
API_LOG_LEVEL=info
```

7. **Test backend** (in backend directory):
```bash
python main.py
```

You should see: `Uvicorn running on http://0.0.0.0:8000`

Visit: http://localhost:8000/docs to see API documentation

### Step 3: Set Up Frontend

1. **In a new terminal, navigate to frontend folder**:
```bash
cd frontend
```

2. **Install Node dependencies**:
```bash
npm install
```

3. **Create `.env` file**:
```bash
cp .env.example .env
```

4. **Edit `.env` file** (usually no changes needed for local development):
```
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

5. **Start development server**:
```bash
npm run dev
```

You should see: `Local: http://localhost:5173`

### Step 4: Access the Application

Open your browser and navigate to: **http://localhost:5173** (or http://localhost:3000)

You should see:
- The Telecom Forensics AI landing page
- An API status indicator (green = connected, red = disconnected)
- "Analyse" button in the top right

## Verifying the Setup

### Backend Health Check

Open in browser: http://localhost:8000/health

Expected response:
```json
{"status": "healthy", "service": "telecom-forensics-api"}
```

### Frontend-Backend Connection

1. On the landing page, check the API status indicator near the "Analyse" button
2. It should show: `✓ API Connected`
3. If it shows `✗ API Disconnected`:
   - Ensure backend is running on port 8000
   - Check browser console for errors
   - Verify `.env` variables in both frontend and backend

### Test API Endpoint

Visit: http://localhost:8000/test

Expected response:
```json
{"message": "API working", "status": "success"}
```

## Database Setup (Supabase)

1. **Create Supabase account**: https://supabase.com/
2. **Create new project** with PostgreSQL database
3. **Get connection string**:
   - Go to Project Settings → Database
   - Copy "Connection String" (PostgreSQL)
   - Replace placeholders with actual credentials
4. **Put in backend `.env` file**:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```

## Project Features - Phase 1

✅ **Landing Page**
- Project title and description
- 6 feature cards
- "Analyse" button

✅ **Analysis Page**
- Upload file input
- Dataset type dropdown (CDR, Tower, IPDR, Crime)
- Start Analysis button
- Success/error messages

✅ **Backend API**
- GET `/test` - Test endpoint
- GET `/health` - Health check
- GET `/` - API info
- CORS enabled for frontend

## Common Issues & Solutions

### Issue: "ModuleNotFoundError: No module named 'fastapi'"
**Solution**: 
- Ensure virtual environment is activated
- Run: `pip install -r requirements.txt`

### Issue: "Cannot GET http://localhost:8000/test"
**Solution**:
- Ensure backend server is running
- Check that port 8000 is not in use
- Try: `python main.py` in backend directory

### Issue: "Cannot find module 'react'" in frontend
**Solution**:
- Ensure Node.js is installed
- Run: `npm install` in frontend directory

### Issue: API status shows "Disconnected"
**Solution**:
- Backend must be running on http://localhost:8000
- Check frontend `.env` has correct API_BASE_URL
- Check browser console for CORS errors

### Issue: Database connection fails
**Solution**:
- Verify DATABASE_URL in `.env` is correct
- Check Supabase credentials
- Ensure PostgreSQL is accessible

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
   - Frontend: Changes auto-refresh in browser
   - Backend: Changes auto-restart with `reload=true`

2. **API Documentation**: View interactive docs at http://localhost:8000/docs

3. **Browser DevTools**: Open with F12 to debug frontend issues

4. **Python Debugging**: Add breakpoints in backend code for debugging

## Next Steps

After successful setup:

1. **Explore the UI**:
   - Visit landing page
   - Click "Analyse" to go to analysis page
   - Try uploading a file (CSV, JSON, Excel)

2. **Check API Documentation**:
   - Visit http://localhost:8000/docs
   - Try out endpoints with Swagger UI

3. **Review Code Structure**:
   - Frontend: `frontend/src/pages` and `frontend/src/components`
   - Backend: `backend/app/routes` and `backend/app/models`

4. **Plan Phase 2 Features**:
   - File processing endpoints
   - Database models for forensic data
   - AI analysis integration

## Need Help?

- Check the main [README.md](README.md) for project overview
- Review `.env.example` files for required variables
- Check browser console (F12) for frontend errors
- Check terminal output for backend errors

---

Happy hacking! 🚀
