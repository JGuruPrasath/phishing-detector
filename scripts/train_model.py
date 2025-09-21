import numpy as np
import pandas as pd
import pickle
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import requests
import warnings
warnings.filterwarnings('ignore')

def load_real_dataset():
    """Load the real phishing dataset from the provided URL"""
    url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phishing-VSb3eOYAqzho6Wn0qPCrhTRCWdlpsc.csv"
    
    print("Downloading phishing dataset...")
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Save temporarily to read with pandas
        with open('temp_dataset.csv', 'wb') as f:
            f.write(response.content)
        
        # Load the dataset
        df = pd.read_csv('temp_dataset.csv')
        print(f"Dataset loaded successfully! Shape: {df.shape}")
        
        # Display basic info about the dataset
        print(f"Columns: {list(df.columns)}")
        print(f"Class distribution:")
        print(df['class'].value_counts())
        
        return df
        
    except Exception as e:
        print(f"Error loading dataset: {e}")
        raise

def preprocess_data(df):
    """Preprocess the dataset for training"""
    # Remove the Index column if it exists
    if 'Index' in df.columns:
        df = df.drop('Index', axis=1)
    
    # Separate features and target
    X = df.drop('class', axis=1)
    y = df['class']
    
    print(f"Features shape: {X.shape}")
    print(f"Target distribution:")
    print(f"Legitimate (1): {np.sum(y == 1)}")
    print(f"Phishing (-1): {np.sum(y == -1)}")
    
    return X.values, y.values

def train_model():
    print("Loading real phishing dataset...")
    df = load_real_dataset()
    
    print("Preprocessing data...")
    X, y = preprocess_data(df)
    
    # Split into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Train the model (same parameters as original for consistency)
    print("Training Gradient Boosting Classifier...")
    model = GradientBoostingClassifier(max_depth=4, learning_rate=0.7, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Model Accuracy: {accuracy:.3f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # Feature importance analysis
    feature_names = [
        'UsingIP', 'LongURL', 'ShortURL', 'Symbol@', 'Redirecting//', 'PrefixSuffix-',
        'SubDomains', 'HTTPS', 'DomainRegLen', 'Favicon', 'NonStdPort', 'HTTPSDomainURL',
        'RequestURL', 'AnchorURL', 'LinksInScriptTags', 'ServerFormHandler', 'InfoEmail',
        'AbnormalURL', 'WebsiteForwarding', 'StatusBarCust', 'DisableRightClick',
        'UsingPopupWindow', 'IframeRedirection', 'AgeofDomain', 'DNSRecording',
        'WebsiteTraffic', 'PageRank', 'GoogleIndex', 'LinksPointingToPage', 'StatsReport'
    ]
    
    feature_importance = model.feature_importances_
    importance_df = pd.DataFrame({
        'feature': feature_names,
        'importance': feature_importance
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Most Important Features:")
    print(importance_df.head(10))
    
    # Save the model
    print("Saving model...")
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    # Save feature importance for the web app
    importance_df.to_json('feature_importance.json', orient='records')
    
    print("Model and feature importance saved successfully!")
    return model

if __name__ == "__main__":
    train_model()
