import express from 'express';
import { generateDigitalIdHash, verifyDigitalId } from '../services/digitalIdService.js';
import { auditLedger } from '../services/auditLedgerService.js';

const router = express.Router();

// POST /api/digital-id/generate - Generate SHA-256 hash for Digital Tourist ID
router.post('/generate', (req, res) => {
  try {
    const touristData = req.body || {};
    const result = generateDigitalIdHash(touristData);

    // Record issuance in the tamper-evident audit ledger
    auditLedger.addBlock('DIGITAL_ID_CREATED', result.touristId, {
      action: 'GENERATED_HASH',
      hash: result.hash,
      documentId: result.canonicalData.idNumber,
      touristName: result.canonicalData.name,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/digital-id/verify - Verify identity data against SHA-256 hash
router.post('/verify', (req, res) => {
  try {
    const { touristData, hash, idNumber, bloodGroup, name, nationality } = req.body;

    const targetData = touristData || req.body;
    const targetHash = hash || req.body.providedHash || targetData.hash;

    const verification = verifyDigitalId(targetData, targetHash);

    res.json({
      success: true,
      status: verification.status, // "VALID" or "INVALID"
      data: verification,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
