# Telecom Forensics AI - Hackathon Project

An AI-powered analysis platform for telecommunications and digital forensics data. This project enables forensic investigators to analyze CDR (Call Detail Records), tower data, IPDR (IP Detail Records), and crime scene data to uncover patterns and connections.

## Project Structure

```
telecom-forensics-ai/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/           # Page components (Landing, Analysis)
│   │   ├── components/      # Reusable components (Navigation)
│   │   ├── App.jsx          # Main app component with routing
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── .env.example
│
└── backend/                  # FastAPI backend
    ├── app/
    │   ├── routes/          # API route handlers
    │   │   └── test.py     # Test endpoint
    │   ├── models/          # Database models
    │   ├── config.py        # Configuration
    │   ├── database.py      # Database setup
    │   └── __init__.py      # FastAPI app initialization
    ├── main.py              # Entry point
    ├── requirements.txt     # Python dependencies
    └── .env.example
```

## Phase 2 - File Upload & Data Import ✅

### What's New
- POST /upload endpoint for Excel file uploads
- SQLAlchemy models for forensic data (CDR, Tower, IPDR, Crime)
- Pandas integration for Excel data processing
- Automatic table creation with database connection
- Frontend file upload with error handling
- Sample test data generator

### Supported Dataset Types
1. **CDR** - Call Detail Records (caller, receiver, time, duration, tower_id)
2. **Tower** - Tower Dump Data (number, tower_id, time, location)
3. **IPDR** - IP Detail Records (number, ip, time, site)
4. **Crime** - Crime Events (crime, tower, time)

### Using Phase 2 Features

#### Generate Sample Data
```bash
python generate_sample_data.py
# Creates sample_data/ directory with test files
```

#### Upload Files via Frontend
1. Start both servers
2. Open http://localhost:5173
3. Click "Analyse" button
4. Select dataset type and file
5. Click "Start Analysis"
6. View success/error message

#### Upload Files via API
```bash
curl -X POST "http://localhost:8000/upload" \
  -F "file=@sample_data/cdr_sample.xlsx" \
  -F "dataset_type=cdr"
```

Response:
```json
{
  "success": true,
  "rows": 5,
  "dataset_type": "cdr",
  "message": "Successfully uploaded 5 rows of CDR data"
}
```

### Phase 2 Files
- `backend/app/models/forensic_models.py` - Database models
- `backend/app/routes/upload.py` - Upload endpoint
- `frontend/src/pages/Analysis.jsx` - Updated with real upload
- `PHASE2.md` - Detailed Phase 2 documentation
- `TESTING_GUIDE.md` - Complete testing instructions

### Database Models
Tables are automatically created on startup:
- `cdr` - Call detail records
- `tower_dump` - Tower/location data
- `ipdr` - IP usage records
- `crime_events` - Crime information

See [PHASE2.md](PHASE2.md) for detailed schema information.

### Testing Phase 2
See [TESTING_GUIDE.md](TESTING_GUIDE.md) for:
- Step-by-step testing instructions
- Sample data generation
- Error handling tests
- Performance testing
- Database verification

---



## Features (Phase 1)

### Landing Page
- Project title and description
- Feature cards showcasing key capabilities:
  - CDR Analysis
  - Tower Data Analysis
  - IPDR Processing
  - Crime Scene Correlation
  - AI-Powered Insights
  - Network Visualization
- "Analyse" button to navigate to analysis page

### Analysis Page
- File upload input with drag-and-drop support
- Dataset type dropdown (CDR, Tower, IPDR, Crime)
- Start Analysis button
- Validation and feedback messages

### Routes
- `/` → Landing page
- `/analysis` → Analysis page with upload functionality

### Backend API
- `GET /` → API information endpoint
- `GET /test` → Test endpoint returning "API working"
- `GET /health` → Health check endpoint
- CORS configured for frontend communication

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- PostgreSQL (or Supabase account)
- Git

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

5. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173` (or `http://localhost:3000` based on vite.config.js)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create `.env` file:
```bash
cp .env.example .env
```

6. Configure environment variables in `.env`:
```
DATABASE_URL=postgresql://user:password@host:port/database
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
API_LOG_LEVEL=info
```

7. Start development server:
```bash
python main.py
```

Backend will run on `http://localhost:8000`

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## Frontend Components

### Navigation Component
- Displays project title
- API status indicator
- "Analyse" button to navigate to analysis page

### Landing Page
- Hero section with project description
- Feature cards grid
- Professional styling with hover effects

### Analysis Page
- Dataset type dropdown selector
- File upload input with visual feedback
- Start Analysis button
- Loading state and error handling
- Success/error message display

## Environment Configuration

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:port/database
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
API_LOG_LEVEL=info
```

### Database URL Format (Supabase)
```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
```

Get these credentials from your Supabase project dashboard:
1. Go to Project Settings → Database
2. Copy the connection string (PostgreSQL or PostgreSQL URI)
3. Replace [user], [password], [host], [port], [database]

## Development Workflow

1. **Terminal 1 - Backend**:
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

2. **Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

3. **Access the application**:
   - Frontend: http://localhost:3000 (or http://localhost:5173)
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Next Steps (Phase 2)

- [ ] Implement file upload and processing endpoints
- [ ] Create database models for forensic data
- [ ] Implement CDR/Tower/IPDR data parsing
- [ ] Integrate Grok API for AI analysis
- [ ] Add NetworkX for relationship mapping
- [ ] Implement Pandas data processing
- [ ] Create analysis results visualization pages
- [ ] Add user authentication
- [ ] Implement data persistence
- [ ] Add advanced filtering and search

## Testing the API Connection

The frontend automatically tests the backend connection on load:
- Green indicator: `✓ API Connected` - Backend is running
- Red indicator: `✗ API Disconnected` - Backend is not accessible
- Yellow indicator: `Checking API...` - Testing connection

## Project Guidelines

- **Code Style**: Follow PEP 8 (Python) and ESLint (JavaScript)
- **Components**: Keep components small and focused
- **State Management**: Use React hooks for state management
- **API Calls**: Use axios for HTTP requests
- **Environment Variables**: Never commit `.env` files
- **Git**: Use meaningful commit messages

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit messages: `git commit -m "feat: describe your changes"`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is part of the Telecom Forensics AI hackathon initiative.

## Support

For issues, questions, or contributions, please reach out to the development team.

---

**Status**: Phase 1 - Foundation & Setup ✅
**Last Updated**: March 2026
