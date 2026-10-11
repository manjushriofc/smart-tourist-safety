import { sha256, canonicalJsonStringify } from './cryptoService.js';
import { store } from '../data/inMemoryStore.js';

/**
 * Extracts standard canonical identity fields for hashing
 */
export function extractCanonicalIdentity(touristData) {
  const digitalId = touristData.digitalId || {};
  return {
    touristId: touristData.id || touristData.touristId || 'ST-IND-2026-001',
    name: touristData.name || 'Ananya Sharma',
    nationality: touristData.nationality || 'Indian',
    idNumber: digitalId.idNumber || touristData.idNumber || 'IN-DL-8829-4412-X',
    bloodGroup: digitalId.bloodGroup || touristData.bloodGroup || 'O+',
    issuer: digitalId.issuer || touristData.issuer || 'Ministry of Tourism & Civil Safety Division',
    issueDate: digitalId.issueDate || touristData.issueDate || '2026-01-15',
    expiryDate: digitalId.expiryDate || touristData.expiryDate || '2026-12-31',
    emergencyContactName: digitalId.emergencyContactName || touristData.emergencyContactName || 'Rajesh Sharma',
    emergencyContactPhone: digitalId.emergencyContactPhone || touristData.emergencyContactPhone || '+91 98112 34567',
    travelInsurancePolicy: digitalId.travelInsurancePolicy || touristData.travelInsurancePolicy || 'TIC-IND-2026-992144',
  };
}

/**
 * Generates deterministic SHA-256 hash for Digital Tourist ID
 */
export function generateDigitalIdHash(touristData) {
  const canonicalData = extractCanonicalIdentity(touristData);
  const hash = sha256(canonicalData);

  return {
    touristId: canonicalData.touristId,
    canonicalData,
    hash: `0x${hash}`,
    algorithm: 'SHA-256 (Deterministic Canonical Serialization)',
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Verifies digital ID data against provided cryptographic hash
 * Returns status: "VALID" or "INVALID"
 */
export function verifyDigitalId(touristData, providedHash) {
  if (!providedHash) {
    return {
      status: 'INVALID',
      match: false,
      reason: 'No cryptographic hash provided for verification',
      computedHash: null,
      providedHash: null,
    };
  }

  const canonicalData = extractCanonicalIdentity(touristData);
  const rawComputed = sha256(canonicalData);
  const computedHashWithPrefix = `0x${rawComputed}`;

  const cleanProvided = providedHash.trim().toLowerCase();
  const cleanComputed = computedHashWithPrefix.toLowerCase();
  const cleanComputedRaw = `0x${rawComputed}`.toLowerCase();

  const isMatch = cleanProvided === cleanComputed || cleanProvided === rawComputed.toLowerCase();

  if (isMatch) {
    return {
      status: 'VALID',
      match: true,
      message: '✓ Cryptographic hash matches identity record perfectly.',
      computedHash: computedHashWithPrefix,
      providedHash,
      canonicalData,
    };
  } else {
    return {
      status: 'INVALID',
      match: false,
      message: '✗ SHA-256 Signature Mismatch: Record data has been tampered with or modified.',
      computedHash: computedHashWithPrefix,
      providedHash,
      canonicalData,
    };
  }
}
