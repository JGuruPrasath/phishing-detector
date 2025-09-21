import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from train_model import train_model
import pickle
import numpy as np

def test_model():
    """Test the trained model with sample URLs"""
    try:
        # Load the trained model
        with open('public/model.pkl', 'rb') as f:
            model = pickle.load(f)
        
        print("Model loaded successfully!")
        
        # Test with sample feature vectors (simulating real URL features)
        test_cases = [
            {
                'name': 'Legitimate URL (Google)',
                'features': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            {
                'name': 'Suspicious URL (Multiple red flags)',
                'features': [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
            },
            {
                'name': 'Mixed signals URL',
                'features': [1, 0, 1, 1, 1, -1, 0, 1, -1, 1, 1, 1, 0, 0, 0, 1, 1, -1, 0, 1, 1, 1, 1, -1, 0, 0, 0, 1, 0, 1]
            }
        ]
        
        print("\nTesting model predictions:")
        print("-" * 50)
        
        for test_case in test_cases:
            features = np.array(test_case['features']).reshape(1, -1)
            prediction = model.predict(features)[0]
            probability = model.predict_proba(features)[0]
            
            # Get probability for phishing class (-1)
            phishing_prob = probability[0] if model.classes_[0] == -1 else probability[1]
            
            print(f"\n{test_case['name']}:")
            print(f"  Prediction: {'PHISHING' if prediction == -1 else 'LEGITIMATE'}")
            print(f"  Confidence: {phishing_prob * 100:.1f}% phishing")
            print(f"  Features: {test_case['features'][:5]}... (showing first 5)")
        
        return True
        
    except Exception as e:
        print(f"Error testing model: {e}")
        return False

def main():
    """Main function to train and test the model"""
    print("=" * 60)
    print("PHISHING URL DETECTION - MODEL TRAINING & TESTING")
    print("=" * 60)
    
    # Train the model
    try:
        model = train_model()
        print("\n" + "=" * 60)
        print("TRAINING COMPLETED SUCCESSFULLY!")
        print("=" * 60)
    except Exception as e:
        print(f"Training failed: {e}")
        return
    
    # Test the model
    print("\n" + "=" * 60)
    print("TESTING MODEL PREDICTIONS")
    print("=" * 60)
    
    if test_model():
        print("\n" + "=" * 60)
        print("MODEL READY FOR PRODUCTION!")
        print("=" * 60)
    else:
        print("Model testing failed!")

if __name__ == "__main__":
    main()
