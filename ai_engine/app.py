from flask import Flask, request, jsonify
from flask_cors import CORS
from risk_model import ai_engine
import sys

app = Flask(__name__)
CORS(app)

@app.route('/api/ai/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ONLINE",
        "service": "AI Contextual Safety Risk Engine",
        "framework": "Flask + Scikit-Learn + Pandas + NumPy",
        "version": "1.0.0"
    })

@app.route('/api/ai/risk-score', methods=['POST'])
def calculate_risk_score():
    try:
        data = request.get_json() or {}
        analysis = ai_engine.analyze_risk(data)
        return jsonify({
            "success": True,
            "data": analysis
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    port = 5001
    print("====================================================")
    print(f"[AI Engine] AI Contextual Safety Risk Engine Running on Port {port}")
    print("[AI Engine] Framework: Scikit-learn + Pandas + NumPy + Flask")
    print("====================================================")
    app.run(host='0.0.0.0', port=port, debug=False)
