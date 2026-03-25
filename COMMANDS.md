# Development Commands

## Frontend Commands

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm build

# Preview production build
npm preview

# Run linter
npm run lint
```

## Backend Commands

```bash
# Install dependencies (in virtual environment)
pip install -r requirements.txt

# Start development server (with reload)
python main.py

# Or directly with uvicorn
uvicorn app.app:app --host 0.0.0.0 --port 8000 --reload

# Add new dependencies
pip install package-name
pip freeze > requirements.txt
```

## Database Commands

```bash
# Test database connection
python -c "from app.database import engine; engine.connect()"

# Run migrations (when using Alembic)
# alembic upgrade head
```

## Git Commands

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "feat: describe your changes"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main
```

## Useful URLs

- Frontend: http://localhost:5173 (or 3000)
- Backend: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- API Docs (ReDoc): http://localhost:8000/redoc
- OpenAPI Schema: http://localhost:8000/openapi.json
- API Health: http://localhost:8000/health
- API Test: http://localhost:8000/test

## Port Management

If ports are in use:

```bash
# Check port usage (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Check port usage (macOS/Linux)
lsof -i :8000
kill -9 <PID>
```

## Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Deactivate
deactivate

# Check active environment
which python
```

## Node Version Management

```bash
# Check Node version
node --version
npm --version

# Install Node Version Manager (nvm) for easy switching
# https://github.com/nvm-sh/nvm
```
