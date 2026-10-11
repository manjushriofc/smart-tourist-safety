import crypto from 'crypto';

/**
 * Deterministic JSON stringifier to ensure consistent hashing across platforms.
 */
export function canonicalJsonStringify(obj) {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalJsonStringify).join(',') + ']';
  }

  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map(key => `"${key}":${canonicalJsonStringify(obj[key])}`);
  return '{' + pairs.join(',') + '}';
}

/**
 * Computes a standard SHA-256 hex digest.
 */
export function sha256(data) {
  const content = typeof data === 'string' ? data : canonicalJsonStringify(data);
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}
