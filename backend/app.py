from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Configure Gemini AI
try:
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("⚠️ GEMINI_API_KEY not found in environment variables")
        gemini_model = None
    else:
        print(f"🔑 Found Gemini API key: {api_key[:10]}...")
        genai.configure(api_key=api_key)
        # Try different model names for Gemini 2.5 Flash
        try:
            gemini_model = genai.GenerativeModel('gemini-2.5-flash')
            print("✅ Gemini 2.5 Flash configured successfully!")
        except Exception as model_error:
            print(f"⚠️ Gemini 2.5 Flash not available, trying alternatives: {model_error}")
            try:
                gemini_model = genai.GenerativeModel('gemini-1.5-flash')
                print("✅ Gemini 1.5 Flash configured successfully!")
            except Exception as fallback_error:
                print(f"⚠️ Fallback failed: {fallback_error}")
                gemini_model = genai.GenerativeModel('gemini-pro')
                print("✅ Gemini Pro configured successfully!")
except Exception as e:
    print(f"⚠️ Gemini AI configuration error: {e}")
    gemini_model = None

# Load the trained models
try:
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    ml_model = joblib.load(os.path.join(script_dir, 'best_model_15features.pkl'))
    scaler = joblib.load(os.path.join(script_dir, 'scaler_15features.pkl'))
    label_encoder = joblib.load(os.path.join(script_dir, 'label_encoder_15features.pkl'))
    print("✅ ML Models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    ml_model = scaler = label_encoder = None

# Feature names for the form
FEATURE_NAMES = [
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
]

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Forensic Gender Classifier API is running',
        'models_loaded': all([ml_model, scaler, label_encoder]),
        'gemini_ai': 'enabled' if gemini_model else 'disabled'
    })

@app.route('/api/features', methods=['GET'])
def get_features():
    """Get list of required features"""
    return jsonify({
        'features': FEATURE_NAMES,
        'count': len(FEATURE_NAMES)
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict gender from mandibular measurements"""
    try:
        if not all([ml_model, scaler, label_encoder]):
            return jsonify({
                'success': False,
                'error': 'Models not loaded properly'
            }), 500
        
        # Get JSON data
        data = request.get_json()
        
        if not data or 'measurements' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing measurements in request body'
            }), 400
        
        measurements = data['measurements']
        
        # Validate input
        if len(measurements) != 15:
            return jsonify({
                'success': False,
                'error': f'Expected 15 measurements, got {len(measurements)}'
            }), 400
        
        # Convert to numpy array and validate
        try:
            measurements = [float(x) for x in measurements]
        except (ValueError, TypeError):
            return jsonify({
                'success': False,
                'error': 'All measurements must be valid numbers'
            }), 400
        
        # Convert to numpy array and scale
        input_data = np.array(measurements).reshape(1, -1)
        input_scaled = scaler.transform(input_data)
        
        # Make prediction
        prediction = ml_model.predict(input_scaled)[0]
        probabilities = ml_model.predict_proba(input_scaled)[0]
        
        # Get gender label
        gender = label_encoder.inverse_transform([prediction])[0]
        confidence = max(probabilities) * 100
        
        prediction_result = {
            'gender': gender,
            'gender_full': 'Male' if gender == 'M' else 'Female',
            'confidence': round(confidence, 2),
            'probabilities': {
                'Female': round(probabilities[0] * 100, 2),
                'Male': round(probabilities[1] * 100, 2)
            }
        }
        
        # Generate AI explanation
        ai_explanation = generate_ai_explanation(measurements, prediction_result, FEATURE_NAMES)
        
        result = {
            'success': True,
            'prediction': prediction_result,
            'ai_explanation': ai_explanation,
            'input': {
                'measurements': measurements,
                'feature_names': FEATURE_NAMES
            }
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Prediction error: {str(e)}'
        }), 500

@app.route('/api/sample', methods=['GET'])
def get_sample_data():
    """Get sample data for testing"""
    sample_measurements = [10.5, 12.3, 0.85, 9.8, 3.2, 3.1, 6.5, 5.8, 120, 7.5, 1.2, 11.5, 4.2, 3.6, 4.8]
    
    return jsonify({
        'measurements': sample_measurements,
        'feature_names': FEATURE_NAMES,
        'description': 'Sample mandibular measurements for testing'
    })

@app.route('/api/test-gemini', methods=['GET'])
def test_gemini():
    """Test Gemini AI connection"""
    try:
        if not gemini_model:
            return jsonify({
                'success': False,
                'error': 'Gemini model not configured',
                'api_key_present': bool(os.getenv('GEMINI_API_KEY'))
            })
        
        response = gemini_model.generate_content("Say 'Hello from Gemini AI!' in a friendly way.")
        return jsonify({
            'success': True,
            'response': response.text,
            'message': 'Gemini AI is working correctly!'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'api_key_present': bool(os.getenv('GEMINI_API_KEY'))
        })

def generate_ai_explanation(measurements, prediction_result, feature_names):
    """Generate AI explanation using Gemini"""
    try:
        if not gemini_model:
            print("⚠️ Gemini model not available")
            return f"AI analysis unavailable (Gemini not configured). The model predicted {prediction_result['gender_full']} based on the mandibular measurements provided, with {prediction_result['confidence']}% confidence."
        
        # Create a detailed prompt for Gemini
        prompt = f"""As a forensic anthropologist, provide a CONCISE analysis (1-2 sentences per section) explaining why the AI predicted {prediction_result['gender_full']} with {prediction_result['confidence']}% confidence.

MEASUREMENTS: {', '.join([f'{feature}: {value}' for feature, value in zip(feature_names, measurements)])}

PREDICTION: {prediction_result['gender_full']} ({prediction_result['confidence']}% confidence)

Provide BRIEF explanations for:

1. **Key Features**: Which 2-3 measurements most indicate {prediction_result['gender_full']}? (1-2 sentences max)

2. **Comparison**: How do these compare to typical {prediction_result['gender_full'].lower()} vs opposite gender patterns? (1-2 sentences max)

3. **Science**: What biological factors explain this? (1-2 sentences max)

4. **Confidence**: Why {prediction_result['confidence']}% confident? (1 sentence max)

5. **Notable**: Any interesting observations? (1 sentence max)

Keep each section to 1-2 sentences maximum. Be concise and scientific."""

        print("🤖 Generating AI explanation...")
        response = gemini_model.generate_content(prompt)
        print("✅ AI explanation generated successfully")
        return response.text
        
    except Exception as e:
        print(f"❌ Error generating AI explanation: {e}")
        import traceback
        traceback.print_exc()
        return f"AI analysis temporarily unavailable due to technical error. The model predicted {prediction_result['gender_full']} based on the mandibular measurements provided, with {prediction_result['confidence']}% confidence."

if __name__ == '__main__':
    print("🚀 Starting Forensic Gender Classifier API...")
    print("📊 Model: Logistic Regression (75% accuracy)")
    print("🔗 API Endpoints:")
    print("   GET  /api/health   - Health check")
    print("   GET  /api/features - Get feature list")
    print("   POST /api/predict  - Predict gender")
    print("   GET  /api/sample   - Get sample data")
    print("="*50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)