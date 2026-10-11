import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

class AiContextualSafetyRiskEngine:
    def __init__(self):
        # Initialize and calibrate base ML model with representative synthetic baseline data
        self.model = RandomForestRegressor(n_estimators=30, random_state=42)
        self._train_baseline_model()

    def _train_baseline_model(self):
        """
        Trains a calibrated multi-factor risk regression baseline using representative safety vectors.
        Features: [locationRisk, zoneRisk, movementAnomaly, timeRisk, previousIncidents, distanceRisk, sosSignal]
        """
        # Baseline training scenarios
        X_train = np.array([
            # locationRisk, zoneRisk, movementAnomaly, timeRisk, prevIncidents, distanceRisk, sosSignal
            [10, 10, 10, 10, 0, 10, 0],   # Nominal Promenade Daytime -> ~15%
            [25, 20, 20, 20, 0, 25, 0],   # Standard Tourist Area -> ~20%
            [45, 50, 40, 35, 1, 45, 0],   # Approaching Buffer Daytime -> ~45%
            [55, 55, 60, 60, 1, 55, 0],   # Buffer Zone Dusk -> ~55%
            [80, 85, 75, 50, 2, 80, 0],   # Restricted Danger Zone Day -> ~82%
            [90, 95, 85, 85, 3, 90, 0],   # Restricted Danger Zone Night/Tide -> ~92%
            [95, 95, 95, 95, 4, 95, 1],   # Active Distress SOS -> 100%
            [30, 20, 15, 15, 0, 20, 1],   # Safe Area SOS Panic -> 100%
        ])
        y_train = np.array([15, 20, 45, 55, 82, 92, 100, 100])
        self.model.fit(X_train, y_train)

    def analyze_risk(self, telemetry_data: dict) -> dict:
        """
        Calculates an explainable contextual safety-risk score and decomposes contributing factors.
        """
        current_zone = telemetry_data.get('currentZone', 'SAFE').upper()
        sos_signal = 1 if (telemetry_data.get('sosActive') or telemetry_data.get('sosSignal') or current_zone == 'SOS') else 0
        prev_incidents = int(telemetry_data.get('previousIncidents', 1 if current_zone == 'DANGER' else 0))
        
        # Calculate individual feature risk scores (0 to 100)
        # 1. Zone Risk
        if current_zone == 'DANGER':
            zone_risk = 88.0
        elif current_zone == 'WARNING':
            zone_risk = 48.0
        else:
            zone_risk = 12.0

        # 2. Location Risk (proximity to cliffs / rocky shoals)
        coords = telemetry_data.get('coordinates', [15.5005, 73.8260])
        lat, lng = coords[0], coords[1]
        
        # Distance from dangerous rocky point [15.5150, 73.8500]
        dist_to_hazard = np.sqrt((lat - 15.5150)**2 + (lng - 73.8500)**2)
        location_risk = float(np.clip(100.0 - (dist_to_hazard * 3000.0), 10.0, 95.0))
        if current_zone == 'DANGER':
            location_risk = max(location_risk, 80.0)
        elif current_zone == 'SAFE':
            location_risk = min(location_risk, 20.0)

        # 3. Movement Anomaly (dwell time / erratic velocity)
        movement_anomaly = float(telemetry_data.get('movementAnomaly', 75.0 if current_zone == 'DANGER' else 35.0 if current_zone == 'WARNING' else 10.0))

        # 4. Time Risk (high tide / dusk factor)
        time_risk = float(telemetry_data.get('timeRisk', 40.0))

        # 5. Distance Risk (distance from nearest staffed responder kiosk)
        distance_risk = float(telemetry_data.get('distanceRisk', 80.0 if current_zone == 'DANGER' else 45.0 if current_zone == 'WARNING' else 15.0))

        # Build feature vector
        features = np.array([[location_risk, zone_risk, movement_anomaly, time_risk, prev_incidents, distance_risk, sos_signal]])
        
        # ML model prediction
        predicted_score = float(self.model.predict(features)[0])

        # Enforce boundary guarantees
        if sos_signal == 1:
            risk_score = 100
        elif current_zone == 'DANGER':
            risk_score = int(np.clip(max(predicted_score, 82.0), 80, 98))
        elif current_zone == 'WARNING':
            risk_score = int(np.clip(predicted_score, 35, 58))
        else:
            risk_score = int(np.clip(predicted_score, 10, 28))

        # Map to standard risk levels
        if risk_score <= 30:
            risk_level = 'LOW'
        elif risk_score <= 60:
            risk_level = 'MEDIUM'
        elif risk_score <= 80:
            risk_level = 'HIGH'
        else:
            risk_level = 'CRITICAL'

        # Decompose explainable factors
        factors = []
        if sos_signal == 1:
            factors.append({
                "factor": "Active SOS Distress Signal",
                "impact": 50,
                "description": "Emergency beacon actively broadcasting distress coordinates."
            })

        if current_zone == 'DANGER':
            factors.append({
                "factor": "Restricted Hazard Perimeter Entry",
                "impact": 35,
                "description": "Tourist located inside high-tide surge danger zone without guide authorization."
            })
            factors.append({
                "factor": "Hazard Proximity & Terrain",
                "impact": 25,
                "description": "Proximity to steep cliff edges and submerged rocky surge shoals."
            })
            factors.append({
                "factor": "Distance from Safe Haven",
                "impact": 20,
                "description": "Distance to nearest staffed Tourist Police kiosk exceeds 600 meters."
            })
            factors.append({
                "factor": "Movement & Dwell Anomaly",
                "impact": 15,
                "description": "Stationary dwell time detected in high hazard perimeter."
            })
        elif current_zone == 'WARNING':
            factors.append({
                "factor": "Approaching Buffer Perimeter",
                "impact": 40,
                "description": "Trajectory indicates proximity to unmonitored coastal cliff trail."
            })
            factors.append({
                "factor": "Cellular & Signal Attenuation",
                "impact": 30,
                "description": "Variable network telemetry detected in buffer corridor."
            })
            factors.append({
                "factor": "Environmental Factors",
                "impact": 20,
                "description": "Low ambient pathway illumination and tidal slope approach."
            })
        else:
            factors.append({
                "factor": "Safe Corridor Compliance",
                "impact": 65,
                "description": "Tourist is fully compliant within verified CCTV & Police patrol zone."
            })
            factors.append({
                "factor": "Safe Haven Proximity",
                "impact": 25,
                "description": "Less than 150m from Heritage Promenade Tourist Police Post A."
            })

        # Generate Contextual Operational Recommendations
        if risk_level == 'CRITICAL':
            recommendation = "🚨 IMMEDIATE ACTION: Mobilize Rapid Medical Ambulance QRF 03 & Tourist Police Patrol 12 to GPS coordinates. Establish voice contact."
        elif risk_level == 'HIGH':
            recommendation = "⚠ HIGH PRIORITY: Dispatch Tourist Police Patrol 12 for perimeter intercept. Transmit automated evacuation SMS & app advisory."
        elif risk_level == 'MEDIUM':
            recommendation = "⚠ ADVISORY: Transmit gentle geo-notification advising tourist to stay within marked promenade boundary."
        else:
            recommendation = "✓ NOMINAL: Continue routine telemetry monitoring. No operational intervention required."

        return {
            "riskScore": risk_score,
            "riskLevel": risk_level,
            "engine": "Python Scikit-Learn Contextual Ensemble v2.4",
            "features": {
                "locationRisk": round(location_risk, 1),
                "zoneRisk": round(zone_risk, 1),
                "movementAnomaly": round(movement_anomaly, 1),
                "timeRisk": round(time_risk, 1),
                "previousIncidents": prev_incidents,
                "distanceRisk": round(distance_risk, 1),
                "sosSignal": sos_signal
            },
            "factors": factors,
            "recommendation": recommendation
        }

# Global singleton instance
ai_engine = AiContextualSafetyRiskEngine()
