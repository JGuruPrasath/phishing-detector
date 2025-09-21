from flask import Flask, request, render_template, jsonify
import numpy as np
import pandas as pd
from sklearn import metrics 
import warnings
import pickle
warnings.filterwarnings('ignore')
from feature import FeatureExtraction
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "model.pkl")

# Load model - create a dummy one if it doesn't exist
try:
    with open(model_path, "rb") as file:
        gbc = pickle.load(file)
except:
    # Create a dummy model for testing
    from sklearn.ensemble import GradientBoostingClassifier
    gbc = GradientBoostingClassifier()

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        url = request.form["url"]
        
        try:
            obj = FeatureExtraction(url)
            x = np.array(obj.getFeaturesList()).reshape(1, 30) 
            
            # Get prediction and probabilities
            y_pred = gbc.predict(x)[0]
            y_proba = gbc.predict_proba(x)[0]
            
            # Assuming class 0 is phishing, class 1 is safe
            phishing_prob = y_proba[0] * 100
            safe_prob = y_proba[1] * 100
            
            # Determine result based on prediction
            if y_pred == 1:
                result = f"✅ SAFE - {safe_prob:.1f}% confidence"
                risk_level = "low"
            else:
                result = f"⚠️ PHISHING DETECTED - {phishing_prob:.1f}% confidence"
                risk_level = "high"
                
            return render_template('index.html', 
                                 result=result,
                                 url=url,
                                 safe_prob=safe_prob,
                                 phishing_prob=phishing_prob,
                                 risk_level=risk_level)
                                 
        except Exception as e:
            return render_template('index.html', 
                                 result=f"Error analyzing URL: {str(e)}", 
                                 url=url,
                                 risk_level="unknown")
    
    return render_template("index.html")

@app.route("/api/scan", methods=["POST"])
def api_scan():
    """API endpoint for URL scanning"""
    try:
        data = request.get_json()
        url = data.get('url', '')
        
        if not url:
            return jsonify({"error": "URL is required"}), 400
            
        # Extract features
        obj = FeatureExtraction(url)
        features = obj.getFeaturesList()
        x = np.array(features).reshape(1, 30)
        
        # Make prediction
        y_pred = gbc.predict(x)[0]
        y_proba = gbc.predict_proba(x)[0]
        
        # Format response
        is_safe = y_pred == 1
        confidence = (y_proba[1] if is_safe else y_proba[0]) * 100
        
        return jsonify({
            "url": url,
            "is_safe": is_safe,
            "confidence": round(confidence, 1),
            "risk_level": "low" if is_safe else "high",
            "features": features
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
