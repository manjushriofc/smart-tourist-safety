import express from 'express';
import { store } from '../data/inMemoryStore.js';
import { checkGeofence } from '../services/geofenceService.js';

const router = express.Router();

// GET /api/zones - List all safety zones
router.get('/', (req, res) => {
  try {
    const zones = store.getZones();
    res.json({
      success: true,
      count: zones.length,
      data: zones,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/geofence/check - Evaluate coordinate against zones
router.post('/check', (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        error: 'latitude and longitude are required',
      });
    }

    const evaluation = checkGeofence(parseFloat(latitude), parseFloat(longitude));

    res.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
