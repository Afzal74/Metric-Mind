# MetricMind - Forensic Gender Classifier
## System Design Document

**Project Title:** Forensic Gender Classification using Mandibular Morphometric Analysis  
**Team:** Metric Mind - VTU CSE Project 2024  
**Document Version:** 2.0  
**Last Updated:** December 2024

---

## 1. System Overview

MetricMind is a web-based forensic application designed to automate the gender estimation process using skeletal remains. It utilizes a supervised machine learning model (Logistic Regression with 75% accuracy) to analyze 15 quantitative mandibular measurements and classify the subject as Male or Female with a confidence probability.

The system integrates:
- **Machine Learning Classification** for gender prediction
- **3D Visualization** for anatomical landmark exploration
- **AI-Powered Explanations** using Google Gemini for clinical reasoning
- **PDF Report Generation** for professional forensic documentation

---

## 2. Architectural Pattern

The system follows a **Modular Three-Tier Architecture** separating the presentation layer (Next.js/React) from the application logic (Flask/Python) and the ML processing layer. This decoupling ensures that heavy ML computations do not block the web server's main event loop.

- **Architecture Style:** Three-Tier Architecture (Presentation, Application, Data/Logic)
- **Communication Style:** RESTful API (JSON over HTTP)
- **Frontend Framework:** Next.js 14 with React 18
- **Backend Framework:** Flask with Flask-CORS
- **ML Framework:** Scikit-learn with Joblib serialization


```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SYSTEM ARCHITECTURE DIAGRAM                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    PRESENTATION LAYER (Port 3000)                   │   │
│   │                         Next.js / React                             │   │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│   │  │  Input   │ │    3D    │ │  Charts  │ │    AI    │ │   PDF    │  │   │
│   │  │   Form   │ │  Viewer  │ │ Display  │ │ Analysis │ │  Report  │  │   │
│   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│   └─────────────────────────────────┬───────────────────────────────────┘   │
│                                     │                                       │
│                                     │ REST API (JSON/HTTP)                  │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    APPLICATION LAYER (Port 5000)                    │   │
│   │                           Flask API                                 │   │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│   │  │ /health  │ │/features │ │ /predict │ │ /sample  │ │/test-gem │  │   │
│   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│   └─────────────────────────────────┬───────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      DATA/LOGIC LAYER                               │   │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│   │  │ ML Model │ │  Scaler  │ │ Encoder  │ │  Gemini  │ │  Dataset │  │   │
│   │  │  (.pkl)  │ │  (.pkl)  │ │  (.pkl)  │ │   API    │ │  (.xlsx) │  │   │
│   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core System Components

### A. Presentation Layer (Frontend Client)

**Technology:** Next.js 14, React 18, TypeScript, TailwindCSS

**Responsibilities:**

1. **Input Interface:** A dynamic form to accept 15 numerical inputs (e.g., Gonial Angle, Ramus Height, Bicondylar Breadth).

2. **3D Visualization:** Interactive Three.js-based mandible model with anatomical landmarks, camera controls, and sexual dimorphism morphing.

3. **Visualization Dashboard:** Renders charts (Confidence Gauge, Probability Bars, Feature Importance) using Recharts library.

4. **Result Display:** Shows the predicted gender with a visual "Confidence Bar" and probability percentages.

5. **AI Analysis Panel:** Displays Gemini-generated forensic explanations with clinical reasoning.

6. **PDF Report Generator:** Creates downloadable professional forensic reports using jsPDF and html2canvas.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      FRONTEND COMPONENT ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   app/                                                                      │
│   ├── page.tsx ─────────────────── Main Dashboard (Gender Classifier)       │
│   ├── viewer/page.tsx ──────────── Dedicated 3D Viewer Page                 │
│   ├── layout.tsx ───────────────── Root Layout (Navigation, Meta)           │
│   └── globals.css ──────────────── Global Styles & Animations               │
│                                                                             │
│   components/                                                               │
│   ├── ui/                                                                   │
│   │   ├── button.tsx ───────────── Custom Button (Variants, Gradients)      │
│   │   ├── card.tsx ─────────────── Glass-morphism Cards                     │
│   │   ├── badge.tsx ────────────── Status Badges                            │
│   │   └── input.tsx ────────────── Dark-themed Form Inputs                  │
│   │                                                                         │
│   ├── obj-medical-viewer.tsx ───── Main 3D Mandible Viewer (871 lines)      │
│   ├── real-obj-mandible.tsx ────── OBJ Model Loader Component               │
│   ├── mandible-with-labels.tsx ─── Labeled Mandible for Results             │
│   ├── ai-explanation.tsx ───────── AI Analysis Display Component            │
│   ├── prediction-charts.tsx ────── Recharts Visualizations                  │
│   └── report-generator.tsx ─────── PDF Generation Component                 │
│                                                                             │
│   lib/                                                                      │
│   └── utils.ts ─────────────────── Utility Functions (cn, formatters)       │
│                                                                             │
│   public/                                                                   │
│   └── models/mandible.obj ──────── 3D Mandible Model File                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```


### B. Application Layer (Backend Server)

**Technology:** Flask (Python 3.x), Flask-CORS, Joblib, NumPy

**Responsibilities:**

1. **API Gateway:** Exposes RESTful endpoints for frontend communication.

2. **Request Validation:** Validates input data (type checking, range validation, required fields).

3. **ML Pipeline Orchestration:** Coordinates data preprocessing, model inference, and result formatting.

4. **AI Integration:** Manages Google Gemini API calls for generating natural language explanations.

5. **Error Handling:** Provides graceful error responses with meaningful messages.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BACKEND APPLICATION STRUCTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   backend/                                                                  │
│   ├── app.py ───────────────────── Main Flask Application (200+ lines)      │
│   │   ├── CORS Configuration                                                │
│   │   ├── Gemini AI Setup                                                   │
│   │   ├── Model Loading (joblib)                                            │
│   │   ├── API Route Definitions                                             │
│   │   └── Helper Functions                                                  │
│   │                                                                         │
│   ├── requirements.txt ─────────── Python Dependencies                      │
│   │   ├── Flask==2.3.3                                                      │
│   │   ├── Flask-CORS==4.0.0                                                 │
│   │   ├── scikit-learn==1.3.0                                               │
│   │   ├── numpy==1.24.3                                                     │
│   │   ├── pandas==2.1.1                                                     │
│   │   ├── joblib==1.3.2                                                     │
│   │   └── google-generativeai==0.3.2                                        │
│   │                                                                         │
│   ├── .env ─────────────────────── Environment Variables (API Keys)         │
│   └── .env.example ─────────────── Environment Template                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### C. Data/Logic Layer (ML Processing)

**Technology:** Scikit-learn, Joblib, NumPy, Pandas

**Responsibilities:**

1. **Feature Scaling:** StandardScaler normalizes 15 input features to zero mean and unit variance.

2. **Model Inference:** Logistic Regression model performs binary classification (Male/Female).

3. **Probability Estimation:** Outputs confidence scores for both classes.

4. **Label Decoding:** LabelEncoder converts numeric predictions to human-readable labels.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ML MODEL FILES STRUCTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   backend/                                                                  │
│   ├── best_model_15features.pkl ─── Primary Model (Logistic Regression)     │
│   ├── scaler_15features.pkl ─────── StandardScaler (Feature Normalization)  │
│   ├── label_encoder_15features.pkl─ LabelEncoder (M/F Mapping)              │
│   │                                                                         │
│   │   Alternative Models (for comparison):                                  │
│   ├── model_logistic_regression_15features.pkl ── 75% Accuracy (BEST)       │
│   ├── model_random_forest_15features.pkl ──────── Ensemble Method           │
│   ├── model_svm_15features.pkl ────────────────── Support Vector Machine    │
│   ├── model_decision_tree_15features.pkl ──────── Interpretable Model       │
│   └── model_neural_network_15features.pkl ─────── MLP Classifier            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. API Specification

### 4.1 Endpoint Summary

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/health` | GET | System health check | Status, model state |
| `/api/features` | GET | Get feature names list | 15 feature names |
| `/api/predict` | POST | Gender prediction | Prediction + AI analysis |
| `/api/sample` | GET | Sample test data | 15 sample measurements |
| `/api/test-gemini` | GET | Test AI connection | Gemini API status |

### 4.2 Detailed API Documentation

#### GET /api/health
**Purpose:** Check system status and model availability.

**Response:**
```json
{
  "status": "healthy",
  "message": "Forensic Gender Classifier API is running",
  "models_loaded": true,
  "gemini_ai": "enabled"
}
```

#### GET /api/features
**Purpose:** Retrieve list of required mandibular measurements.

**Response:**
```json
{
  "features": [
    "M1 Length",
    "M2 Bicondylar breadth",
    "M3 Mandibular index",
    "M3 Bigonial breadth",
    "M5 URB",
    "M6 LRB",
    "M7 CondRH",
    "M8 CorRH",
    "M9 Gonial angle",
    "M10 Cor length",
    "M11 Cor breadth",
    "M12 C-C distance",
    "M13 Inter cor distance",
    "M14 Cor-Fr distance",
    "M15 Bimental breadth"
  ],
  "count": 15
}
```

#### POST /api/predict
**Purpose:** Perform gender classification on input measurements.

**Request Body:**
```json
{
  "measurements": [10.5, 12.3, 0.85, 9.8, 3.2, 3.1, 6.5, 5.8, 120, 7.5, 1.2, 11.5, 4.2, 3.6, 4.8]
}
```

**Response:**
```json
{
  "success": true,
  "prediction": {
    "gender": "M",
    "gender_full": "Male",
    "confidence": 78.5,
    "probabilities": {
      "Female": 21.5,
      "Male": 78.5
    }
  },
  "ai_explanation": "The mandibular measurements indicate male morphology...",
  "input": {
    "measurements": [10.5, 12.3, ...],
    "feature_names": ["M1 Length", ...]
  }
}
```

---

## 5. Data Flow Architecture

### 5.1 Prediction Request Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PREDICTION DATA FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   STEP 1: USER INPUT                                                        │
│   ┌─────────────────┐                                                       │
│   │ 15 Measurements │ ──► M1: 10.5mm, M2: 12.3mm, M3: 0.85, ...            │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            ▼                                                                │
│   STEP 2: FRONTEND VALIDATION                                               │
│   ┌─────────────────┐                                                       │
│   │ Type Checking   │ ──► All values must be valid numbers                  │
│   │ Range Checking  │ ──► Values within expected ranges                     │
│   │ Required Fields │ ──► All 15 fields must be filled                      │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            ▼                                                                │
│   STEP 3: API REQUEST                                                       │
│   ┌─────────────────┐                                                       │
│   │ POST /api/predict│ ──► JSON payload with measurements array            │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            ▼                                                                │
│   STEP 4: PREPROCESSING                                                     │
│   ┌─────────────────┐                                                       │
│   │ StandardScaler  │ ──► Normalize to μ=0, σ=1                            │
│   │ Shape: (1, 15)  │ ──► Reshape for model input                          │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            ▼                                                                │
│   STEP 5: ML INFERENCE                                                      │
│   ┌─────────────────┐                                                       │
│   │ Logistic Model  │ ──► Binary classification (0=Female, 1=Male)         │
│   │ predict_proba() │ ──► Probability scores [P(F), P(M)]                  │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            ▼                                                                │
│   STEP 6: AI EXPLANATION                                                    │
│   ┌─────────────────┐                                                       │
│   │ Gemini 2.5 Flash│ ──► Generate natural language analysis               │
│   │ Context Prompt  │ ──► Include measurements + prediction                │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            ▼                                                                │
│   STEP 7: RESPONSE                                                          │
│   ┌─────────────────┐                                                       │
│   │ JSON Response   │ ──► prediction + probabilities + ai_explanation      │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            ▼                                                                │
│   STEP 8: UI RENDERING                                                      │
│   ┌─────────────────┐                                                       │
│   │ Result Cards    │ ──► Gender display, confidence bar                   │
│   │ Charts          │ ──► Probability visualization                        │
│   │ 3D Viewer       │ ──► Mandible with landmarks                          │
│   │ AI Panel        │ ──► Formatted explanation                            │
│   └─────────────────┘                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```


---

## 6. Machine Learning Pipeline

### 6.1 Model Training Overview

**Dataset:** Metric_Final.xlsx
- **Total Samples:** 156
- **Male Samples:** 103 (66%)
- **Female Samples:** 53 (34%)
- **Features:** 15 mandibular measurements
- **Target Variable:** Gender (Binary: M/F)

### 6.2 Feature Set (15 Mandibular Measurements)

| ID | Feature Name | Description | Unit |
|----|--------------|-------------|------|
| M1 | Length | Maximum anteroposterior dimension (gonion to gnathion) | mm |
| M2 | Bicondylar breadth | Maximum width between lateral condylar surfaces | mm |
| M3 | Mandibular index | Ratio of mandibular height to length | ratio |
| M4 | Bigonial breadth | Maximum width between gonial angles | mm |
| M5 | URB | Upper Ramus Breadth (minimum) | mm |
| M6 | LRB | Lower Ramus Breadth (minimum) | mm |
| M7 | CondRH | Condylar Ramus Height (condyle to gonion) | mm |
| M8 | CorRH | Coronoid Ramus Height (coronoid to gonion) | mm |
| M9 | Gonial angle | Angle at mandibular corner | degrees |
| M10 | Cor length | Coronoid process length | mm |
| M11 | Cor breadth | Coronoid process breadth | mm |
| M12 | C-C distance | Condyle to condyle distance | mm |
| M13 | Inter cor distance | Distance between coronoid tips | mm |
| M14 | Cor-Fr distance | Coronoid to mental foramen distance | mm |
| M15 | Bimental breadth | Distance between mental foramina | mm |

### 6.3 ML Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MACHINE LEARNING PIPELINE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      TRAINING PHASE                                 │   │
│   │                                                                     │   │
│   │   Raw Data          Preprocessing        Model Training             │   │
│   │   ┌───────┐         ┌───────────┐        ┌─────────────┐           │   │
│   │   │ Excel │ ──────► │ Pandas    │ ─────► │ Train/Test  │           │   │
│   │   │ 156   │         │ DataFrame │        │ Split 80/20 │           │   │
│   │   │samples│         │ Cleaning  │        │             │           │   │
│   │   └───────┘         └───────────┘        └──────┬──────┘           │   │
│   │                                                 │                   │   │
│   │                                                 ▼                   │   │
│   │   Model Selection    Feature Scaling     Cross Validation          │   │
│   │   ┌───────────┐      ┌───────────┐       ┌─────────────┐           │   │
│   │   │ 5 Models  │ ◄─── │ Standard  │ ◄──── │ K-Fold CV   │           │   │
│   │   │ Compared  │      │ Scaler    │       │ Evaluation  │           │   │
│   │   │           │      │ μ=0, σ=1  │       │             │           │   │
│   │   └───────────┘      └───────────┘       └─────────────┘           │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      INFERENCE PHASE                                │   │
│   │                                                                     │   │
│   │   Input Data         Scaling             Prediction                 │   │
│   │   ┌───────┐         ┌───────────┐        ┌─────────────┐           │   │
│   │   │ 15    │ ──────► │ scaler.   │ ─────► │ model.      │           │   │
│   │   │ values│         │ transform │        │ predict     │           │   │
│   │   │       │         │           │        │ predict_proba│          │   │
│   │   └───────┘         └───────────┘        └──────┬──────┘           │   │
│   │                                                 │                   │   │
│   │                                                 ▼                   │   │
│   │   Output             Label Decode         Probabilities            │   │
│   │   ┌───────────┐      ┌───────────┐       ┌─────────────┐           │   │
│   │   │ Gender:   │ ◄─── │ encoder.  │ ◄──── │ [0.215,     │           │   │
│   │   │ "Male"    │      │ inverse_  │       │  0.785]     │           │   │
│   │   │ Conf: 78% │      │ transform │       │             │           │   │
│   │   └───────────┘      └───────────┘       └─────────────┘           │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.4 Model Comparison Results

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|----------|-----------|--------|----------|
| **Logistic Regression** | **75.00%** | **0.76** | **0.75** | **0.75** |
| Random Forest | 72.00% | 0.73 | 0.72 | 0.72 |
| SVM | 71.00% | 0.72 | 0.71 | 0.71 |
| Decision Tree | 68.00% | 0.69 | 0.68 | 0.68 |
| Neural Network (MLP) | 70.00% | 0.71 | 0.70 | 0.70 |

**Selected Model:** Logistic Regression (Best overall performance)

---

## 7. 3D Visualization System

### 7.1 Technology Stack

- **Three.js:** Core 3D rendering library
- **React Three Fiber (R3F):** React renderer for Three.js
- **React Three Drei:** Helper components (Html, Line, Text, OrbitControls)
- **OBJLoader:** Loads authentic mandible geometry from .obj file

### 7.2 3D Viewer Features

1. **Real OBJ Model Loading:** Authentic mandible geometry from `/models/mandible.obj`
2. **Medical-Grade Lighting:** 4 light sources (ambient, directional, point, spot)
3. **Custom Orbit Controls:** Mouse drag rotation, scroll zoom, auto-rotate
4. **15 Anatomical Landmarks:** Color-coded feature points with labels
5. **Sexual Dimorphism Morphing:** Real-time 0-100% male/female transition
6. **HTML Overlays:** Labels that always face camera
7. **Camera Transitions:** Smooth focus on selected features

### 7.3 3D Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      3D VISUALIZATION ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ObjMedicalViewer (Main Component - 871 lines)                             │
│   │                                                                         │
│   ├── State Management                                                      │
│   │   ├── selectedFeature: string | null                                    │
│   │   ├── morphFactor: number (0-1)                                         │
│   │   ├── autoRotate: boolean                                               │
│   │   └── cameraDistance: number                                            │
│   │                                                                         │
│   ├── Canvas (React Three Fiber)                                            │
│   │   │                                                                     │
│   │   ├── Lighting                                                          │
│   │   │   ├── ambientLight (intensity: 0.3, color: #ff8866)                │
│   │   │   ├── directionalLight (position: [8,8,4], intensity: 1.5)         │
│   │   │   ├── pointLight (position: [-8,-8,-4], intensity: 0.8)            │
│   │   │   └── spotLight (position: [0,12,0], intensity: 1.2)               │
│   │   │                                                                     │
│   │   ├── MedicalOrbitControls                                              │
│   │   │   ├── Mouse drag rotation                                           │
│   │   │   ├── Scroll wheel zoom                                             │
│   │   │   ├── Auto-rotate mode                                              │
│   │   │   └── Smooth camera transitions                                     │
│   │   │                                                                     │
│   │   ├── RealObjMandible                                                   │
│   │   │   ├── OBJLoader (dynamic import)                                    │
│   │   │   ├── Material customization                                        │
│   │   │   ├── Scale based on morphFactor                                    │
│   │   │   └── Color based on selection                                      │
│   │   │                                                                     │
│   │   ├── FeatureLabels                                                     │
│   │   │   ├── Line (arrow from label to landmark)                           │
│   │   │   ├── Sphere (connection point)                                     │
│   │   │   └── Html (label overlay)                                          │
│   │   │                                                                     │
│   │   └── gridHelper (medical reference grid)                               │
│   │                                                                         │
│   └── UI Overlays                                                           │
│       ├── Feature Selection Panel (15 buttons)                              │
│       ├── Model Controls (zoom, rotate, reset)                              │
│       ├── Clinical Info Panel                                               │
│       └── Morph Progress Bar                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. AI Integration (Google Gemini)

### 8.1 Configuration

**Model Priority:**
1. `gemini-2.5-flash` (preferred - latest)
2. `gemini-1.5-flash` (fallback)
3. `gemini-pro` (legacy fallback)

**API Key Management:**
- Stored in `backend/.env` file
- Never committed to version control
- Template provided in `.env.example`

### 8.2 Prompt Engineering

```python
prompt = f"""
Provide a brief forensic analysis (3-4 sentences max) explaining why 
the AI predicted {prediction_result['gender_full']} with 
{prediction_result['confidence']}% confidence.

Key measurements: 
- Mandibular length {measurements[0]}mm
- Bicondylar breadth {measurements[1]}mm
- Bigonial breadth {measurements[3]}mm
- Gonial angle {measurements[8]}°

Explain in simple terms:
1. Which 2-3 measurements most indicate {prediction_result['gender_full']}?
2. Why is the confidence {prediction_result['confidence']}%?

Keep it concise and professional - maximum 4 sentences total.
"""
```

### 8.3 Fallback Mechanism

When Gemini API is unavailable, the system provides a structured fallback analysis:
- Prediction summary with confidence level
- Key indicators list
- Methodology description
- Clinical significance notes


---

## 9. PDF Report Generation

### 9.1 Technology

- **jsPDF:** PDF document creation
- **html2canvas:** Chart capture from DOM

### 9.2 Report Contents

1. **Header:** MetricMind branding, timestamp, report ID
2. **Prediction Results:** Gender, confidence, probabilities
3. **Visualization Charts:** Confidence gauge, probability bars
4. **Measurements Table:** All 15 input values
5. **AI Analysis:** Gemini-generated explanation
6. **Model Information:** Algorithm, accuracy, dataset info
7. **Disclaimer:** Educational/research purpose notice

---

## 10. Security Considerations

### 10.1 API Security

| Aspect | Implementation |
|--------|----------------|
| CORS | Flask-CORS configured for frontend origin |
| API Keys | Environment variables (.env file) |
| Input Validation | Type checking, range validation |
| Error Handling | Graceful errors without stack traces |

### 10.2 Data Privacy

- No user data stored on server
- Measurements processed in-memory only
- No logging of sensitive inputs
- Session-less architecture

### 10.3 Best Practices

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SECURITY CHECKLIST                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ✅ API keys stored in .env (not committed)                                │
│   ✅ .env added to .gitignore                                               │
│   ✅ CORS configured for specific origins                                   │
│   ✅ Input validation on all endpoints                                      │
│   ✅ Error messages don't expose internals                                  │
│   ✅ No sensitive data in client-side code                                  │
│   ✅ HTTPS recommended for production                                       │
│   ✅ Rate limiting recommended for production                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Deployment Architecture

### 11.1 Development Environment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DEVELOPMENT SETUP                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Terminal 1 (Backend):                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ $ cd backend                                                        │   │
│   │ $ pip install -r requirements.txt                                   │   │
│   │ $ python app.py                                                     │   │
│   │ ──► Running on http://localhost:5000                                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Terminal 2 (Frontend):                                                    │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ $ cd frontend                                                       │   │
│   │ $ pnpm install                                                      │   │
│   │ $ pnpm dev                                                          │   │
│   │ ──► Running on http://localhost:3000                                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.2 Production Deployment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PRODUCTION ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐      │
│   │    FRONTEND     │     │    BACKEND      │     │   EXTERNAL      │      │
│   │                 │     │                 │     │                 │      │
│   │  Vercel /       │────►│  Railway /      │────►│  Google         │      │
│   │  Netlify        │     │  Heroku /       │     │  Gemini API     │      │
│   │                 │     │  DigitalOcean   │     │                 │      │
│   │  Static Files   │     │  Python Runtime │     │  AI Service     │      │
│   │  CDN Delivery   │     │  ML Models      │     │                 │      │
│   └─────────────────┘     └─────────────────┘     └─────────────────┘      │
│                                                                             │
│   Configuration:                                                            │
│   • Update API_BASE_URL in frontend for production backend URL              │
│   • Set GEMINI_API_KEY environment variable on backend host                 │
│   • Enable HTTPS on both frontend and backend                               │
│   • Configure CORS for production domain                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Performance Metrics

### 12.1 Response Times

| Operation | Expected Time |
|-----------|---------------|
| API Health Check | < 50ms |
| Feature List | < 50ms |
| ML Prediction | 200-500ms |
| AI Explanation | 2-5s |
| 3D Model Load | 1-2s (cached) |
| PDF Generation | 3-8s |

### 12.2 Resource Requirements

**Backend Server:**
- Python 3.8+
- 512MB RAM minimum
- 100MB disk (models + dependencies)

**Frontend Client:**
- Modern browser (Chrome, Firefox, Safari, Edge)
- WebGL support for 3D viewer
- 2GB RAM recommended

---

## 13. Future Enhancements

### 13.1 Planned Features

1. **Batch Processing:** CSV upload for multiple predictions
2. **User Authentication:** Login system for saved analyses
3. **Database Integration:** Store prediction history
4. **Additional Models:** Ensemble methods, deep learning
5. **Mobile App:** React Native version
6. **API Rate Limiting:** Production-grade throttling

### 13.2 Model Improvements

1. **Larger Dataset:** Collect more samples for training
2. **Feature Engineering:** Derived measurements, ratios
3. **Deep Learning:** CNN on 3D mesh data
4. **Explainability:** SHAP values, feature importance

---

## 14. Summary

MetricMind is a comprehensive forensic gender classification system that combines:

- **Machine Learning:** 75% accurate Logistic Regression model
- **3D Visualization:** Interactive mandible viewer with 15 anatomical landmarks
- **AI Explanations:** Google Gemini-powered clinical reasoning
- **Professional Reports:** PDF generation with charts and analysis

The three-tier architecture ensures scalability, maintainability, and separation of concerns between presentation, application logic, and ML processing.

---

**Document End**

*MetricMind - Forensic Gender Classifier*  
*Team Metric Mind - VTU CSE Project 2024*
