#!/usr/bin/env python3
"""
🧬 ML-Based Forensic Gender Classifier
Team Metric Mind - VTU CSE Project

Using 15 Mandibular Measurements (No Serial No./ID)
"""

# Import libraries
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

print("✅ Libraries imported successfully!")

def main():
    """Main function to run the forensic gender classifier"""
    
    # Load dataset
    print("="*80)
    print("LOADING DATASET")
    print("="*80)
    
    try:
        df = pd.read_excel('Metric_Final.xlsx')
        print(f"✅ Dataset loaded successfully!")
        print(f"📊 Shape: {df.shape[0]} rows × {df.shape[1]} columns")
    except FileNotFoundError:
        print("❌ Error: Metric_Final.xlsx not found!")
        print("Please ensure the file is in the current directory.")
        return
    
    # Display basic info
    print(f"\n📋 First 5 rows:")
    print(df.head())
    
    print(f"\n🎯 Gender Distribution:")
    print(df['Gender'].value_counts())
    print(f"\nPercentage:")
    print(df['Gender'].value_counts(normalize=True) * 100)
    
    # Data preprocessing
    print("\n" + "="*80)
    print("DATA PREPROCESSING")
    print("="*80)
    
    # Separate features and target - EXCLUDE S. No. and ID No.
    target_col = 'Gender'
    exclude_cols = ['S. No.', 'ID No.', 'Gender']
    X = df.drop(columns=exclude_cols)
    y = df[target_col]
    
    print(f"\n✓ Total Features: {len(X.columns)}\n")
    for i, col in enumerate(X.columns, 1):
        print(f"  {i:2d}. {col}")
    
    # Handle missing values
    X = X.fillna(X.median())
    print(f"\n✓ Missing values handled")
    
    # Encode target
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    print(f"✓ Target encoded: {le.classes_} → {np.unique(y_encoded)}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    print(f"\n✓ Training set: {X_train.shape[0]} samples")
    print(f"✓ Testing set: {X_test.shape[0]} samples")
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print(f"✓ Features scaled using StandardScaler")
    
    # Train models
    print("\n" + "="*80)
    print("TRAINING ML MODELS")
    print("="*80)
    
    results = {}
    
    # Model 1: SVM
    print("\n🎯 [1/5] Training SVM...")
    svm_model = SVC(kernel='rbf', probability=True, random_state=42)
    svm_model.fit(X_train_scaled, y_train)
    y_pred_svm = svm_model.predict(X_test_scaled)
    svm_acc = accuracy_score(y_test, y_pred_svm)
    print(f"   ✓ Accuracy: {svm_acc:.4f} ({svm_acc*100:.2f}%)")
    results['SVM'] = {'model': svm_model, 'accuracy': svm_acc, 'predictions': y_pred_svm}
    
    # Model 2: Random Forest
    print("\n🌲 [2/5] Training Random Forest...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train_scaled, y_train)
    y_pred_rf = rf_model.predict(X_test_scaled)
    rf_acc = accuracy_score(y_test, y_pred_rf)
    print(f"   ✓ Accuracy: {rf_acc:.4f} ({rf_acc*100:.2f}%)")
    results['Random Forest'] = {'model': rf_model, 'accuracy': rf_acc, 'predictions': y_pred_rf}
    
    # Model 3: Logistic Regression
    print("\n📈 [3/5] Training Logistic Regression...")
    lr_model = LogisticRegression(max_iter=1000, random_state=42)
    lr_model.fit(X_train_scaled, y_train)
    y_pred_lr = lr_model.predict(X_test_scaled)
    lr_acc = accuracy_score(y_test, y_pred_lr)
    print(f"   ✓ Accuracy: {lr_acc:.4f} ({lr_acc*100:.2f}%)")
    results['Logistic Regression'] = {'model': lr_model, 'accuracy': lr_acc, 'predictions': y_pred_lr}
    
    # Model 4: Decision Tree
    print("\n🌳 [4/5] Training Decision Tree...")
    dt_model = DecisionTreeClassifier(random_state=42)
    dt_model.fit(X_train_scaled, y_train)
    y_pred_dt = dt_model.predict(X_test_scaled)
    dt_acc = accuracy_score(y_test, y_pred_dt)
    print(f"   ✓ Accuracy: {dt_acc:.4f} ({dt_acc*100:.2f}%)")
    results['Decision Tree'] = {'model': dt_model, 'accuracy': dt_acc, 'predictions': y_pred_dt}
    
    # Model 5: Neural Network
    print("\n🧠 [5/5] Training Neural Network...")
    nn_model = MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=1000, random_state=42)
    nn_model.fit(X_train_scaled, y_train)
    y_pred_nn = nn_model.predict(X_test_scaled)
    nn_acc = accuracy_score(y_test, y_pred_nn)
    print(f"   ✓ Accuracy: {nn_acc:.4f} ({nn_acc*100:.2f}%)")
    results['Neural Network'] = {'model': nn_model, 'accuracy': nn_acc, 'predictions': y_pred_nn}
    
    print("\n✅ All models trained successfully!")
    
    # Model comparison
    comparison_df = pd.DataFrame([
        {'Model': name, 'Accuracy': data['accuracy']}
        for name, data in results.items()
    ]).sort_values('Accuracy', ascending=False)
    
    print("\n" + "="*80)
    print("MODEL PERFORMANCE COMPARISON")
    print("="*80)
    print(comparison_df)
    
    # Find best model
    best_model_name = comparison_df.iloc[0]['Model']
    best_model = results[best_model_name]['model']
    best_accuracy = comparison_df.iloc[0]['Accuracy']
    
    print(f"\n🏆 BEST MODEL: {best_model_name}")
    print(f"✅ Accuracy: {best_accuracy:.4f} ({best_accuracy*100:.2f}%)")
    
    # Save models
    print("\n" + "="*80)
    print("SAVING MODELS")
    print("="*80)
    
    joblib.dump(best_model, 'best_model_15features.pkl')
    joblib.dump(scaler, 'scaler_15features.pkl')
    joblib.dump(le, 'label_encoder_15features.pkl')
    
    with open('feature_names_15.txt', 'w') as f:
        for feature in X.columns:
            f.write(f"{feature}\n")
    
    print("✅ All models saved successfully!")
    
    return best_model, scaler, le, X.columns

if __name__ == "__main__":
    main()