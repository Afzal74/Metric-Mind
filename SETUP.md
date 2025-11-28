# 🚀 MetricMind Setup Guide

Complete setup instructions for the Forensic Gender Classifier project.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm or pnpm** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Metric-Mind
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Or using a virtual environment (recommended):

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

#### Configure Environment Variables

```bash
# Copy the example environment file
copy .env.example .env  # Windows
# or
cp .env.example .env    # macOS/Linux
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Get your Gemini API key**: https://makersuite.google.com/app/apikey

#### Verify Models are Present

Ensure these model files exist in the `backend/` directory:
- `best_model_15features.pkl`
- `scaler_15features.pkl`
- `label_encoder_15features.pkl`
- Other model files (`model_*.pkl`)

If missing, regenerate them:

```bash
python forensic_classifier_fixed.py
```

### 3. Frontend Setup

#### Install Node Dependencies

```bash
cd frontend
npm install
```

Or using pnpm (faster):

```bash
cd frontend
pnpm install
```

#### Verify 3D Model is Present

Ensure the mandible 3D model exists:
- `frontend/public/models/mandible.obj`

This file should already be in the repository.

## 🎯 Running the Application

### Start Backend Server

```bash
cd backend
python app.py
```

The backend API will start on: **http://localhost:5000**

You should see:
```
✅ Gemini 2.5 Flash configured successfully!
✅ ML Models loaded successfully!
🚀 Starting Forensic Gender Classifier API...
```

### Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

Or with pnpm:

```bash
cd frontend
pnpm dev
```

The frontend will start on: **http://localhost:3000**

## 🌐 Accessing the Application

1. **Main Classifier**: http://localhost:3000
2. **3D Model Viewer**: http://localhost:3000/viewer
3. **Backend API**: http://localhost:5000
4. **API Health Check**: http://localhost:5000/api/health

## 🧪 Testing the Setup

### Test Backend API

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Forensic Gender Classifier API is running",
  "models_loaded": true,
  "gemini_ai": "enabled"
}
```

### Test Gemini Integration

```bash
curl http://localhost:5000/api/test-gemini
```

### Test Prediction

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"measurements": [10.5, 12.3, 0.85, 9.8, 3.2, 3.1, 6.5, 5.8, 120, 7.5, 1.2, 11.5, 4.2, 3.6, 4.8]}'
```

## 📁 Project Structure

```
Metric-Mind/
├── backend/                    # Flask API Backend
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example          # Example environment file
│   └── *.pkl                 # ML model files
├── frontend/                  # Next.js Frontend
│   ├── app/                  # Next.js app directory
│   ├── components/           # React components
│   ├── public/               # Static assets
│   │   └── models/          # 3D model files
│   ├── package.json         # Node dependencies
│   └── next.config.ts       # Next.js configuration
├── .gitignore               # Git ignore rules
├── README.md                # Project overview
└── SETUP.md                 # This file
```

## 🔑 API Endpoints

### Backend API (http://localhost:5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/features` | Get list of required features |
| POST | `/api/predict` | Predict gender from measurements |
| GET | `/api/sample` | Get sample data for testing |
| GET | `/api/test-gemini` | Test Gemini AI integration |

## 🎨 Features

### 1. Gender Classification
- Upload 15 mandibular measurements
- Get AI-powered gender prediction
- View confidence scores and probabilities
- Generate detailed forensic reports

### 2. 3D Mandible Viewer
- Interactive 3D model visualization
- Real-time sexual dimorphism morphing
- Anatomical landmark highlighting
- Medical CT-scan style rendering

### 3. AI Explanations
- Powered by Google Gemini 2.5 Flash
- Detailed analysis of predictions
- Clinical insights and observations
- Educational forensic information

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'flask'`
```bash
pip install -r requirements.txt
```

**Problem**: `GEMINI_API_KEY not found`
- Ensure `.env` file exists in `backend/` directory
- Verify API key is correctly set in `.env`
- Restart the backend server

**Problem**: `Error loading models`
- Ensure all `.pkl` files are in `backend/` directory
- Regenerate models: `python forensic_classifier_fixed.py`

### Frontend Issues

**Problem**: `Module not found` errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Problem**: 3D model not loading
- Verify `frontend/public/models/mandible.obj` exists
- Check browser console for errors
- Ensure WebGL is enabled in browser

**Problem**: API connection errors
- Verify backend is running on port 5000
- Check CORS settings in `backend/app.py`
- Ensure no firewall blocking localhost

### Common Issues

**Problem**: Port already in use
```bash
# Find and kill process on port 5000 (backend)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Find and kill process on port 3000 (frontend)
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

## 🔒 Security Notes

1. **Never commit `.env` files** - They contain sensitive API keys
2. **Rotate API keys regularly** - Update Gemini API key periodically
3. **Use HTTPS in production** - Never use HTTP for production deployment
4. **Validate all inputs** - Backend validates measurement inputs
5. **Keep dependencies updated** - Regularly update packages for security patches

## 📊 Dataset Information

The model uses 15 mandibular measurements:
1. M1 Length
2. M2 Bicondylar breadth
3. M3 Mandibular index
4. M4 Bigonial breadth
5. M5 URB
6. M6 LRB
7. M7 CondRH
8. M8 CorRH
9. M9 Gonial angle
10. M10 Cor length
11. M11 Cor breadth
12. M12 C-C distance
13. M13 Inter cor distance
14. M14 Cor-Fr distance
15. M15 Bimental breadth

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)

1. Create `Procfile`:
```
web: python backend/app.py
```

2. Set environment variables:
```bash
GEMINI_API_KEY=your_key_here
```

### Frontend Deployment (Vercel/Netlify)

1. Build command: `npm run build`
2. Output directory: `.next`
3. Set environment variables if needed

## 👥 Team Metric Mind

VTU CSE Project - 2024

## 📝 License

This project is for educational and research purposes in forensic science applications.

## 🆘 Need Help?

If you encounter issues not covered in this guide:
1. Check the browser console for errors
2. Check the backend terminal for error messages
3. Verify all dependencies are installed
4. Ensure API keys are correctly configured
5. Try restarting both servers

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Google Gemini API](https://ai.google.dev/docs)
- [Scikit-learn Documentation](https://scikit-learn.org/)
