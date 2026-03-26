# Telecom Forensics AI 🔍

**Advanced AI-powered forensic analysis platform** for telecom investigations with intelligent risk detection, interactive map visualization, animated graph networks, timeline-based filtering, session history, and comprehensive report generation.

---

## 🌟 Key Features

### Core Forensic Investigation Features
- 📊 **Dataset Upload & Parsing**: Import Excel files with CDR (Call Detail Records), Tower, IPDR (Internet Protocol Detail Records), and Crime data
- 💬 **AI-Powered Chat Interface**: Investigator-style natural language queries with intelligent response generation
- 📋 **Structured Report Generation**: Comprehensive case reports with observations, details, and next steps
- 💾 **Case Management**: Save and load cases with full analysis history

### Advanced Visual Intelligence (NEW)
- 🗺️ **Interactive Map View**: Geomapped tower locations with color-coded markers
  - Crime locations (red marker)
  - Suspect towers (amber marker)
  - Normal towers (green marker)
  - Movement paths connecting location sequences
- 📈 **Animated Force-Directed Graph**: D3-powered network visualization with:
  - Animated particle effects on connection links
  - Main subject highlighting (yellow nodes)
  - Suspect highlighting (red nodes)
  - Interactive pan, zoom, and node dragging
- ⏱️ **Timeline Slider**: Range-based filtering with:
  - Call timeline range selection
  - Tower/location context display
  - Real-time visualization updates
- 🚨 **Risk Detection & Alerts**: Intelligent threat assessment with:
  - **HIGH Risk**: ≥3 risk factors (red alert)
  - **MEDIUM Risk**: ≥2 risk factors (amber alert)
  - **LOW Risk**: <2 risk factors (green alert)
  - Risk factors: high call volume, crime proximity, network links, late-night activity
- 🎯 **Suspect Highlighting**: Automatic suspect cell highlighting in tables with color coding

### Session History & Persistence
- 📚 **Session Management**: Track multiple investigation sessions
- 🔄 **History Cards**: Load previous analysis reports without re-running queries
- 🧹 **Clear All Sessions**: Bulk cleanup of old/test sessions
- 📍 **On-Demand Creation**: Sessions created only when Send is clicked (prevents empty sessions)

### Language & Accessibility
- 🗣️ **Multilingual Support**: English, Hindi, Telugu, Tamil, Kannada
- 🔊 **Enhanced Text-to-Speech**: Remote TTS with fallback chain:
  1. Primary: Google Translate endpoint
  2. Secondary: Alternative TTS endpoint
  3. Fallback: Browser native voices
- 📱 **Responsive Design**: Works on desktop and mobile

### Report & Export
- 📄 **PDF Export**: Generate professional investigation reports with all visualizations
- 🖼️ **Multi-View Reports**: Includes risk alerts, suspect badges, timeline, map, graph, and data tables

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.2.0 with Vite 5.4 (fast development & production builds)
- **Visualization Libraries**:
  - `react-leaflet`: Interactive map rendering with Leaflet.js
  - `react-force-graph-2d`: D3-powered force-directed graph visualization
- **Export & Reporting**:
  - `html2canvas`: Capture DOM as canvas for PDF
  - `jsPDF`: PDF generation and download
- **API Client**: Axios & Fetch API
- **Routing**: React Router v6
- **State Management**: React Hooks (useState, useMemo, useRef, useEffect)
- **Styling**: CSS3 with responsive design

### Backend
- **Framework**: FastAPI (fast, async-capable REST API)
- **ORM**: SQLAlchemy with async support
- **Database**: PostgreSQL (Supabase-compatible)
- **Authentication**: JWT (ready for integration)
- **AI Integration**: Grok API for intelligent analysis
- **Graph Analysis**: NetworkX for relationship mapping
- **Data Processing**: Pandas for dataset parsing and analysis
- **Task Queue**: Celery (optional for background tasks)

### Key Dependencies
```
Frontend: React, Vite, Leaflet, D3, jsPDF
Backend: FastAPI, SQLAlchemy, PostgreSQL, Pandas, NetworkX, Grok
```

---

## 📁 Project Structure

```text
telecom-forensics-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatPanel.jsx              # AI chat interface
│   │   │   ├── ReportCard.jsx             # Case report display
│   │   │   ├── HistoryModal.jsx           # Session/history management
│   │   │   ├── MapView.jsx                # Leaflet map with towers & movement
│   │   │   ├── ForceGraphView.jsx         # D3 animated network graph
│   │   │   ├── TimelineSlider.jsx         # Call timeline range selector
│   │   │   ├── DynamicTable.jsx           # Forensic data tables
│   │   │   ├── RiskAlert.jsx              # Risk level indicator (NEW)
│   │   │   ├── CaseLoader.jsx             # Case loading UI
│   │   │   └── ...other components
│   │   ├── pages/
│   │   │   ├── Home.jsx                   # Landing page
│   │   │   ├── Analysis.jsx               # Main analysis orchestrator
│   │   │   └── ...other pages
│   │   ├── api/
│   │   │   ├── chatService.js             # Chat API integration
│   │   │   └── analysisService.js         # Analysis queries
│   │   ├── App.jsx
│   │   └── index.css                      # Global styling (30+ new risk rules)
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   └── forensic_models.py         # CDR, Tower, Crime, Case, Session models
│   │   ├── services/
│   │   │   ├── analysis_service.py        # Core forensic queries + risk detection
│   │   │   ├── chat_service.py            # Intent parsing + AI response
│   │   │   └── ...other services
│   │   ├── routes/
│   │   │   ├── analysis_routes.py         # Analysis endpoints with risk metadata
│   │   │   ├── case_routes.py             # Case save/load
│   │   │   ├── session_history_routes.py  # Session management
│   │   │   └── ...other routes
│   │   └── __init__.py
│   ├── .env.example
│   ├── main.py
│   └── requirements.txt
│
├── start-backend.bat                      # Quick start script
├── start-frontend.bat                     # Quick start script
└── README.md
```

### Frontend Components (New/Enhanced)
| Component | Purpose | New Features |
|-----------|---------|--------------|
| **MapView** | Geospatial tower visualization | Crime/suspect marker filtering, movement paths, location popups |
| **ForceGraphView** | Network relationship graph | Particle animation, main/suspect node coloring, interactive drag |
| **TimelineSlider** | Call timeline filtering | Tower context display, real-time sync |
| **RiskAlert** | Risk level indicator | HIGH/MEDIUM/LOW alerts with reasons |
| **DynamicTable** | Forensic data display | Suspect cell highlighting |

### Backend Services (New/Enhanced)
| Service | Purpose | New Endpoints |
|---------|---------|---------------|
| **analysis_service.py** | Core forensic queries | `detect_risk()`, `get_tower_coordinates()` |
| **chat_service.py** | Intent parsing + AI | Risk enrichment on all queries |
| **analysis_routes.py** | REST API endpoints | Risk metadata in 5 query types |

---

## 🚀 How To Run

### Prerequisites

- **Node.js** 18+ (with npm)
- **Python** 3.10+ (with pip)
- **PostgreSQL** or **Supabase** database (cloud PostgreSQL)
- **Git** (for version control)

### ⚡ Quick Start (Windows)

From the repository root directory:

```bash
# Terminal 1 - Start Backend
start-backend.bat

# Terminal 2 - Start Frontend
start-frontend.bat
```

Then open: **http://localhost:3000** in your browser

### 🔧 Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
```

**Edit `backend/.env`** (minimum configuration):

```env
# Database Connection (Get from Supabase Project Settings → Database)
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Server Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
API_LOG_LEVEL=info

# Optional: Grok API (for enhanced AI analysis)
GROK_API_KEY=your_grok_api_key
GROK_API_ENDPOINT=https://api.x.ai/v1
```

**Run Backend**:

```bash
python main.py
```

Backend is live at: **http://localhost:8000**

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
copy .env.example .env
```

**Edit `frontend/.env`**:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

**Run Frontend**:

```bash
npm run dev
```

Frontend is live at: **http://localhost:3000** (or http://localhost:5173)

### 📊 Database Setup (Supabase)

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new organization and project
   - Note your Project ID and Region

2. **Get Connection String**:
   - Project Settings → Database
   - Copy the PostgreSQL connection string
   - Or use the Pooler connection string for production

3. **Update DATABASE_URL** in `backend/.env`

4. **Tables are created automatically** by SQLAlchemy on first run

---

## 📖 Usage Guide

---

## Advanced Features Guide

### 1️⃣ Chat-Based Investigation

1. Open the **Chat Panel** on the left
2. Click **Select Case** to load a saved case (optional)
3. Ask questions in natural language:
   - "Show me frequent contacts for 9000000159"
   - "Show common contacts between 9000000159 and 9000000160"
   - "Show movement history for 9000000159"
   - "Show calls near crime location"
   - "Find network links for 9000000159"
4. Chat analyzes your query and returns structured results
5. Results automatically populate the **Report Panel** with visualizations

### 2️⃣ Risk Detection & Alerts

The system automatically detects risk factors:

**Risk Scoring Rules:**
- **High Call Volume**: ≥5 contacts with same number → +1 score
- **Crime Proximity**: Calls near crime location → +2 score
- **Network Links**: ≥6 connected numbers detected → +1 score
- **Late-Night Activity**: ≥3 calls between 23:00-05:00 → +1 score

**Risk Levels:**
- 🔴 **HIGH** (score ≥ 3): Red alert with detailed reasons
- 🟠 **MEDIUM** (score ≥ 2): Amber alert with factors
- 🟢 **LOW** (score < 2): Green indicator

**Alert appears at:** Top of Report Panel after any query

### 3️⃣ Interactive Map View

- **Tower Markers:**
  - 🔴 Red: Crime location
  - 🟠 Amber: Suspect towers
  - 🟢 Green: Normal towers
- **Features:**
  - Hover for tower ID, location, and timestamps
  - Click/drag to pan
  - Scroll to zoom in/out
  - Cyan lines show call movement paths
- **Updates with:** Timeline slider or new analysis

### 4️⃣ Animated Network Graph

- **Node Colors:**
  - 🟨 Yellow: Main subject (queried number)
  - 🔴 Red: Identified suspects
  - 🟦 Gradient: Connected contacts
- **Node Sizes:** Main (14px) > Suspect (12px) > Others (10px)
- **Animations:**
  - Particle flow on connection links
  - Smooth spring physics simulation
  - Interactive pan, zoom, drag
- **Updates with:** Timeline slider or new analysis

### 5️⃣ Timeline Slider

- **Range Selection:** Drag handles to filter by time window
- **Context Display:** Shows active tower and location
- **Real-Time Updates:** Map, graph, and tables update instantly
- **Use Cases:**
  - Focus on specific hours (e.g., 2-4 AM suspicious calls)
  - Isolate movement sequence
  - Reduce visual clutter

### 6️⃣ Session History & Case Management

**Creating Sessions:**
- Sessions are created **only when you click Send** in chat
- No empty sessions on page load
- Automatic history save after each response

**Managing Sessions:**
1. Click **📚 History** button in Chat Panel
2. Select a session from the list
3. Expand session to see history cards (each chat response)
4. Click a history card to load that report
5. Use **Clear All Sessions** to bulk cleanup old data

**Saving Cases:**
1. Click **💾 Save** in Report Panel
2. Enter case name and description
3. Click Save to store full analysis
4. Use **Load Case** to restore previous investigations

### 7️⃣ Report & PDF Export

**Report Includes:**
1. Observations (summarized findings)
2. Details (structured data)
3. Next Steps (recommendations)
4. **Risk Alert** (NEW: threat level and factors)
5. **Suspect Badges** (NEW: highlighted dangerous numbers)
6. **Timeline Slider** (NEW: time-filtered data view)
7. **Map View** (NEW: geospatial visualization)
8. **Network Graph** (NEW: relationship visualization)
9. **Data Tables** (with suspect highlighting)

**Export to PDF:**
1. Click **📄 Export** in Report Panel
2. Wait for canvas rendering
3. PDF downloads automatically with all visualizations

### 8️⃣ Multilingual Support

**Supported Languages:**
- 🇬🇧 English
- 🇮🇳 Hindi (हिंदी)
- 🇹🇱 Telugu (తెలుగు)
- 🇹🇦 Tamil (தமிழ்)
- 🇰🇦 Kannada (ಕನ್ನಡ)

**Using Translations:**
1. Click **🌐 Language** in top menu
2. Select target language
3. All UI text translates instantly
4. Grok API provides content translation
5. Text-to-speech plays in selected language

---

### Health & Info
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | API info and version |
| GET | `/health` | Health check |
| GET | `/test` | Connection test |

### Upload & Case Data
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/upload` | Upload Excel dataset (CDR, Tower, Crime, IPDR) |
| POST | `/case/save` | Save case with analysis results |
| GET | `/case/list` | List all saved cases |
| GET | `/case/{case_id}` | Get specific case details |

### Analysis Endpoints (with Risk Metadata)

All analysis endpoints return structured results **with automatic risk detection metadata**:

**Example Response:**
```json
{
  "data": [...analysis results...],
  "success": true,
  "risk_level": "HIGH",
  "risk_reason": [
    "High call volume detected with repeated contacts",
    "Crime proximity detected",
    "Multiple network links identified"
  ],
  "suspects": ["9000000160", "9000000161"],
  "suspect_towers": ["t2", "t3"]
}
```

**Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/analysis/frequent/{number}` | Frequent contacts for a number |
| GET | `/analysis/common?num1={n1}&num2={n2}` | Common contacts between two numbers |
| GET | `/analysis/movement/{number}` | Call sequence & movement history |
| GET | `/analysis/crime/{crime_id}` | Calls matching crime location |
| GET | `/analysis/link/{number}` | Network graph and connections |

### Chat API
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/chat/query` | Submit natural language investigation query |
| POST | `/chat/translate` | Translate text to target language |
| POST | `/chat/analyze` | Get Grok AI analysis of results |

### Session History Management
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/session/create` | Create new investigation session |
| GET | `/session/list` | List all sessions with metadata |
| DELETE | `/session/clear-all` | Delete all sessions at once |
| POST | `/history/add` | Add query result to session history |
| GET | `/history/{session_id}` | Get all history items for a session |

---

## 💬 How Session History Works

1. **Create Session**: Click **Send** in chat → session created on-demand
2. **Generate Response**: Grok AI analyzes query and returns structured results
3. **Auto-Save History**: Query + response + full report JSON saved to database
4. **Load from History**: Click **📚 History** → Select session → Pick history card → Report loads
5. **Cleanup**: Use **Clear All Sessions** button to delete old sessions

**Benefits:**
- Reuse previous analyses without re-querying
- Track investigation timeline
- Compare different query results
- Preserve forensic audit trail

---

## 🔍 Workflow Scenarios

### Scenario 1: Quick Number Investigation
```
1. Upload dataset
2. Chat: "Show me frequent contacts for 9000000159"
3. View Risk Alert (if any)
4. Check Map markers (crime/suspect locations)
5. Inspect Timeline Slider (filter by time)
6. Export to PDF with findings
```

### Scenario 2: Multi-Party Network Analysis
```
1. Chat: "Find common contacts between 9000000159 and 9000000160"
2. Review Network Graph (relationships)
3. Check suspect highlighting (red nodes)
4. Save Case for later reference
5. Add historical note to case
```

### Scenario 3: Crime Location Correlation
```
1. Chat: "Show calls near crime location ID crime_001"
2. Review Map (crime in red, calls in green/amber)
3. Use Timeline Slider to isolate time window
4. View Risk Level (proximity, network density)
5. Generate Report with all visualizations
```

---

## 🛠️ Development & Troubleshooting

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "API Connection Failed" | Backend not running | Run `start-backend.bat` or `python main.py` in backend/ |
| "Database Connection Error" | Invalid DATABASE_URL | Verify Supabase credentials in backend/.env |
| "Speech not working in [Language]" | Missing TTS endpoint | App falls back to browser voices (automatic) |
| "Too many empty sessions" | Old test sessions | Click "Clear All Sessions" in History modal |
| "Map shows no towers" | Missing tower coordinates | Tower data loaded from TOWER_COORDINATES dict in analysis_service.py |
| "Graph animation choppy" | Insufficient compute | Reduce graph node count or disable particle effects |

### Testing the Connection

The frontend displays API status on the main page:
- 🟢 **Connected**: Backend is running and database ready
- 🔴 **Disconnected**: Backend unavailable or database unreachable
- 🟡 **Checking**: Testing API connection

### API Documentation

View interactive API documentation:

| Tool | URL |
|------|-----|
| **Swagger UI** | http://localhost:8000/docs |
| **ReDoc** | http://localhost:8000/redoc |
| **OpenAPI JSON** | http://localhost:8000/openapi.json |

### Performance Optimization

- **Large Datasets**: Filter by date range in Timeline Slider
- **Slow Graph Rendering**: Reduce visible nodes by narrowing time window
- **Memory Usage**: Clear sessions regularly with "Clear All Sessions"
- **PDF Export**: Simplify report by collapsing unused sections before export

---

## 📚 Developer Guide

### Project Architecture

```
Frontend (React)
    ├── Components (reusable widgets)
    │   └── MapView, ForceGraphView, TimelineSlider, RiskAlert, Tables
    ├── Pages (main views)
    │   └── Home, Analysis, CaseLoader
    └── Services (API clients)
        └── chatService.js, analysisService.js

Backend (FastAPI)
    ├── Services (business logic)
    │   ├── analysis_service.py (forensic queries + risk detection)
    │   └── chat_service.py (intent parsing + AI)
    ├── Routes (REST endpoints)
    │   ├── analysis_routes.py
    │   ├── case_routes.py
    │   └── session_history_routes.py
    └── Models (database schema)
        └── forensic_models.py
```

### Code Style & Standards

- **Python**: PEP 8 (black formatter recommended)
- **JavaScript**: ESLint (airbnb config)
- **Components**: Single responsibility, props-driven
- **State Management**: React hooks only (no Redux)
- **Testing**: Unit tests for services, integration tests for APIs

### Adding New Features

1. **Backend**:
   - Add model in `forensic_models.py`
   - Add query method in `analysis_service.py`
   - Add route in appropriate `*_routes.py`
   - Inject risk detection if forensic analysis
   - Test with Swagger UI

2. **Frontend**:
   - Create component in `src/components/`
   - Add API call in appropriate service
   - Integrate into `Analysis.jsx` or target page
   - Test styling with Chrome DevTools
   - Run `npm run build` to validate

### Running Tests

```bash
# Backend unit tests
cd backend
pytest

# Frontend component tests
cd frontend
npm test

# Build validation
npm run build
```

---

## 📋 Checklist for First-Time Setup

- [ ] Clone repository
- [ ] Create Supabase account and project
- [ ] Copy `.env.example` to `.env` in both frontend and backend
- [ ] Update `DATABASE_URL` in backend/.env
- [ ] Update `VITE_API_BASE_URL` in frontend/.env
- [ ] Run `pip install -r requirements.txt` (backend)
- [ ] Run `npm install` (frontend)
- [ ] Start backend: `start-backend.bat`
- [ ] Start frontend: `start-frontend.bat`
- [ ] Open http://localhost:3000 and verify API status is green
- [ ] Upload sample dataset to test upload feature
- [ ] Submit chat query to test analysis pipeline
- [ ] Check Report Panel for visualizations

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create feature branch**: `git checkout -b feature/your-feature`
3. **Make changes** following code style guidelines
4. **Test thoroughly**: `npm test` and `pytest`
5. **Commit**: `git commit -m "feat: describe your changes"`
6. **Push**: `git push origin feature/your-feature`
7. **Create Pull Request** with description

---

## ⚖️ License

This project is part of the Telecom Forensics AI initiative.

---

## 📞 Support & Contact

For issues, questions, or feature requests:
1. Check existing GitHub issues
2. Create new issue with detailed reproduction steps
3. Contact development team via corporate Slack

---


**🎯 Version**: 2.0 (with risk detection, map, graph, timeline)
**📅 Last Updated**: March 26, 2026
**✨ Latest Release**: [See GitHub Releases]()
