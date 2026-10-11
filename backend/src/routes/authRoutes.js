import express from 'express';
import { store } from '../data/inMemoryStore.js';
import { auditLedger } from '../services/auditLedgerService.js';

const router = express.Router();

// Helper token generator
const generateToken = (userId, role) => `st_tok_${role}_${userId}_${Date.now()}`;

// POST /api/auth/tourist/login
router.post('/tourist/login', (req, res) => {
  try {
    const { identifier, email, touristId, password } = req.body;
    const loginId = identifier || email || touristId;

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your Tourist ID or Email and Password.',
      });
    }

    const user = store.findUserByCredentials(loginId, password, 'tourist');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Tourist ID/Email or Password. Please try again.',
      });
    }

    const tourist = store.getTouristById(user.touristId);
    const token = generateToken(user.id, 'tourist');

    res.json({
      success: true,
      message: 'Tourist authenticated successfully.',
      token,
      user: {
        id: user.id,
        touristId: user.touristId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      tourist,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/tourist/register
router.post('/tourist/register', (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      nationality,
      emergencyContactName,
      emergencyContactPhone,
      bloodGroup,
      password,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (Name, Email, Phone, Password).',
      });
    }

    const { user, tourist } = store.registerTourist({
      name,
      email,
      phone,
      nationality,
      emergencyContactName,
      emergencyContactPhone,
      bloodGroup,
      password,
    });

    // Record registration in Tamper-Evident Audit Ledger
    auditLedger.addBlock('TOURIST_REGISTERED', tourist.id, {
      action: 'TOURIST_ONBOARDING',
      name: tourist.name,
      email: tourist.email,
      documentId: tourist.digitalId.idNumber,
    });

    // Record digital ID creation in Audit Ledger
    auditLedger.addBlock('DIGITAL_ID_CREATED', tourist.id, {
      action: 'ISSUED_CANONICAL_HASH',
      hash: tourist.digitalId.cryptographicSignature,
      documentId: tourist.digitalId.idNumber,
      issuer: tourist.digitalId.issuer,
    });

    const token = generateToken(user.id, 'tourist');

    res.status(201).json({
      success: true,
      message: 'Safety profile and Digital ID registered successfully.',
      token,
      user: {
        id: user.id,
        touristId: user.touristId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      tourist,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/auth/admin/login
router.post('/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Admin Email and Password.',
      });
    }

    const user = store.findUserByCredentials(email, password, 'admin');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator credentials. Access restricted.',
      });
    }

    const token = generateToken(user.id, 'admin');

    res.json({
      success: true,
      message: 'Command Center Administrator authenticated.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Authorization header missing' });
    }

    // Return primary tourist for demo if valid header
    const primaryTourist = store.getTouristById('ST-IND-2026-001');
    res.json({
      success: true,
      tourist: primaryTourist,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
