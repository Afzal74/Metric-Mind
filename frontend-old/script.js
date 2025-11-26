// Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Global variables
let features = [];
let sampleData = [10.5, 12.3, 0.85, 9.8, 3.2, 3.1, 6.5, 5.8, 120, 7.5, 1.2, 11.5, 4.2, 3.6, 4.8];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAPIHealth();
    loadFeatures();
    setupEventListeners();
});

// Check if API is running
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        if (data.status === 'healthy') {
            showAPIStatus('✅ API Connected Successfully', 'success');
        } else {
            showAPIStatus('⚠️ API Connected but Models Not Loaded', 'warning');
        }
    } catch (error) {
        showAPIStatus('❌ Cannot Connect to API. Make sure backend is running on port 5000.', 'error');
    }
}

// Show API status
function showAPIStatus(message, type) {
    const statusDiv = document.createElement('div');
    statusDiv.className = `api-status ${type === 'error' ? 'error' : ''}`;
    statusDiv.innerHTML = `<p>${message}</p>`;
    
    const content = document.querySelector('.content');
    content.insertBefore(statusDiv, content.firstChild);
    
    statusDiv.style.display = 'block';
    
    // Hide after 5 seconds if success
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}

// Load features from API
async function loadFeatures() {
    try {
        const response = await fetch(`${API_BASE_URL}/features`);
        const data = await response.json();
        features = data.features;
        generateForm();
    } catch (error) {
        console.error('Error loading features:', error);
        // Fallback to hardcoded features
        features = [
            "M1 Length", "M2 Bicondylar breadth", "M3 Mandibular index",
            "M3 Bigonial breadth", "M5 URB", "M6 LRB", "M7 CondRH",
            "M8 CorRH", "M9 Gonial angle", "M10 Cor length",
            "M11 Cor breadth", "M12 C-C distance", "M13 Inter cor distance",
            "M14 Cor-Fr distance", "M15 Bimental breadth"
        ];
        generateForm();
    }
}

// Generate form fields dynamically
function generateForm() {
    const formGrid = document.getElementById('formGrid');
    formGrid.innerHTML = '';
    
    features.forEach((feature, index) => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        formGroup.innerHTML = `
            <label for="feature_${index}">${index + 1}. ${feature}</label>
            <input type="number" 
                   id="feature_${index}" 
                   name="feature_${index}" 
                   step="0.01" 
                   required 
                   placeholder="Enter ${feature.toLowerCase()}">
        `;
        
        formGrid.appendChild(formGroup);
    });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('predictionForm').addEventListener('submit', handlePrediction);
}

// Fill form with sample data
function fillSampleData() {
    sampleData.forEach((value, index) => {
        const input = document.getElementById(`feature_${index}`);
        if (input) {
            input.value = value;
        }
    });
}

// Load sample data from API
async function loadSampleFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/sample`);
        const data = await response.json();
        
        data.measurements.forEach((value, index) => {
            const input = document.getElementById(`feature_${index}`);
            if (input) {
                input.value = value;
            }
        });
        
        showAPIStatus('✅ Sample data loaded from API', 'success');
    } catch (error) {
        console.error('Error loading sample data:', error);
        showAPIStatus('❌ Failed to load sample data from API', 'error');
        // Fallback to local sample data
        fillSampleData();
    }
}

// Handle prediction
async function handlePrediction(e) {
    e.preventDefault();
    
    const predictBtn = document.getElementById('predictBtn');
    const loading = document.getElementById('loading');
    const resultCard = document.getElementById('resultCard');
    
    // Show loading
    predictBtn.disabled = true;
    predictBtn.textContent = 'Analyzing...';
    loading.style.display = 'block';
    resultCard.style.display = 'none';
    
    try {
        // Collect measurements
        const measurements = [];
        for (let i = 0; i < features.length; i++) {
            const input = document.getElementById(`feature_${i}`);
            if (!input || !input.value) {
                throw new Error(`Missing value for ${features[i]}`);
            }
            measurements.push(parseFloat(input.value));
        }
        
        // Make API call
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                measurements: measurements
            })
        });
        
        const result = await response.json();
        
        // Hide loading
        loading.style.display = 'none';
        predictBtn.disabled = false;
        predictBtn.textContent = '🔍 Predict Gender';
        
        // Show result
        resultCard.style.display = 'block';
        
        if (result.success) {
            resultCard.className = 'result-card result-success';
            
            const prediction = result.prediction;
            const genderIcon = prediction.gender === 'M' ? '👨' : '👩';
            
            document.getElementById('resultContent').innerHTML = `
                <div class="result-gender">${genderIcon} ${prediction.gender_full}</div>
                <div class="result-confidence">Confidence: ${prediction.confidence}%</div>
                <div class="probabilities">
                    <div class="prob-item">
                        <div class="prob-label">👩 Female</div>
                        <div class="prob-value">${prediction.probabilities.Female}%</div>
                    </div>
                    <div class="prob-item">
                        <div class="prob-label">👨 Male</div>
                        <div class="prob-value">${prediction.probabilities.Male}%</div>
                    </div>
                </div>
            `;
        } else {
            resultCard.className = 'result-card result-error';
            document.getElementById('resultContent').innerHTML = `
                <h3>❌ Error</h3>
                <p>${result.error}</p>
            `;
        }
        
    } catch (error) {
        // Hide loading
        loading.style.display = 'none';
        predictBtn.disabled = false;
        predictBtn.textContent = '🔍 Predict Gender';
        
        // Show error
        resultCard.style.display = 'block';
        resultCard.className = 'result-card result-error';
        document.getElementById('resultContent').innerHTML = `
            <h3>❌ Network Error</h3>
            <p>${error.message || 'Failed to connect to the server. Please make sure the backend is running.'}</p>
        `;
    }
}