import express from 'express';
import { store } from '../data/inMemoryStore.js';
import { handleLocationUpdate } from '../services/incidentService.js';

const router = express.Router();

// GET /api/tourists - List all tourists
router.get('/', (req, res) => {
  try {
    const tourists = store.getTourists();
    res.json({
      success: true,
      count: tourists.length,
      data: tourists,
      kpi: store.getKpiStats(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/tourists/:id - Get tourist by ID
router.get('/:id', (req, res) => {
  try {
    const tourist = store.getTouristById(req.params.id);
    if (!tourist) {
      return res.status(404).json({ success: false, error: 'Tourist not found' });
    }
    const history = store.getTouristHistory(req.params.id);
    res.json({
      success: true,
      data: {
        ...tourist,
        history,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/tourists/:id/history - Get safety history for a tourist
router.get('/:id/history', (req, res) => {
  try {
    const history = store.getTouristHistory(req.params.id);
    res.json({
      success: true,
      touristId: req.params.id,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/locations - Update tourist GPS coordinates (real browser or hardware telemetry)
router.post('/locations', async (req, res) => {
  try {
    const { touristId = 'ST-IND-2026-001', latitude, longitude, accuracy, timestamp } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        error: 'latitude and longitude are required',
      });
    }

    const result = await handleLocationUpdate(touristId, parseFloat(latitude), parseFloat(longitude));

    // Update accuracy if provided
    if (accuracy) {
      store.updateTourist(touristId, { accuracy: Math.round(accuracy) });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
