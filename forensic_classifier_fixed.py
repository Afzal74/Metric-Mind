#!/usr/bin/env python3
"""
🧬 ML-Based Forensic Gender Classifier
Team Metric Mind - VTU CSE Project

Using 15 Mandibular Measurements (No Serial No./ID)
Best Model: Logistic Regression with 75.00% accuracy
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import warnings
warnings.filterwarnings('ignore')

def main():
    print("="*80)
    print("🧬 ML-BASED FORENSIC GENDER CLASSIFIER")
    print("Team Metric Mind - VTU CSE Project")
    print("="*80)
    
    # Step 1: Load dataset
    print("\n📊 Step 1: Loading Dataset...")
    try:
        df = pd.read_excel('Metric_Final.xlsx')
        print(f"✅ Dataset loaded successfully!")
        print(f"📊 Shape: {df.shape[0]} rows × {df.shape[1]} columns")
        print(f"\n📋 First 5 rows:")
        print(df.head())
        
        print(f"\n🎯 Gender Distribution:")
        print(df['Gender'].value_counts())
        print(f"\nPercentage:")
        print(df['Gender'].value_counts(normalize=True) * 100)
        
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        return
    
    # Step 2: Data Preprocessing
    print("\n🔧 Step 2: Data Preprocessing...")
    
    # Remove S. No. and ID No. - Use only 15 mandibular measurements
    target_col = 'Gender'
    exclude_cols = ['S. No.', 'ID No.', 'Gender']
    X = df.drop(columns=exclude_cols)
    y = df[target_col]
    
    print(f"✓ Total Features: {len(X.columns)}")
    print("\n15 Mandibular Measurements:")
    for i, col in enumerate(X.columns, 1):
        print(f"  {i:2d}. {col}")
    
    # Handle missing values
    X = X.fillna(X.median())
    print(f"\n✓ Missing values handled")
    
    # Encode target
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    print(f"✓ Target encoded: {le.classes_} → {np.unique(y_encoded)}")
    
    # Step 3: Train-Test Split
    print("\n📦 Step 3: Train-Test Split...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    print(f"✓ Training set: {X_train.shape[0]} samples")
    print(f"✓ Testing set: {X_test.shape[0]} samples")
    
    # Step 4: Feature Scaling
    print("\n🔧 Step 4: Feature Scaling...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print("✓ Features scaled using StandardScaler")
    
    # Step 5: Train Multiple ML Models
    print("\n🤖 Step 5: Training Multiple ML Models...")
    results = {}
    
    # Model 1: SVM
    print("🎯 [1/5] Training SVM...")
    svm_model = SVC(kernel='rbf', probability=True, random_state=42)
    svm_model.fit(X_train_scaled, y_train)
    y_pred_svm = svm_model.predict(X_test_scaled)
    svm_acc = accuracy_score(y_test, y_pred_svm)
    print(f"   ✓ Accuracy: {svm_acc:.4f} ({svm_acc*100:.2f}%)")
    results['SVM'] = {'model': svm_model, 'accuracy': svm_acc, 'predictions': y_pred_svm}
    
    # Model 2: Random Forest
    print("🌲 [2/5] Training Random Forest...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train_scaled, y_train)
    y_pred_rf = rf_model.predict(X_test_scaled)
    rf_acc = accuracy_score(y_test, y_pred_rf)
    print(f"   ✓ Accuracy: {rf_acc:.4f} ({rf_acc*100:.2f}%)")
    results['Random Forest'] = {'model': rf_model, 'accuracy': rf_acc, 'predictions': y_pred_rf}
    
    # Model 3: Logistic Regression
    print("📈 [3/5] Training Logistic Regression...")
    lr_model = LogisticRegression(max_iter=1000, random_state=42)
    lr_model.fit(X_train_scaled, y_train)
    y_pred_lr = lr_model.predict(X_test_scaled)
    lr_acc = accuracy_score(y_test, y_pred_lr)
    print(f"   ✓ Accuracy: {lr_acc:.4f} ({lr_acc*100:.2f}%)")
    results['Logistic Regression'] = {'model': lr_model, 'accuracy': lr_acc, 'predictions': y_pred_lr}
    
    # Model 4: Decision Tree
    print("🌳 [4/5] Training Decision Tree...")
    dt_model = DecisionTreeClassifier(random_state=42)
    dt_model.fit(X_train_scaled, y_train)
    y_pred_dt = dt_model.predict(X_test_scaled)
    dt_acc = accuracy_score(y_test, y_pred_dt)
    print(f"   ✓ Accuracy: {dt_acc:.4f} ({dt_acc*100:.2f}%)")
    results['Decision Tree'] = {'model': dt_model, 'accuracy': dt_acc, 'predictions': y_pred_dt}
    
    # Model 5: Neural Network
    print("🧠 [5/5] Training Neural Network...")
    nn_model = MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=1000, random_state=42)
    nn_model.fit(X_train_scaled, y_train)
    y_pred_nn = nn_model.predict(X_test_scaled)
    nn_acc = accuracy_score(y_test, y_pred_nn)
    print(f"   ✓ Accuracy: {nn_acc:.4f} ({nn_acc*100:.2f}%)")
    results['Neural Network'] = {'model': nn_model, 'accuracy': nn_acc, 'predictions': y_pred_nn}
    
    print("\n✅ All models trained successfully!")
    
    # Step 6: Model Comparison
    print("\n📊 Step 6: Model Comparison...")
    comparison_df = pd.DataFrame([
        {'Model': name, 'Accuracy': data['accuracy']}
        for name, data in results.items()
    ]).sort_values('Accuracy', ascending=False)
    
    print("\nMODEL PERFORMANCE COMPARISON:")
    print(comparison_df.to_string(index=False))
    
    # Find best model
    best_model_name = comparison_df.iloc[0]['Model']
    best_model = results[best_model_name]['model']
    best_accuracy = comparison_df.iloc[0]['Accuracy']
    
    print(f"\n🏆 BEST MODEL: {best_model_name}")
    print(f"✅ Accuracy: {best_accuracy:.4f} ({best_accuracy*100:.2f}%)")
    
    # Step 7: Detailed Evaluation
    print(f"\n🎯 Step 7: Detailed Evaluation of {best_model_name}...")
    y_pred_best = results[best_model_name]['predictions']
    
    print("\n📋 Classification Report:")
    print(classification_report(y_test, y_pred_best, target_names=le.classes_))
    
    print("\n🎯 Confusion Matrix:")
    cm = confusion_matrix(y_test, y_pred_best)
    print(cm)
    
    # Step 8: Save Models
    print("\n💾 Step 8: Saving Models...")
    
    # Save best model
    joblib.dump(best_model, 'best_model_15features.pkl')
    print("✓ Best model saved: best_model_15features.pkl")
    
    # Save scaler
    joblib.dump(scaler, 'scaler_15features.pkl')
    print("✓ Scaler saved: scaler_15features.pkl")
    
    # Save label encoder
    joblib.dump(le, 'label_encoder_15features.pkl')
    print("✓ Label encoder saved: label_encoder_15features.pkl")
    
    # Save feature names
    with open('feature_names_15.txt', 'w') as f:
        for feature in X.columns:
            f.write(f"{feature}\n")
    print("✓ Feature names saved: feature_names_15.txt")
    
    # Save all models
    for model_name, model_data in results.items():
        filename = f"model_{model_name.replace(' ', '_').lower()}_15features.pkl"
        joblib.dump(model_data['model'], filename)
        print(f"✓ {model_name} saved: {filename}")
    
    print("\n✅ All models saved successfully!")
    
    # Step 9: Test with Custom Input
    print("\n🧪 Step 9: Testing with Custom Input...")
    
    def predict_gender(measurements):
        """Predict gender from 15 mandibular measurements"""
        if len(measurements) != 15:
            return {'error': f'Expected 15 measurements, got {len(measurements)}'}
        
        # Convert to numpy array
        input_data = np.array(measurements).reshape(1, -1)
        
        # Scale
        input_scaled = scaler.transform(input_data)
        
        # Predict
        prediction = best_model.predict(input_scaled)[0]
        probabilities = best_model.predict_proba(input_scaled)[0]
        
        # Get label
        gender = le.inverse_transform([prediction])[0]
        confidence = max(probabilities) * 100
        
        return {
            'gender': gender,
            'confidence': f'{confidence:.2f}%',
            'probabilities': {
                'Female': f'{probabilities[0]*100:.2f}%',
                'Male': f'{probabilities[1]*100:.2f}%'
            }
        }
    
    # Example test
    sample_measurements = [
        10.5, 12.3, 0.85, 9.8, 3.2, 3.1, 6.5, 5.8, 120, 7.5, 1.2, 11.5, 4.2, 3.6, 4.8
    ]
    
    print(f"\n📝 Testing with {len(sample_measurements)} sample measurements...")
    result = predict_gender(sample_measurements)
    print(f"🎯 Prediction: {result['gender']}")
    print(f"✅ Confidence: {result['confidence']}")
    print("📊 Probabilities:")
    for gender, prob in result['probabilities'].items():
        print(f"  • {gender}: {prob}")
    
    print("\n" + "="*80)
    print("✅ FORENSIC GENDER CLASSIFIER COMPLETED SUCCESSFULLY!")
    print(f"🏆 Best Model: {best_model_name} ({best_accuracy*100:.2f}% accuracy)")
    print("📁 All model files saved and ready for use!")
    print("="*80)

if __name__ == "__main__":
    main()