const API_BASE_URL = 'http://localhost:5000/api';

export interface LocationUpdatePayload {
  touristId?: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
}

export interface IncidentCreatePayload {
  touristId: string;
  touristName: string;
  type: string;
  severity: string;
  zone: string;
  description: string;
  coordinates?: [number, number];
  assignedUnit?: string;
}

export interface IncidentUpdatePayload {
  status?: 'ACTIVE' | 'ACKNOWLEDGED' | 'DISPATCHED' | 'RESOLVED';
  assignedUnit?: string;
  updatedBy?: string;
  notes?: string;
}

export interface AiRiskRequestPayload {
  touristId?: string;
  coordinates?: [number, number];
  currentZone?: string;
  sosActive?: boolean;
  previousIncidents?: number;
  movementAnomaly?: number;
  timeRisk?: number;
  distanceRisk?: number;
}

// REST API Methods
export const api = {
  // --- Auth APIs ---
  async loginTourist(identifier: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/tourist/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login');
    return data;
  },

  async registerTourist(payload: {
    name: string;
    email: string;
    phone: string;
    nationality?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    bloodGroup?: string;
    password: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/auth/tourist/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register');
    return data;
  },

  async loginAdmin(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to authenticate admin');
    return data;
  },

  async getTouristHistory(touristId: string) {
    const res = await fetch(`${API_BASE_URL}/tourists/${touristId}/history`);
    if (!res.ok) throw new Error('Failed to fetch safety history');
    return res.json();
  },

  async getTouristById(touristId: string) {
    const res = await fetch(`${API_BASE_URL}/tourists/${touristId}`);
    if (!res.ok) throw new Error('Failed to fetch tourist details');
    return res.json();
  },

  // --- Tourists ---
  async getTourists() {
    const res = await fetch(`${API_BASE_URL}/tourists`);
    if (!res.ok) throw new Error('Failed to fetch tourists');
    return res.json();
  },

  // --- Zones ---
  async getZones() {
    const res = await fetch(`${API_BASE_URL}/zones`);
    if (!res.ok) throw new Error('Failed to fetch zones');
    return res.json();
  },

  // --- Geofence check ---
  async checkGeofence(latitude: number, longitude: number) {
    const res = await fetch(`${API_BASE_URL}/geofence/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude, longitude }),
    });
    if (!res.ok) throw new Error('Failed to check geofence');
    return res.json();
  },

  // --- Update Location ---
  async updateLocation(payload: LocationUpdatePayload) {
    const res = await fetch(`${API_BASE_URL}/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update location');
    return res.json();
  },

  // --- Incidents ---
  async getIncidents(params?: { status?: string; severity?: string; touristId?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE_URL}/incidents${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  async createIncident(payload: IncidentCreatePayload) {
    const res = await fetch(`${API_BASE_URL}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create incident');
    return res.json();
  },

  async updateIncident(id: string, payload: IncidentUpdatePayload) {
    const res = await fetch(`${API_BASE_URL}/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to update incident ${id}`);
    return res.json();
  },

  // --- AI Contextual Safety Risk Engine ---
  async getAiRiskScore(payload: AiRiskRequestPayload) {
    const res = await fetch(`${API_BASE_URL}/ai/risk-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to calculate AI risk score');
    return res.json();
  },

  // --- Digital ID SHA-256 Engine ---
  async generateDigitalId(touristData: any) {
    const res = await fetch(`${API_BASE_URL}/digital-id/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(touristData),
    });
    if (!res.ok) throw new Error('Failed to generate Digital ID hash');
    return res.json();
  },

  async verifyDigitalId(touristData: any, hash?: string) {
    const res = await fetch(`${API_BASE_URL}/digital-id/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ touristData, hash }),
    });
    if (!res.ok) throw new Error('Failed to verify Digital ID');
    return res.json();
  },

  // --- Tamper-Evident Audit Ledger ---
  async getLedger() {
    const res = await fetch(`${API_BASE_URL}/ledger`);
    if (!res.ok) throw new Error('Failed to fetch audit ledger');
    return res.json();
  },

  async verifyLedger() {
    const res = await fetch(`${API_BASE_URL}/ledger/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to verify audit ledger chain');
    return res.json();
  },

  async tamperLedger(blockIndex = 2) {
    const res = await fetch(`${API_BASE_URL}/ledger/tamper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blockIndex }),
    });
    if (!res.ok) throw new Error('Failed to simulate tampering');
    return res.json();
  },

  async resetLedger() {
    const res = await fetch(`${API_BASE_URL}/ledger/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to reset audit ledger');
    return res.json();
  },

  // --- Restricted Admin Test Controls ---
  async demoReset() {
    const res = await fetch(`${API_BASE_URL}/demo/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset demo');
    return res.json();
  },

  async demoSafe(touristId = 'ST-IND-2026-001') {
    const res = await fetch(`${API_BASE_URL}/demo/safe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ touristId }),
    });
    if (!res.ok) throw new Error('Failed to trigger demo safe');
    return res.json();
  },

  async demoWarning(touristId = 'ST-IND-2026-001') {
    const res = await fetch(`${API_BASE_URL}/demo/warning`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ touristId }),
    });
    if (!res.ok) throw new Error('Failed to trigger demo warning');
    return res.json();
  },

  async demoDanger(touristId = 'ST-IND-2026-001') {
    const res = await fetch(`${API_BASE_URL}/demo/danger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ touristId }),
    });
    if (!res.ok) throw new Error('Failed to trigger demo danger');
    return res.json();
  },

  async demoSos(touristId = 'ST-IND-2026-001') {
    const res = await fetch(`${API_BASE_URL}/demo/sos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ touristId }),
    });
    if (!res.ok) throw new Error('Failed to trigger demo SOS');
    return res.json();
  },
};
