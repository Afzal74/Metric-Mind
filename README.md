# 🧬 Forensic Gender Classifier

**Team Metric Mind - VTU CSE Project**

ML-Based Gender Classification using 15 Mandibular Measurements with 75% accuracy using Logistic Regression.

## 📁 Project Structure

```
MetricMind/
├── backend/                    # Flask API Backend
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── best_model_15features.pkl
│   ├── scaler_15features.pkl
│   ├── label_encoder_15features.pkl
│   └── model_*.pkl           # All trained models
├── frontend/                  # Standalone Frontend
│   ├── index.html            # Main HTML page
│   ├── styles.css            # CSS styling
│   └── script.js             # JavaScript logic
├── templates/                 # Original Flask templates (legacy)
│   └── index.html
├── forensic_classifier_fixed.py  # Model training script
├── Metric_Final.xlsx         # Dataset
└── README.md                 # This file
```

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the Flask API:

```bash
python app.py
```

The API will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Open `index.html` in your browser or serve it with a simple HTTP server:

```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve .

# Or just open index.html directly in browser
```

The frontend will be available on `http://localhost:8080`

## 🔗 API Endpoints

### Backend API (`http://localhost:5000`)

- `GET /api/health` - Health check
- `GET /api/features` - Get list of required features
- `POST /api/predict` - Predict gender from measurements
- `GET /api/sample` - Get sample data for testing

### Example API Usage

```javascript
// Predict gender
const response = await fetch("http://localhost:5000/api/predict", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    measurements: [
      10.5, 12.3, 0.85, 9.8, 3.2, 3.1, 6.5, 5.8, 120, 7.5, 1.2, 11.5, 4.2, 3.6,
      4.8,
    ],
  }),
});

const result = await response.json();
console.log(result);
```

## 📊 Model Information

- **Best Model:** Logistic Regression
- **Accuracy:** 75.00%
- **Features:** 15 mandibular measurements
- **Dataset:** 156 samples (103 Male, 53 Female)

### 15 Mandibular Measurements:

1. M1 Length
2. M2 Bicondylar breadth
3. M3 Mandibular index
4. M3 Bigonial breadth
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

## 🛠️ Development

### Training New Models

Run the training script to retrain models:

```bash
python forensic_classifier_fixed.py
```

This will:

- Load the dataset from `Metric_Final.xlsx`
- Train 5 different ML models
- Save the best performing model
- Generate all necessary pickle files

### Adding New Features

1. **Backend**: Modify `FEATURE_NAMES` in `backend/app.py`
2. **Frontend**: The form is dynamically generated from the API
3. **Model**: Retrain with new features using the training script

## 🌐 Deployment

### Backend Deployment

- Deploy Flask app to services like Heroku, Railway, or DigitalOcean
- Update CORS settings for production domain
- Set environment variables for production

### Frontend Deployment

- Deploy static files to Netlify, Vercel, or GitHub Pages
- Update `API_BASE_URL` in `script.js` to production backend URL

## 🔧 Troubleshooting

### Common Issues

1. **CORS Error**: Make sure Flask-CORS is installed and configured
2. **Model Loading Error**: Ensure all `.pkl` files are in the backend directory
3. **API Connection Error**: Check if backend is running on port 5000
4. **Missing Dependencies**: Install all requirements from `requirements.txt`

### Development Tips

- Use browser developer tools to debug frontend issues
- Check Flask console for backend errors
- Test API endpoints using tools like Postman or curl

## 👥 Team Metric Mind

VTU CSE Project - 2024

---

**Note**: This project is for educational and research purposes in forensic science applications.
