import express from 'express';
import { auditLedger } from '../services/auditLedgerService.js';

const router = express.Router();

// GET /api/ledger - Retrieve all blocks in the tamper-evident audit ledger
router.get('/', (req, res) => {
  try {
    const chain = auditLedger.getChain();
    const verification = auditLedger.verifyChain();

    res.json({
      success: true,
      title: 'Tamper-Evident Audit Ledger',
      blockCount: chain.length,
      verification,
      data: chain,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/ledger/verify - Cryptographically verify entire chain
router.post('/verify', (req, res) => {
  try {
    const verification = auditLedger.verifyChain();
    res.json({
      success: true,
      data: verification,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/ledger/tamper - Simulate tampering on a block to demonstrate detection
router.post('/tamper', (req, res) => {
  try {
    const { blockIndex = 2, modifiedFields } = req.body;
    const result = auditLedger.tamperDemo(blockIndex, modifiedFields);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/ledger/reset - Reset ledger to canonical verified baseline
router.post('/reset', (req, res) => {
  try {
    const result = auditLedger.resetLedger();
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
