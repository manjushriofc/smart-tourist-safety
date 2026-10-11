import { store } from '../data/inMemoryStore.js';
import { checkGeofence } from './geofenceService.js';
import { getAiRiskScore } from './aiService.js';
import { auditLedger } from './auditLedgerService.js';
import {
  broadcastTouristUpdate,
  broadcastIncidentCreated,
  broadcastIncidentUpdated,
  broadcastSosAlert,
  broadcastKpiUpdate,
} from './socketService.js';

/**
 * Updates a tourist's location, computes geofence, runs AI Risk Analysis, and records ledger blocks.
 */
export async function handleLocationUpdate(touristId, latitude, longitude) {
  const tourist = store.getTouristById(touristId);
  if (!tourist) {
    throw new Error(`Tourist ${touristId} not found`);
  }

  // Calculate geofence result
  const geoResult = checkGeofence(latitude, longitude);

  const prevZone = tourist.currentZone;
  const isSos = tourist.sosActive;

  // Run AI Contextual Safety Risk Engine
  const aiAnalysis = await getAiRiskScore({
    touristId: tourist.id,
    coordinates: [latitude, longitude],
    currentZone: geoResult.currentZone,
    sosActive: isSos,
    previousIncidents: tourist.previousIncidents || (geoResult.currentZone === 'DANGER' ? 1 : 0),
  });

  const updatedTourist = store.updateTourist(touristId, {
    coordinates: [latitude, longitude],
    currentZone: geoResult.currentZone,
    status: aiAnalysis.riskLevel === 'CRITICAL' ? 'CRITICAL' : geoResult.status,
    riskScore: aiAnalysis.riskScore,
    safetyMessage: geoResult.message,
    sosActive: isSos,
    aiAnalysis,
  });

  let createdIncident = null;

  // If entering DANGER zone and not already breach
  if (geoResult.isBreach && prevZone !== 'DANGER' && !isSos) {
    createdIncident = store.createIncident({
      touristId: tourist.id,
      touristName: tourist.name,
      type: 'GEO-FENCE BREACH',
      severity: 'HIGH',
      status: 'ACTIVE',
      zone: geoResult.zoneName,
      description: `⚠ GEO-FENCE BREACH: Tourist ${tourist.name} entered restricted hazard area [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]. AI Risk Score: ${aiAnalysis.riskScore}% (${aiAnalysis.riskLevel}).`,
      coordinates: [latitude, longitude],
      assignedUnit: 'Tourist Police Patrol 12',
      aiRecommendation: aiAnalysis.recommendation,
    });

    // Record immutable block in Tamper-Evident Audit Ledger
    auditLedger.addBlock('GEOFENCE_BREACH', tourist.id, {
      zone: geoResult.zoneName,
      coordinates: [latitude, longitude],
      riskScore: aiAnalysis.riskScore,
      riskLevel: aiAnalysis.riskLevel,
      incidentId: createdIncident.id,
    });

    broadcastIncidentCreated(createdIncident);
  }

  // Broadcast updates
  broadcastTouristUpdate(updatedTourist);
  broadcastKpiUpdate(store.getKpiStats());

  return {
    tourist: updatedTourist,
    geofence: geoResult,
    aiAnalysis,
    incident: createdIncident,
  };
}

/**
 * Handles SOS Panic activation with AI contextual analysis and audit ledger recording.
 */
export async function handleSosActivation(touristId) {
  const tourist = store.getTouristById(touristId);
  if (!tourist) {
    throw new Error(`Tourist ${touristId} not found`);
  }

  // Run AI Risk Engine for SOS
  const aiAnalysis = await getAiRiskScore({
    touristId: tourist.id,
    coordinates: tourist.coordinates,
    currentZone: 'DANGER',
    sosActive: true,
    sosSignal: 1,
  });

  const updatedTourist = store.updateTourist(touristId, {
    status: 'CRITICAL',
    riskScore: 100,
    sosActive: true,
    safetyMessage: '🚨 SOS ACTIVATED: Immediate response required.',
    aiAnalysis,
  });

  const incidentId = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const sosIncident = store.createIncident({
    id: incidentId,
    touristId: tourist.id,
    touristName: tourist.name,
    type: 'SOS_ACTIVATED',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    zone: tourist.currentZone === 'DANGER' ? 'Restricted High-Tide Rocky Shoals' : 'Sector 4 Emergency Grid',
    timestamp,
    description: `🚨 CRITICAL SOS ACTIVATED: Tourist ${tourist.name} triggered distress beacon. High precision GPS lock confirmed at [${tourist.coordinates[0].toFixed(4)}, ${tourist.coordinates[1].toFixed(4)}].`,
    coordinates: tourist.coordinates,
    assignedUnit: 'Rapid Medical Ambulance QRF 03',
    aiRecommendation: aiAnalysis.recommendation,
  });

  // Record SOS event in Tamper-Evident Audit Ledger
  auditLedger.addBlock('SOS_ACTIVATED', tourist.id, {
    incidentId: sosIncident.id,
    coordinates: tourist.coordinates,
    riskScore: 100,
    severity: 'CRITICAL',
    assignedUnit: 'Rapid Medical Ambulance QRF 03',
  });

  const sosAlertPayload = {
    incidentId: sosIncident.id,
    touristName: tourist.name,
    touristId: tourist.id,
    location: `${sosIncident.zone} [${tourist.coordinates[0].toFixed(4)}, ${tourist.coordinates[1].toFixed(4)}]`,
    coordinates: tourist.coordinates,
    risk: 100,
    time: timestamp,
    severity: 'CRITICAL',
    status: 'ACTIVE',
    message: '🚨 CRITICAL SOS ALERT: Immediate QRF mobilization required.',
    aiAnalysis,
  };

  // Broadcast events
  broadcastSosAlert(sosAlertPayload);
  broadcastIncidentCreated(sosIncident);
  broadcastTouristUpdate(updatedTourist);
  broadcastKpiUpdate(store.getKpiStats());

  return {
    tourist: updatedTourist,
    incident: sosIncident,
    sosAlert: sosAlertPayload,
    aiAnalysis,
  };
}

/**
 * Updates Incident Status & Assigns Responders
 */
export function handleIncidentUpdate(incidentId, updates) {
  const updatedIncident = store.updateIncident(incidentId, updates);
  if (!updatedIncident) {
    throw new Error(`Incident ${incidentId} not found`);
  }

  if (updates.assignedUnit) {
    store.updateResponder(updates.assignedUnit, { status: 'DISPATCHED' });
  }

  // Record status change in Tamper-Evident Audit Ledger
  auditLedger.addBlock('INCIDENT_CREATED', updatedIncident.touristId, {
    incidentId: updatedIncident.id,
    action: `STATUS_CHANGE_${updates.status || 'UPDATED'}`,
    assignedUnit: updates.assignedUnit || updatedIncident.assignedUnit,
  });

  broadcastIncidentUpdated(updatedIncident);
  broadcastKpiUpdate(store.getKpiStats());

  return updatedIncident;
}
