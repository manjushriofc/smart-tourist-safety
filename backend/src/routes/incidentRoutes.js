import express from 'express';
import { store } from '../data/inMemoryStore.js';
import { handleIncidentUpdate } from '../services/incidentService.js';
import { broadcastIncidentCreated } from '../services/socketService.js';

const router = express.Router();

// GET /api/incidents - List incidents with optional status/severity filters
router.get('/', (req, res) => {
  try {
    const { status, severity, touristId } = req.query;
    let incidents = store.getIncidents();

    if (status) {
      incidents = incidents.filter(i => i.status.toUpperCase() === status.toUpperCase());
    }
    if (severity) {
      incidents = incidents.filter(i => i.severity.toUpperCase() === severity.toUpperCase());
    }
    if (touristId) {
      incidents = incidents.filter(i => i.touristId === touristId);
    }

    res.json({
      success: true,
      count: incidents.length,
      data: incidents,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/incidents - Create a new incident
router.post('/', (req, res) => {
  try {
    const {
      touristId = 'ST-IND-2026-001',
      touristName = 'Ananya Sharma',
      type = 'GEO-FENCE BREACH',
      severity = 'HIGH',
      zone = 'Restricted Hazard Zone',
      description,
      coordinates = [15.5080, 73.8500],
      assignedUnit,
    } = req.body;

    if (!description) {
      return res.status(400).json({ success: false, error: 'description is required' });
    }

    const newIncident = store.createIncident({
      touristId,
      touristName,
      type,
      severity,
      zone,
      description,
      coordinates,
      assignedUnit: assignedUnit || 'Tourist Police Patrol 12',
      status: 'ACTIVE',
    });

    broadcastIncidentCreated(newIncident);

    res.status(201).json({
      success: true,
      data: newIncident,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/incidents/:id - Update incident status (ACTIVE, ACKNOWLEDGED, DISPATCHED, RESOLVED)
router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedUnit, updatedBy, notes } = req.body;

    const allowedStatuses = ['ACTIVE', 'ACKNOWLEDGED', 'DISPATCHED', 'RESOLVED'];
    if (status && !allowedStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const updates = {};
    if (status) updates.status = status.toUpperCase();
    if (assignedUnit) updates.assignedUnit = assignedUnit;
    if (updatedBy) updates.updatedBy = updatedBy;
    if (notes) updates.notes = notes;

    const updatedIncident = handleIncidentUpdate(id, updates);

    res.json({
      success: true,
      data: updatedIncident,
    });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

export default router;
