# 🚀 HOW TO START VOYAGER MISSION CONTROL

## Option 1: LOCAL DEVELOPMENT (Easiest - 3 steps)

### Step 1: Install Python Dependencies
```bash
pip install -r requirements.txt
```

**What it does:**
- Installs FastAPI, uvicorn, numpy, scipy, etc.
- Takes ~2-3 minutes
- Creates virtual environment (optional but recommended)

**If you get an error:**
```bash
# Use Python 3.9+
python3 --version

# Or create virtual environment first
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

### Step 2: Start Backend (Terminal 1)
```bash
python voyager_backend.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Backend is ready when you see:**
- ✅ "Application startup complete"
- ✅ Running on http://localhost:8000

**Test it:**
```bash
# In another terminal, test the API
curl http://localhost:8000

# Or open browser
http://localhost:8000/docs
```

---

### Step 3: Start Frontend (Terminal 2)
```bash
npm install
npm run dev
```

**Expected output:**
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Frontend is ready when you see:**
- ✅ "ready in XXX ms"
- ✅ http://localhost:5173/

**Open in browser:**
```
http://localhost:5173
```

---

## 🎯 Result: You should see:

1. **3D Solar System** with Voyager 1 & 2 probes
2. **Live Telemetry** showing distance, speed, age
3. **Mission Timeline** with 50+ events
4. **Anomaly Detection** alerts
5. **Interactive Tabs** for different views

---

---

## Option 2: DOCKER DEPLOYMENT (Production - 2 commands)

### Prerequisites
```bash
# Install Docker Desktop from: https://www.docker.com/products/docker-desktop
# Verify installation:
docker --version
docker-compose --version
```

### Step 1: Start Everything with Docker Compose
```bash
docker-compose up -d
```

**What happens:**
- Builds backend container
- Builds frontend container
- Starts both services
- Takes ~3-5 minutes on first run

**Expected output:**
```
Creating voyager-control_backend_1 ... done
Creating voyager-control_frontend_1 ... done
```

### Step 2: Check Services Are Running
```bash
docker-compose ps
```

**Should show:**
```
NAME                    STATUS
voyager-control_backend_1     Up (healthy)
voyager-control_frontend_1    Up
```

### Step 3: Open in Browser
```
http://localhost:5173
```

---

## 📋 QUICK REFERENCE

| Action | Command |
|--------|---------|
| **Start everything (Docker)** | `docker-compose up -d` |
| **View logs** | `docker-compose logs -f backend` |
| **Stop everything** | `docker-compose down` |
| **Start backend (local)** | `python voyager_backend.py` |
| **Start frontend (local)** | `npm run dev` |
| **Test API** | `curl http://localhost:8000` |
| **API docs** | http://localhost:8000/docs |
| **Frontend** | http://localhost:5173 |

---

## 🔍 VERIFY IT'S WORKING

### Check Backend
```bash
# Should return status
curl http://localhost:8000

# Should show API documentation
curl http://localhost:8000/docs

# Should return Voyager 1 data
curl http://localhost:8000/probes/v1/status | jq
```

### Check Frontend
```bash
# Open browser
http://localhost:5173

# You should see:
# - 3D visualization (spinning sun)
# - Green/cyan text (retro aesthetic)
# - Live telemetry numbers
# - Mission timeline
```

---

## 🆘 TROUBLESHOOTING

### "Port 8000 already in use"
```bash
# Option 1: Kill the process
lsof -i :8000
kill -9 <PID>

# Option 2: Use different port
# Edit voyager_backend.py last line:
# uvicorn.run(app, host="0.0.0.0", port=8001)
```

### "Port 5173 already in use"
```bash
# Vite will automatically use next port (5174, 5175, etc.)
# Check console output for actual port
```

### "Module 'fastapi' not found"
```bash
pip install -r requirements.txt
# Make sure you're in correct virtual environment
which python
```

### "npm: command not found"
```bash
# Install Node.js from https://nodejs.org/
node --version
npm --version
```

### "Docker not found"
```bash
# Install Docker Desktop from https://www.docker.com/products/docker-desktop
docker --version
docker-compose --version
```

### "Connection refused" when accessing frontend
```bash
# Make sure BOTH services are running:
# 1. Backend on port 8000
# 2. Frontend on port 5173

# Check what's running:
lsof -i :8000
lsof -i :5173

# If nothing, start them again
```

### "3D scene not loading"
```bash
# Check browser console (F12) for errors
# Make sure you have internet (Three.js loads from CDN)
# Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### "No data showing"
```bash
# Check if backend is responding:
curl http://localhost:8000/probes/v1/status

# Check browser network tab (F12 > Network)
# Look for failed requests
```

---

## 📊 COMPLETE STARTUP FLOW

### Local Development (Recommended for Learning)
```
Terminal 1:
$ pip install -r requirements.txt
$ python voyager_backend.py
Backend: http://localhost:8000 ✓

Terminal 2:
$ npm install
$ npm run dev
Frontend: http://localhost:5173 ✓

Browser:
http://localhost:5173 → See 3D visualization! 🎉
```

### Docker Production (Recommended for Deployment)
```
One Terminal:
$ docker-compose up -d
✓ Both services running

Browser:
http://localhost:5173 → See 3D visualization! 🎉
```

---

## 🎮 USING THE INTERFACE

Once running, you can:

1. **Overview Tab** - See real-time distance/speed/status
2. **Timeline Tab** - Explore 50+ years of mission events
3. **Anomalies Tab** - View detected instrument anomalies
4. **Instruments Tab** - Check health of all systems
5. **3D View** - Rotates to show sun and probe trajectories

---

## 📱 TESTING THE API

```bash
# Get Voyager 1 status
curl http://localhost:8000/probes/v1/status | jq

# Get Voyager 2 status
curl http://localhost:8000/probes/v2/status | jq

# Compare both probes
curl http://localhost:8000/compare | jq

# Get mission timeline
curl http://localhost:8000/timeline | jq

# Get anomalies and predictions
curl http://localhost:8000/probes/v1/analysis | jq

# View API documentation
http://localhost:8000/docs
```

---

## 🛑 STOPPING THE SYSTEM

### Local Development
```bash
# Terminal 1 (Backend): Press Ctrl+C
# Terminal 2 (Frontend): Press Ctrl+C
```

### Docker
```bash
docker-compose down
# Or to remove everything:
docker-compose down -v
```

---

## 🔄 RESTART/RESET

### Local
```bash
# Kill all Python processes
pkill -f "python.*voyager"
pkill -f "npm.*dev"

# Start again
python voyager_backend.py
npm run dev
```

### Docker
```bash
# Restart services
docker-compose restart

# Or full reset
docker-compose down
docker-compose up -d
```

---

## 📝 MINIMUM REQUIREMENTS

| Component | Requirement |
|-----------|------------|
| **Python** | 3.9+ |
| **Node.js** | 16+ |
| **npm** | 8+ |
| **Docker** | 20+ (for Docker option) |
| **RAM** | 2GB minimum, 4GB recommended |
| **Disk** | 500MB |
| **Internet** | For Three.js CDN |

---

## ✨ YOU'RE DONE WHEN:

✅ Backend shows "Application startup complete"  
✅ Frontend shows "ready in XXX ms"  
✅ Browser loads http://localhost:5173  
✅ You see 3D solar system visualization  
✅ Telemetry data displays (distances, speeds)  
✅ Tabs switch between Overview/Timeline/Anomalies  

---

## 🚀 NEXT STEPS

1. **Explore the API** → http://localhost:8000/docs
2. **Check Timeline** → Click "Timeline" tab
3. **View Anomalies** → Click "Anomalies" tab
4. **Test endpoints** → Use curl commands above
5. **Deploy to cloud** → Follow deployment section in README.md

---

## 💡 TIPS

- Keep backend terminal open to see debug logs
- Use `npm run dev` (not `npm start`) for Vite
- Frontend auto-reloads on code changes
- Backend needs manual restart for code changes
- Use `jq` for pretty JSON: `curl ... | jq`
- Check browser DevTools (F12) for frontend errors
- Check backend terminal for API errors

---

**Everything set? Open http://localhost:5173 and see your Voyager Mission Control! 🎯**