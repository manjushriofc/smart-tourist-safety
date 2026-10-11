import { store } from '../data/inMemoryStore.js';

/**
 * Point-in-Polygon (Ray-Casting Algorithm)
 * Determines if point [lat, lng] is inside a polygon defined by an array of [lat, lng] vertices.
 */
export function isPointInPolygon(point, polygon) {
  const [lat, lng] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];

    const intersect = ((yi > lng) !== (yj > lng)) &&
      (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Evaluates coordinates against all registered safety zones.
 * Checks DANGER zone first, then WARNING zone, then SAFE zone.
 */
export function checkGeofence(latitude, longitude) {
  const point = [latitude, longitude];
  const zones = store.getZones();

  const dangerZone = zones.find(z => z.type === 'DANGER');
  const warningZone = zones.find(z => z.type === 'WARNING');
  const safeZone = zones.find(z => z.type === 'SAFE');

  // Check Danger Zone First
  if (dangerZone && isPointInPolygon(point, dangerZone.coordinates)) {
    return {
      currentZone: 'DANGER',
      status: 'HIGH RISK',
      riskScore: 84,
      isBreach: true,
      zoneName: dangerZone.name,
      message: '⚠ GEO-FENCE BREACH: Tourist entered a restricted area.',
      zoneId: dangerZone.id,
    };
  }

  // Check Warning Zone
  if (warningZone && isPointInPolygon(point, warningZone.coordinates)) {
    return {
      currentZone: 'WARNING',
      status: 'WARNING',
      riskScore: 48,
      isBreach: false,
      zoneName: warningZone.name,
      message: '⚠ Tourist approaching caution zone.',
      zoneId: warningZone.id,
    };
  }

  // Check Safe Zone
  if (safeZone && isPointInPolygon(point, safeZone.coordinates)) {
    return {
      currentZone: 'SAFE',
      status: 'SAFE',
      riskScore: 18,
      isBreach: false,
      zoneName: safeZone.name,
      message: '✓ Tourist is inside a safe zone.',
      zoneId: safeZone.id,
    };
  }

  // Default to buffer warning if outside defined bounds
  return {
    currentZone: 'WARNING',
    status: 'WARNING',
    riskScore: 50,
    isBreach: false,
    zoneName: 'Perimeter Buffer Zone',
    message: '⚠ Tourist is outside primary safe corridor.',
    zoneId: null,
  };
}
