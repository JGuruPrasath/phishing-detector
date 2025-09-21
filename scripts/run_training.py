import subprocess
import sys

def run_training():
    """Run the training script and capture output"""
    try:
        print("Starting model training with real dataset...")
        result = subprocess.run([sys.executable, "scripts/train_model.py"], 
                              capture_output=True, text=True, cwd=".")
        
        print("STDOUT:")
        print(result.stdout)
        
        if result.stderr:
            print("STDERR:")
            print(result.stderr)
        
        if result.returncode == 0:
            print("Training completed successfully!")
        else:
            print(f"Training failed with return code: {result.returncode}")
            
    except Exception as e:
        print(f"Error running training: {e}")

if __name__ == "__main__":
    run_training()
