#!/bin/bash
# VOYAGER MISSION CONTROL - QUICK START GUIDE
# Copy and paste these commands to get the system running

echo "🚀 VOYAGER MISSION CONTROL - SETUP"
echo "===================================="

# ============================================================================
# OPTION 1: LOCAL DEVELOPMENT (Easy)
# ============================================================================

echo ""
echo "OPTION 1: LOCAL DEVELOPMENT"
echo "----------------------------"
echo ""
echo "Step 1: Install Python dependencies"
echo "  $ pip install -r requirements.txt"
echo ""
echo "Step 2: Start FastAPI backend (Terminal 1)"
echo "  $ python voyager_backend.py"
echo "  Server runs at: http://localhost:8000"
echo "  API docs at:    http://localhost:8000/docs"
echo ""
echo "Step 3: Setup frontend (Terminal 2)"
echo "  $ npm install"
echo "  $ npm run dev"
echo "  Frontend runs at: http://localhost:5173"
echo ""

# ============================================================================
# OPTION 2: DOCKER DEPLOYMENT (Production-Ready)
# ============================================================================

echo ""
echo "OPTION 2: DOCKER DEPLOYMENT (Recommended)"
echo "--------------------------------------------"
echo ""
echo "Prerequisites: Docker and Docker Compose installed"
echo ""
echo "Step 1: Start services with Docker Compose"
echo "  $ docker-compose up -d"
echo ""
echo "Step 2: Access services"
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:8000"
echo "  API Docs:  http://localhost:8000/docs"
echo ""
echo "Step 3: View logs"
echo "  $ docker-compose logs -f backend"
echo "  $ docker-compose logs -f frontend"
echo ""
echo "Step 4: Stop services"
echo "  $ docker-compose down"
echo ""

# ============================================================================
# COMMON API CALLS (Testing)
# ============================================================================

echo ""
echo "TESTING THE API"
echo "---------------"
echo ""
echo "Check health:"
echo '  $ curl http://localhost:8000'
echo ""
echo "Get Voyager 1 status:"
echo '  $ curl http://localhost:8000/probes/v1/status | jq'
echo ""
echo "Get Voyager 2 status:"
echo '  $ curl http://localhost:8000/probes/v2/status | jq'
echo ""
echo "Get full analysis with anomalies:"
echo '  $ curl http://localhost:8000/probes/v1/analysis | jq'
echo ""
echo "Compare both probes:"
echo '  $ curl http://localhost:8000/compare | jq'
echo ""
echo "Get mission timeline:"
echo '  $ curl http://localhost:8000/timeline | jq'
echo ""
echo "Get instrument status:"
echo '  $ curl http://localhost:8000/instruments/v1 | jq'
echo ""

# ============================================================================
# PROJECT STRUCTURE
# ============================================================================

echo ""
echo "PROJECT FILES"
echo "-------------"
echo ""
echo "voyager_backend.py   - FastAPI server with orbital mechanics & AI"
echo "voyager_frontend.jsx - React component with 3D visualization"
echo "requirements.txt     - Python dependencies"
echo "package.json         - Node.js dependencies"
echo "vite.config.js       - Vite configuration"
echo "docker-compose.yml   - Docker multi-container setup"
echo "Dockerfile.backend   - Backend container definition"
echo "README.md            - Full documentation"
echo ""

# ============================================================================
# FEATURES
# ============================================================================

echo ""
echo "FEATURES INCLUDED"
echo "-----------------"
echo ""
echo "✓ Real-time orbital mechanics calculations"
echo "✓ 3D solar system visualization (Three.js)"
echo "✓ Comprehensive mission database (50+ events)"
echo "✓ AI anomaly detection system"
echo "✓ Power depletion predictions"
echo "✓ 50-year mission timeline"
echo "✓ Live telemetry dashboard"
echo "✓ RESTful API with full documentation"
echo "✓ Dark command-center aesthetic UI"
echo "✓ Docker containerization"
echo ""

# ============================================================================
# TROUBLESHOOTING
# ============================================================================

echo ""
echo "TROUBLESHOOTING"
echo "---------------"
echo ""
echo "Port 8000 already in use?"
echo "  Change port in voyager_backend.py:"
echo "    uvicorn.run(app, host='0.0.0.0', port=8001)"
echo ""
echo "Port 5173 already in use?"
echo "  Vite will automatically use next available port"
echo ""
echo "CORS errors?"
echo "  Backend CORS is configured for '*' (all origins)"
echo ""
echo "Module not found?"
echo "  Make sure you ran: pip install -r requirements.txt"
echo ""
echo "Three.js not loading?"
echo "  Check internet connection (Three.js loaded via CDN)"
echo ""

# ============================================================================
# DEPLOYMENT
# ============================================================================

echo ""
echo "PRODUCTION DEPLOYMENT"
echo "---------------------"
echo ""
echo "Using Docker:"
echo "  $ docker-compose up -d"
echo ""
echo "Using Kubernetes:"
echo "  $ kubectl apply -f k8s-manifest.yml"
echo ""
echo "Using Heroku/Railway:"
echo "  1. Add Procfile:"
echo "     web: uvicorn voyager_backend:app --host 0.0.0.0 --port \$PORT"
echo "  2. Deploy with git push"
echo ""

# ============================================================================
# NEXT STEPS
# ============================================================================

echo ""
echo "NEXT STEPS"
echo "----------"
echo ""
echo "1. Read README.md for full documentation"
echo "2. Check API endpoints at http://localhost:8000/docs"
echo "3. View frontend at http://localhost:5173"
echo "4. Test anomaly detection at /probes/v1/analysis"
echo "5. Explore timeline at /timeline"
echo ""

echo "🌟 Mission Control Ready! 🌟"
echo ""