# Telecom Forensics AI - Quick Start

## 2-Minute Setup

### Terminal 1 - Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Supabase DATABASE_URL

python main.py
# Backend runs on http://localhost:8000
```

### Terminal 2 - Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env

npm run dev
# Frontend runs on http://localhost:5173
```

### Verify Setup
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/docs
- Test API: http://localhost:8000/test

## What Works Now

✅ Landing page with features
✅ Analysis page with file upload
✅ React Router navigation
✅ FastAPI backend
✅ CORS enabled
✅ API test endpoint
✅ Database configuration ready

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:port/database
API_HOST=0.0.0.0
API_PORT=8000
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000
```

## Next: Phase 2 Roadmap

- [ ] File upload processing
- [ ] CDR/Tower/IPDR data parsing
- [ ] Grok API integration
- [ ] Network visualization
- [ ] Results dashboard

---

See [SETUP.md](SETUP.md) for detailed instructions.
See [README.md](README.md) for full documentation.
