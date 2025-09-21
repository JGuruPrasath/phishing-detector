import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle
import requests
import os

def download_dataset():
    """Download the phishing dataset from the provided URL"""
    url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phishing-VSb3eOYAqzho6Wn0qPCrhTRCWdlpsc.csv"
    
    print("Downloading dataset...")
    response = requests.get(url)
    
    if response.status_code == 200:
        with open('phishing.csv', 'wb') as f:
            f.write(response.content)
        print("Dataset downloaded successfully!")
        return True
    else:
        print(f"Failed to download dataset. Status code: {response.status_code}")
        return False

def train_model():
    """Train Gradient Boost model with the real phishing dataset"""
    
    # Download dataset if not exists
    if not os.path.exists('phishing.csv'):
        if not download_dataset():
            return
    
    # Load the dataset
    print("Loading dataset...")
    df = pd.read_csv('phishing.csv')
    
    print(f"Dataset shape: {df.shape}")
    print(f"Features: {df.columns.tolist()}")
    
    # Prepare features and target
    # Remove 'Index' column if it exists, use 'class' as target
    if 'Index' in df.columns:
        df = df.drop('Index', axis=1)
    
    X = df.drop('class', axis=1)  # Features (30 features)
    y = df['class']  # Target variable
    
    print(f"Features shape: {X.shape}")
    print(f"Target distribution: {y.value_counts()}")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Train Gradient Boosting Classifier
    print("Training Gradient Boosting model...")
    gbc = GradientBoostingClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=3,
        random_state=42
    )
    
    gbc.fit(X_train, y_train)
    
    # Make predictions
    y_pred = gbc.predict(X_test)
    
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    
    # Print detailed classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Print confusion matrix
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': gbc.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Most Important Features:")
    print(feature_importance.head(10))
    
    # Create pickle directory if it doesn't exist
    os.makedirs('pickle', exist_ok=True)
    
    # Save the model
    with open('pickle/model.pkl', 'wb') as f:
        pickle.dump(gbc, f)
    
    print("\nModel saved as 'pickle/model.pkl'")
    print(f"Final Model Accuracy: {accuracy*100:.2f}%")
    
    return gbc, accuracy

if __name__ == "__main__":
    model, accuracy = train_model()
    
    if accuracy >= 0.97:
        print("✅ Model achieved target accuracy of 97%+!")
    else:
        print("⚠️ Model accuracy is below 97%. Consider tuning hyperparameters.")
