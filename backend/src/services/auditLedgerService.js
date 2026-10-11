import { sha256, canonicalJsonStringify } from './cryptoService.js';

const GENESIS_PREV_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

class AuditLedgerService {
  constructor() {
    this.chain = [];
    this.initBaselineChain();
  }

  /**
   * Computes the SHA-256 hash of a block header and linkage
   */
  computeBlockHash(index, timestamp, type, touristId, dataHash, previousHash) {
    const rawString = `${index}:${timestamp}:${type}:${touristId}:${dataHash}:${previousHash}`;
    return `0x${sha256(rawString)}`;
  }

  /**
   * Initializes the canonical baseline chain with initial system events
   */
  initBaselineChain() {
    this.chain = [];

    // Block #0: Genesis
    const genesisTime = '2026-08-27 08:00:00 UTC';
    const genesisData = { message: 'Smart Tourist Safety Command Center Audit Ledger Genesis' };
    const genesisDataHash = `0x${sha256(genesisData)}`;
    const genesisHash = this.computeBlockHash(0, genesisTime, 'GENESIS', 'SYSTEM', genesisDataHash, GENESIS_PREV_HASH);

    this.chain.push({
      index: 0,
      timestamp: genesisTime,
      type: 'GENESIS',
      touristId: 'SYSTEM',
      data: genesisData,
      dataHash: genesisDataHash,
      previousHash: GENESIS_PREV_HASH,
      hash: genesisHash,
      tampered: false,
    });

    // Block #1: DIGITAL_ID_CREATED for Ananya Sharma
    this.addBlock('DIGITAL_ID_CREATED', 'ST-IND-2026-001', {
      action: 'ISSUANCE',
      documentId: 'IN-DL-8829-4412-X',
      touristName: 'Ananya Sharma',
      issuer: 'Ministry of Tourism & Civil Safety Division',
      status: 'VERIFIED',
    }, '2026-08-27 08:15:22 UTC');

    // Block #2: GEOFENCE_BREACH logged event
    this.addBlock('GEOFENCE_BREACH', 'ST-IND-2026-001', {
      zone: 'Restricted Tidal Basin',
      coordinates: [15.5080, 73.8500],
      riskScore: 84,
      severity: 'HIGH',
      assignedUnit: 'Tourist Police Patrol 12',
    }, '2026-08-27 09:30:10 UTC');

    // Block #3: INCIDENT_CREATED
    this.addBlock('INCIDENT_CREATED', 'ST-IND-2026-001', {
      incidentId: 'INC-2026-001',
      type: 'GEO-FENCE BREACH',
      severity: 'HIGH',
      action: 'DISPATCH_COMMENCED',
    }, '2026-08-27 09:31:05 UTC');
  }

  /**
   * Appends a new immutable block to the chain
   */
  addBlock(type, touristId, data, customTimestamp = null) {
    const index = this.chain.length;
    const timestamp = customTimestamp || new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const previousBlock = this.chain[this.chain.length - 1];
    const previousHash = previousBlock ? previousBlock.hash : GENESIS_PREV_HASH;

    const dataHash = `0x${sha256(data)}`;
    const hash = this.computeBlockHash(index, timestamp, type, touristId, dataHash, previousHash);

    const block = {
      index,
      timestamp,
      type,
      touristId,
      data,
      dataHash,
      previousHash,
      hash,
      tampered: false,
    };

    this.chain.push(block);
    return block;
  }

  /**
   * Verifies the cryptographic integrity of a single record
   */
  verifyRecord(index) {
    const block = this.chain[index];
    if (!block) return { valid: false, error: 'Block not found' };

    const expectedDataHash = `0x${sha256(block.data)}`;
    const isDataValid = expectedDataHash === block.dataHash;

    const expectedHash = this.computeBlockHash(
      block.index,
      block.timestamp,
      block.type,
      block.touristId,
      block.dataHash,
      block.previousHash
    );
    const isHashValid = expectedHash === block.hash;

    const prevBlock = index > 0 ? this.chain[index - 1] : null;
    const isLinkValid = index === 0 ? block.previousHash === GENESIS_PREV_HASH : block.previousHash === prevBlock.hash;

    const valid = isDataValid && isHashValid && isLinkValid && !block.tampered;

    return {
      valid,
      index,
      isDataValid,
      isHashValid,
      isLinkValid,
      expectedHash,
      actualHash: block.hash,
    };
  }

  /**
   * Verifies the entire cryptographic chained ledger
   */
  verifyChain() {
    for (let i = 0; i < this.chain.length; i++) {
      const recordVerification = this.verifyRecord(i);
      if (!recordVerification.valid) {
        return {
          valid: false,
          brokenBlockIndex: i,
          message: `✗ CHAIN INTEGRITY FAILED: Cryptographic mismatch detected at Block #${i} (${this.chain[i].type}). Linkage broken.`,
          details: recordVerification,
          chainLength: this.chain.length,
        };
      }
    }

    return {
      valid: true,
      brokenBlockIndex: null,
      message: '✓ CHAIN INTEGRITY VERIFIED: All block hashes and cryptographic linkage intact.',
      chainLength: this.chain.length,
    };
  }

  /**
   * Simulates unauthorized record tampering on a given block index
   */
  tamperDemo(targetIndex = 2, modifiedFields = null) {
    const index = Math.min(targetIndex, this.chain.length - 1);
    const block = this.chain[index];

    if (!block) return { success: false, error: 'Target block not found' };

    // Inject unauthorized modifications into the payload
    block.data = {
      ...block.data,
      riskScore: 10,
      severity: 'LOW (FORGED)',
      unauthorizedModification: 'TAMPERED: Hazard record suppressed by unauthorized agent.',
      modifiedAt: new Date().toISOString(),
      ...(modifiedFields || {}),
    };

    // Note: in a tamper attack, the payload changed but the block hash or parent hashes were forged/stale
    block.dataHash = `0x${sha256(block.data)}`;
    block.tampered = true;

    return {
      success: true,
      message: `Simulated tampering applied to Block #${index}. Block payload altered without valid chain re-signing.`,
      tamperedBlockIndex: index,
      tamperedBlock: block,
      verificationResult: this.verifyChain(),
    };
  }

  /**
   * Resets ledger to canonical baseline
   */
  resetLedger() {
    this.initBaselineChain();
    return {
      success: true,
      message: 'Audit ledger successfully restored to verified cryptographic baseline.',
      chain: this.chain,
      verificationResult: this.verifyChain(),
    };
  }

  /**
   * Retrieves the full chain
   */
  getChain() {
    return this.chain;
  }
}

export const auditLedger = new AuditLedgerService();
