import http from 'http';

const PYTHON_AI_URL = 'http://127.0.0.1:5001/api/ai/risk-score';

/**
 * JavaScript Resilient Fallback Risk Engine
 * Invoked if Python Flask AI engine is unavailable or timed out.
 */
export function calculateJsFallbackRisk(telemetryData) {
  const currentZone = (telemetryData.currentZone || 'SAFE').toUpperCase();
  const isSos = Boolean(telemetryData.sosActive || telemetryData.sosSignal || currentZone === 'SOS');
  const prevIncidents = parseInt(telemetryData.previousIncidents || (currentZone === 'DANGER' ? 1 : 0), 10);

  let locationRisk = 15.0;
  let zoneRisk = 12.0;
  let movementAnomaly = 10.0;
  let timeRisk = 40.0;
  let distanceRisk = 15.0;
  let riskScore = 18;
  let riskLevel = 'LOW';
  const factors = [];
  let recommendation = '✓ NOMINAL: Continue routine telemetry monitoring. No operational intervention required.';

  if (isSos) {
    riskScore = 100;
    riskLevel = 'CRITICAL';
    locationRisk = 92.0;
    zoneRisk = 90.0;
    movementAnomaly = 90.0;
    distanceRisk = 85.0;

    factors.push({
      factor: 'Active SOS Distress Signal',
      impact: 50,
      description: 'Emergency beacon actively broadcasting distress coordinates.',
    });
    factors.push({
      factor: 'Restricted Hazard Zone Proximity',
      impact: 30,
      description: 'Distress origin confirmed in high hazard coastal perimeter.',
    });
    factors.push({
      factor: 'Responder Distance',
      impact: 20,
      description: 'Nearest QRF patrol unit is 400m away.',
    });

    recommendation = '🚨 IMMEDIATE ACTION: Mobilize Rapid Medical Ambulance QRF 03 & Tourist Police Patrol 12 to GPS coordinates. Establish voice contact.';
  } else if (currentZone === 'DANGER') {
    riskScore = 84;
    riskLevel = 'HIGH';
    locationRisk = 85.0;
    zoneRisk = 88.0;
    movementAnomaly = 75.0;
    distanceRisk = 80.0;

    factors.push({
      factor: 'Restricted Hazard Perimeter Entry',
      impact: 35,
      description: 'Tourist entered high-tide surge hazard zone without guide authorization.',
    });
    factors.push({
      factor: 'Hazard Proximity & Terrain',
      impact: 25,
      description: 'Proximity to steep cliff edges and submerged rocky surge shoals.',
    });
    factors.push({
      factor: 'Distance from Safe Haven',
      impact: 20,
      description: 'Distance to nearest staffed Tourist Police kiosk exceeds 600 meters.',
    });
    factors.push({
      factor: 'Movement & Dwell Anomaly',
      impact: 15,
      description: 'Stationary dwell time detected in high hazard perimeter.',
    });

    recommendation = '⚠ HIGH PRIORITY: Dispatch Tourist Police Patrol 12 for perimeter intercept. Transmit automated evacuation SMS & app advisory.';
  } else if (currentZone === 'WARNING') {
    riskScore = 48;
    riskLevel = 'MEDIUM';
    locationRisk = 45.0;
    zoneRisk = 48.0;
    movementAnomaly = 35.0;
    distanceRisk = 45.0;

    factors.push({
      factor: 'Approaching Buffer Perimeter',
      impact: 40,
      description: 'Trajectory indicates proximity to unmonitored coastal cliff trail.',
    });
    factors.push({
      factor: 'Cellular & Signal Attenuation',
      impact: 30,
      description: 'Variable network telemetry detected in buffer corridor.',
    });
    factors.push({
      factor: 'Environmental Factors',
      impact: 20,
      description: 'Low ambient pathway illumination and tidal slope approach.',
    });

    recommendation = '⚠ ADVISORY: Transmit gentle geo-notification advising tourist to stay within marked promenade boundary.';
  } else {
    riskScore = 18;
    riskLevel = 'LOW';
    locationRisk = 15.0;
    zoneRisk = 12.0;
    movementAnomaly = 10.0;
    distanceRisk = 15.0;

    factors.push({
      factor: 'Safe Corridor Compliance',
      impact: 65,
      description: 'Tourist is fully compliant within verified CCTV & Police patrol zone.',
    });
    factors.push({
      factor: 'Safe Haven Proximity',
      impact: 25,
      description: 'Less than 150m from Heritage Promenade Tourist Police Post A.',
    });
  }

  return {
    riskScore,
    riskLevel,
    engine: 'Node.js Contextual Safety Fallback (Offline Resilient)',
    features: {
      locationRisk,
      zoneRisk,
      movementAnomaly,
      timeRisk,
      previousIncidents: prevIncidents,
      distanceRisk,
      sosSignal: isSos ? 1 : 0,
    },
    factors,
    recommendation,
  };
}

/**
 * Communicates with Python AI Engine on Port 5001 with automatic JS fallback
 */
export async function getAiRiskScore(telemetryData) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const response = await fetch(PYTHON_AI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telemetryData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
    throw new Error(`Python AI response status: ${response.status}`);
  } catch (error) {
    console.warn(`[AI Engine] Python service unavailable (${error.message}). Using JavaScript fallback.`);
    return calculateJsFallbackRisk(telemetryData);
  }
}
