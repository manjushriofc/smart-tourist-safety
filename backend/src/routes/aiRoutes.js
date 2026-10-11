import express from 'express';
import { getAiRiskScore } from '../services/aiService.js';

const router = express.Router();

// POST /api/ai/risk-score - Calculate explainable contextual safety-risk score
router.post('/risk-score', async (req, res) => {
  try {
    const telemetryData = req.body || {};
    const aiAnalysis = await getAiRiskScore(telemetryData);

    res.json({
      success: true,
      data: aiAnalysis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
