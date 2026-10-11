import express from 'express';
import { store } from '../data/inMemoryStore.js';
import { handleLocationUpdate, handleSosActivation } from '../services/incidentService.js';
import { broadcastDemoReset } from '../services/socketService.js';

const router = express.Router();

// Simulated coordinates for demo locations
const DEMO_COORDS = {
  SAFE: [15.5005, 73.8260],
  WARNING: [15.5030, 73.8385],
  DANGER: [15.5080, 73.8500],
  SOS: [15.5110, 73.8520],
};

// POST /api/demo/reset - Reset demo to initial baseline
router.post('/reset', (req, res) => {
  try {
    store.reset();
    const payload = {
      tourists: store.getTourists(),
      incidents: store.getIncidents(),
      kpi: store.getKpiStats(),
    };
    broadcastDemoReset(payload);
    res.json({
      success: true,
      message: 'Demo state reset to baseline',
      data: payload,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/demo/safe - Set tourist to safe location
router.post('/safe', async (req, res) => {
  try {
    const touristId = req.body.touristId || 'ST-IND-2026-001';

    store.updateTourist(touristId, { sosActive: false });

    const [lat, lng] = DEMO_COORDS.SAFE;
    const result = await handleLocationUpdate(touristId, lat, lng);

    res.json({
      success: true,
      mode: 'SAFE',
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/demo/warning - Set tourist to warning location
router.post('/warning', async (req, res) => {
  try {
    const touristId = req.body.touristId || 'ST-IND-2026-001';

    store.updateTourist(touristId, { sosActive: false });

    const [lat, lng] = DEMO_COORDS.WARNING;
    const result = await handleLocationUpdate(touristId, lat, lng);

    res.json({
      success: true,
      mode: 'WARNING',
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/demo/danger - Set tourist to danger location (geofence breach)
router.post('/danger', async (req, res) => {
  try {
    const touristId = req.body.touristId || 'ST-IND-2026-001';

    store.updateTourist(touristId, { sosActive: false });

    const [lat, lng] = DEMO_COORDS.DANGER;
    const result = await handleLocationUpdate(touristId, lat, lng);

    res.json({
      success: true,
      mode: 'DANGER',
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/demo/sos - Trigger emergency SOS
router.post('/sos', async (req, res) => {
  try {
    const touristId = req.body.touristId || 'ST-IND-2026-001';

    const [lat, lng] = DEMO_COORDS.SOS;
    store.updateTourist(touristId, { coordinates: [lat, lng], currentZone: 'DANGER' });

    const result = await handleSosActivation(touristId);

    res.json({
      success: true,
      mode: 'SOS',
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
