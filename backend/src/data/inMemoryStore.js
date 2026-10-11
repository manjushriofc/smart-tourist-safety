import { sha256 } from '../services/cryptoService.js';

class InMemoryStore {
  constructor() {
    this.reset();
  }

  reset() {
    // Registered user accounts (Tourists & Admins)
    this.users = [
      {
        id: 'usr-tourist-001',
        touristId: 'ST-IND-2026-001',
        name: 'Ananya Sharma',
        email: 'ananya@example.com',
        phone: '+91 98765 43210',
        role: 'tourist',
        password: 'password123', // Demo authentication
      },
      {
        id: 'usr-admin-001',
        name: 'Safety Operations Admin',
        email: 'admin@touristsafety.gov',
        phone: '+91 832 241900',
        role: 'admin',
        password: 'admin123', // Demo authentication
      },
    ];

    // Baseline Tourist Profiles
    this.tourists = [
      {
        id: 'ST-IND-2026-001',
        name: 'Ananya Sharma',
        nationality: 'Indian',
        phone: '+91 98765 43210',
        email: 'ananya@example.com',
        status: 'SAFE',
        riskScore: 18,
        currentZone: 'SAFE',
        coordinates: [15.5005, 73.8260],
        accuracy: 12,
        lastPing: new Date().toLocaleTimeString(),
        isPrimaryDemo: true,
        sosActive: false,
        batteryLevel: 94,
        safetyMessage: 'Tourist is inside a safe zone.',
        digitalId: {
          idNumber: 'IN-DL-8829-4412-X',
          issueDate: '2026-01-15',
          expiryDate: '2026-12-31',
          issuer: 'Ministry of Tourism & Civil Safety Division',
          kycVerified: true,
          biometricStatus: 'VERIFIED',
          bloodGroup: 'O+',
          emergencyContactName: 'Rajesh Sharma',
          emergencyContactRelation: 'Father',
          emergencyContactPhone: '+91 98112 34567',
          cryptographicSignature: '0xb9edbb1abe78500c8aeb12ec1c3c37bc1482ec93c999b1b77188fe837bc54eca',
          travelInsurancePolicy: 'TIC-IND-2026-992144',
          hotelAccommodation: 'Grand Avalon Coastal Resort & Spa',
        },
        aiAnalysis: {
          riskScore: 18,
          riskLevel: 'LOW',
          engine: 'Python Scikit-Learn Contextual Ensemble v2.4',
          features: {
            locationRisk: 15.0,
            zoneRisk: 12.0,
            movementAnomaly: 10.0,
            timeRisk: 40.0,
            previousIncidents: 0,
            distanceRisk: 15.0,
            sosSignal: 0,
          },
          factors: [
            {
              factor: 'Safe Corridor Compliance',
              impact: 65,
              description: 'Tourist is fully compliant within verified CCTV & Police patrol zone.',
            },
            {
              factor: 'Safe Haven Proximity',
              impact: 25,
              description: 'Less than 150m from Heritage Promenade Tourist Police Post A.',
            },
          ],
          recommendation: '✓ NOMINAL: Continue routine telemetry monitoring. No operational intervention required.',
        },
      },
      {
        id: 'ST-GBR-2026-042',
        name: 'James Wilson',
        nationality: 'British',
        phone: '+44 7700 900123',
        email: 'james.wilson@example.co.uk',
        status: 'SAFE',
        riskScore: 22,
        currentZone: 'SAFE',
        coordinates: [15.4980, 73.8240],
        accuracy: 15,
        lastPing: new Date().toLocaleTimeString(),
        isPrimaryDemo: false,
        sosActive: false,
        batteryLevel: 82,
        safetyMessage: 'Tourist is inside a safe zone.',
        digitalId: {
          idNumber: 'GB-LON-9941-201',
          issueDate: '2026-02-01',
          expiryDate: '2026-08-30',
          issuer: 'Civil Safety & Foreign Visitor Bureau',
          kycVerified: true,
          biometricStatus: 'VERIFIED',
          bloodGroup: 'A+',
          emergencyContactName: 'Emma Wilson',
          emergencyContactRelation: 'Spouse',
          emergencyContactPhone: '+44 7700 900456',
          cryptographicSignature: '0xa41b72e90c88411d9f4302cba8104473de01f7823901bce41189ac331902bb31',
          travelInsurancePolicy: 'UK-AXA-2026-4401',
          hotelAccommodation: 'Sea Breeze Heritage Inn',
        },
      },
      {
        id: 'ST-DEU-2026-088',
        name: 'Elena Rostova',
        nationality: 'German',
        phone: '+49 151 23456789',
        email: 'elena.rostova@example.de',
        status: 'SAFE',
        riskScore: 20,
        currentZone: 'SAFE',
        coordinates: [15.5020, 73.8285],
        accuracy: 10,
        lastPing: new Date().toLocaleTimeString(),
        isPrimaryDemo: false,
        sosActive: false,
        batteryLevel: 67,
        safetyMessage: 'Tourist is inside a safe zone.',
        digitalId: {
          idNumber: 'DE-BER-4412-881',
          issueDate: '2026-01-20',
          expiryDate: '2026-11-15',
          issuer: 'Civil Safety & Foreign Visitor Bureau',
          kycVerified: true,
          biometricStatus: 'VERIFIED',
          bloodGroup: 'B+',
          emergencyContactName: 'Klaus Rostova',
          emergencyContactRelation: 'Brother',
          emergencyContactPhone: '+49 151 98765432',
          travelInsurancePolicy: 'ALLIANZ-GLOBAL-99120',
          hotelAccommodation: 'Azure Bay Boutique Hotel',
          cryptographicSignature: '0x8e92f1b098231c44ba7120deac55201991823abce4110823cba9912781440192',
        },
      },
    ];

    // Safety History Records
    this.safetyHistory = {
      'ST-IND-2026-001': [
        {
          id: 'HIST-001',
          date: '27 Aug 2026',
          time: '08:15 AM',
          event: 'Safety profile registered & verified',
          zone: 'Heritage Safe Zone',
          risk: 15,
          status: 'SAFE',
          details: 'Digital ID pass generated and cryptographically sealed.',
        },
        {
          id: 'HIST-002',
          date: '27 Aug 2026',
          time: '10:30 AM',
          event: 'Location telemetry monitoring active',
          zone: 'Heritage Promenade',
          risk: 18,
          status: 'SAFE',
          details: 'Standard GPS lock confirmed with 12m accuracy.',
        },
      ],
    };

    // Safety Zones
    this.zones = [
      {
        id: 'ZONE-SAFE-01',
        name: 'Heritage Promenade Safe Corridor',
        type: 'SAFE',
        description: 'Designated high-density tourist walking zone with 24/7 CCTV surveillance and active police kiosks.',
        coordinates: [
          [15.4950, 73.8200],
          [15.5040, 73.8200],
          [15.5040, 73.8320],
          [15.4950, 73.8320],
        ],
        fillColor: '#10b981',
        borderColor: '#059669',
        speedLimit: 'Pedestrian Only',
        patrolUnit: 'Tourist Police Patrol 08',
      },
      {
        id: 'ZONE-WARN-02',
        name: 'Coastal Cliff Buffer Zone',
        type: 'WARNING',
        description: 'Intermediate perimeter near uneven rocky terrain and unlit evening paths. Caution advised.',
        coordinates: [
          [15.5020, 73.8320],
          [15.5070, 73.8320],
          [15.5070, 73.8450],
          [15.5020, 73.8450],
        ],
        fillColor: '#f59e0b',
        borderColor: '#d97706',
        speedLimit: '15 km/h',
        patrolUnit: 'Tourist Police Patrol 12',
      },
      {
        id: 'ZONE-DANG-03',
        name: 'Restricted High-Tide Surge & Shoals',
        type: 'DANGER',
        description: 'Restricted hazard area prone to rapid tidal surges, submerged rocks, and sudden undertow currents.',
        coordinates: [
          [15.5060, 73.8450],
          [15.5180, 73.8450],
          [15.5180, 73.8600],
          [15.5060, 73.8600],
        ],
        fillColor: '#ef4444',
        borderColor: '#dc2626',
        speedLimit: 'No Entry Without Guide',
        patrolUnit: 'Coastal Rescue QRF 02',
      },
    ];

    // Incidents
    this.incidents = [
      {
        id: 'INC-2026-001',
        touristId: 'ST-IND-2026-001',
        touristName: 'Ananya Sharma',
        type: 'GEO-FENCE BREACH',
        severity: 'HIGH',
        status: 'ACTIVE',
        zone: 'Restricted Tidal Basin',
        timestamp: '2026-08-27 10:42:15',
        description: 'Tourist entered restricted tidal basin buffer without guide accompaniment.',
        coordinates: [15.5080, 73.8500],
        assignedUnit: 'Tourist Police Patrol 12',
        actionLog: [
          { time: '10:42:15', action: 'Incident created via automated geofence detection', agent: 'SYSTEM' },
        ],
      },
    ];

    // Emergency Responders
    this.responders = [
      {
        id: 'UNIT-POLICE-12',
        name: 'Tourist Police Patrol 12',
        type: 'POLICE',
        status: 'AVAILABLE',
        location: 'Heritage Gate Sector 2',
        eta: '3 mins',
        distance: '450m',
      },
      {
        id: 'UNIT-MED-03',
        name: 'Rapid Medical Ambulance QRF 03',
        type: 'MEDICAL',
        status: 'AVAILABLE',
        location: 'District Hospital Post',
        eta: '5 mins',
        distance: '900m',
      },
      {
        id: 'UNIT-COAST-02',
        name: 'Coastal Rescue Boat 02',
        type: 'COAST_GUARD',
        status: 'AVAILABLE',
        location: 'Fisherman Wharf Jetty',
        eta: '6 mins',
        distance: '1.2km',
      },
    ];
  }

  // --- User & Auth Methods ---
  findUserByCredentials(identifier, password, role) {
    return this.users.find(
      u =>
        (u.email.toLowerCase() === identifier.toLowerCase() ||
          (u.touristId && u.touristId.toLowerCase() === identifier.toLowerCase()) ||
          u.name.toLowerCase() === identifier.toLowerCase()) &&
        u.password === password &&
        (!role || u.role === role)
    );
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  registerTourist(userData) {
    const existing = this.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('A user with this email address already exists.');
    }

    const nextNumber = String(this.tourists.length + 1).padStart(3, '0');
    const touristId = `ST-IND-2026-${nextNumber}`;
    const userId = `usr-tourist-${nextNumber}`;

    // Canonical digital ID data
    const digitalIdData = {
      idNumber: `IN-DL-8829-${Math.floor(1000 + Math.random() * 9000)}-X`,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '2026-12-31',
      issuer: 'Ministry of Tourism & Civil Safety Division',
      kycVerified: true,
      biometricStatus: 'VERIFIED',
      bloodGroup: userData.bloodGroup || 'O+',
      emergencyContactName: userData.emergencyContactName || 'Emergency Contact',
      emergencyContactRelation: 'Next of Kin',
      emergencyContactPhone: userData.emergencyContactPhone || userData.phone,
      travelInsurancePolicy: `TIC-IND-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      hotelAccommodation: userData.hotelAccommodation || 'Avalon City Hotel',
    };

    const hashString = sha256({
      touristId,
      name: userData.name,
      nationality: userData.nationality || 'Indian',
      ...digitalIdData,
    });
    digitalIdData.cryptographicSignature = `0x${hashString}`;

    const newTourist = {
      id: touristId,
      name: userData.name,
      nationality: userData.nationality || 'Indian',
      phone: userData.phone,
      email: userData.email,
      status: 'SAFE',
      riskScore: 18,
      currentZone: 'SAFE',
      coordinates: [15.5005, 73.8260],
      accuracy: 10,
      lastPing: new Date().toLocaleTimeString(),
      isPrimaryDemo: false,
      sosActive: false,
      batteryLevel: 100,
      safetyMessage: 'Safety monitoring active. Inside safe zone.',
      digitalId: digitalIdData,
    };

    const newUser = {
      id: userId,
      touristId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: 'tourist',
      password: userData.password,
    };

    this.users.push(newUser);
    this.tourists.push(newTourist);

    // Add initial history entry
    this.safetyHistory[touristId] = [
      {
        id: `HIST-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: 'Safety profile registered & verified',
        zone: 'Heritage Safe Zone',
        risk: 18,
        status: 'SAFE',
        details: 'Account created with verifiable SHA-256 Digital ID.',
      },
    ];

    return { user: newUser, tourist: newTourist };
  }

  // --- Tourist History Methods ---
  getTouristHistory(touristId) {
    return this.safetyHistory[touristId] || [];
  }

  addTouristHistory(touristId, entry) {
    if (!this.safetyHistory[touristId]) {
      this.safetyHistory[touristId] = [];
    }
    const historyItem = {
      id: `HIST-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...entry,
    };
    this.safetyHistory[touristId].unshift(historyItem);
    return historyItem;
  }

  // --- Tourist Methods ---
  getTourists() {
    return this.tourists;
  }

  getTouristById(id) {
    return this.tourists.find(t => t.id === id);
  }

  updateTourist(id, updates) {
    const idx = this.tourists.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.tourists[idx] = {
      ...this.tourists[idx],
      ...updates,
      lastPing: updates.lastPing || new Date().toLocaleTimeString(),
    };
    return this.tourists[idx];
  }

  // --- Zone Methods ---
  getZones() {
    return this.zones;
  }

  // --- Incident Methods ---
  getIncidents(filters = {}) {
    let result = [...this.incidents];
    if (filters.status) {
      result = result.filter(i => i.status.toUpperCase() === filters.status.toUpperCase());
    }
    if (filters.severity) {
      result = result.filter(i => i.severity.toUpperCase() === filters.severity.toUpperCase());
    }
    if (filters.touristId) {
      result = result.filter(i => i.touristId === filters.touristId);
    }
    return result;
  }

  getIncidentById(id) {
    return this.incidents.find(i => i.id === id);
  }

  createIncident(incidentData) {
    const id = incidentData.id || `INC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const timestamp = incidentData.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newIncident = {
      id,
      timestamp,
      status: incidentData.status || 'ACTIVE',
      severity: incidentData.severity || 'MEDIUM',
      touristId: incidentData.touristId,
      touristName: incidentData.touristName,
      type: incidentData.type || 'SAFETY_ALERT',
      zone: incidentData.zone || 'Unknown Zone',
      description: incidentData.description || 'Automated safety incident report.',
      coordinates: incidentData.coordinates || [15.5005, 73.8260],
      assignedUnit: incidentData.assignedUnit || null,
      actionLog: [
        { time: timestamp.substring(11, 19), action: 'Incident created and logged in audit register', agent: 'SYSTEM' },
      ],
      aiRecommendation: incidentData.aiRecommendation || null,
    };

    this.incidents.unshift(newIncident);
    return newIncident;
  }

  updateIncident(id, updates) {
    const idx = this.incidents.findIndex(i => i.id === id);
    if (idx === -1) return null;

    const time = new Date().toLocaleTimeString();
    const actionDesc = updates.status
      ? `Status changed to ${updates.status}`
      : updates.assignedUnit
      ? `Assigned unit: ${updates.assignedUnit}`
      : 'Incident modified';

    const currentLog = this.incidents[idx].actionLog || [];
    const newLog = [
      ...currentLog,
      { time, action: actionDesc, agent: updates.updatedBy || 'OPERATOR-01' },
    ];

    this.incidents[idx] = {
      ...this.incidents[idx],
      ...updates,
      actionLog: newLog,
    };

    return this.incidents[idx];
  }

  // --- Responder Methods ---
  getResponders() {
    return this.responders;
  }

  updateResponder(nameOrId, updates) {
    const idx = this.responders.findIndex(r => r.id === nameOrId || r.name === nameOrId);
    if (idx === -1) return null;
    this.responders[idx] = { ...this.responders[idx], ...updates };
    return this.responders[idx];
  }

  // --- Dynamic KPI Calculation ---
  getKpiStats() {
    const safeCount = this.tourists.filter(t => t.status === 'SAFE').length;
    const warningCount = this.tourists.filter(t => t.status === 'WARNING').length;
    const highRiskCount = this.tourists.filter(t => t.status === 'HIGH RISK').length;
    const criticalCount = this.tourists.filter(t => t.status === 'CRITICAL' || t.sosActive).length;
    const activeIncidentsCount = this.incidents.filter(i => i.status !== 'RESOLVED').length;

    return {
      activeTourists: this.tourists.length,
      safe: safeCount,
      warning: warningCount,
      highRisk: highRiskCount,
      critical: criticalCount,
      systemStatus: criticalCount > 0 ? 'ELEVATED_ALERT' : 'ONLINE',
      activeIncidentsCount,
      avgResponseTimeMin: 2.4,
    };
  }
}

export const store = new InMemoryStore();
