export type TouristStatus = 'SAFE' | 'WARNING' | 'HIGH RISK' | 'CRITICAL';

export type ZoneType = 'SAFE' | 'WARNING' | 'DANGER' | 'RESTRICTED';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'DISPATCHED' | 'RESOLVED' | 'OPEN' | 'INVESTIGATING';

export type UserRole = 'tourist' | 'admin';

export interface User {
  id: string;
  touristId?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}

export interface SafetyHistoryItem {
  id: string;
  date: string;
  time: string;
  event: string;
  zone: string;
  risk: number;
  status: TouristStatus;
  details?: string;
}

export interface AiRiskFactor {
  factor: string;
  impact: number;
  description: string;
}

export interface AiAnalysisDetails {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  engine: string;
  features?: {
    locationRisk: number;
    zoneRisk: number;
    movementAnomaly: number;
    timeRisk: number;
    previousIncidents: number;
    distanceRisk: number;
    sosSignal: number;
  };
  factors: AiRiskFactor[];
  recommendation: string;
}

export interface DigitalIdDetails {
  idNumber: string;
  issueDate: string;
  expiryDate: string;
  issuer: string;
  kycVerified: boolean;
  biometricStatus: 'VERIFIED' | 'PENDING' | 'EXEMPT';
  bloodGroup: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  cryptographicSignature: string;
  travelInsurancePolicy: string;
  hotelAccommodation: string;
}

export interface Tourist {
  id: string;
  name: string;
  nationality: string;
  phone: string;
  email?: string;
  status: TouristStatus;
  riskScore: number;
  currentZone: ZoneType;
  coordinates: [number, number];
  accuracy?: number;
  lastPing: string;
  isPrimaryDemo?: boolean;
  sosActive?: boolean;
  digitalId: DigitalIdDetails;
  batteryLevel: number;
  safetyMessage?: string;
  aiAnalysis?: AiAnalysisDetails;
}

export interface Incident {
  id: string;
  touristId: string;
  touristName: string;
  type: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  zone: string;
  timestamp: string;
  description: string;
  coordinates: [number, number];
  assignedUnit?: string;
  actionLog?: { time: string; action: string; agent: string }[];
  aiRecommendation?: string;
}

export interface SafetyZone {
  id: string;
  name: string;
  type: ZoneType;
  description: string;
  coordinates: [number, number][];
  fillColor: string;
  borderColor: string;
  speedLimit?: string;
  patrolUnit?: string;
}

export interface KPIStats {
  activeTourists: number;
  safe: number;
  warning: number;
  highRisk: number;
  critical: number;
  systemStatus: 'ONLINE' | 'STANDBY' | 'ELEVATED_ALERT';
  activeIncidentsCount: number;
  avgResponseTimeMin: number;
}

export interface ResponderUnit {
  id: string;
  name: string;
  type: 'POLICE' | 'MEDICAL' | 'COAST_GUARD' | 'RANGER';
  status: 'AVAILABLE' | 'DISPATCHED' | 'ON_SCENE';
  location: string;
  eta: string;
  distance: string;
}

export interface LedgerBlock {
  index: number;
  timestamp: string;
  type:
    | 'GENESIS'
    | 'TOURIST_REGISTERED'
    | 'DIGITAL_ID_CREATED'
    | 'LOCATION_ALERT'
    | 'GEOFENCE_BREACH'
    | 'SOS_ACTIVATED'
    | 'INCIDENT_CREATED'
    | 'INCIDENT_ACKNOWLEDGED'
    | 'INCIDENT_DISPATCHED'
    | 'INCIDENT_RESOLVED';
  touristId: string;
  data: Record<string, any>;
  dataHash: string;
  previousHash: string;
  hash: string;
  tampered?: boolean;
}

export interface AuditBlock {
  blockNumber: number;
  timestamp: string;
  eventType: string;
  actor: string;
  touristId: string;
  details: string;
  hash: string;
  prevHash: string;
  verified: boolean;
}

export interface ChainVerificationResult {
  valid: boolean;
  brokenBlockIndex: number | null;
  message: string;
  chainLength: number;
  details?: any;
}

export interface DigitalIdVerificationResult {
  status: 'VALID' | 'INVALID';
  match: boolean;
  message: string;
  computedHash: string;
  providedHash: string;
  canonicalData?: any;
}

export interface SosAlertPayload {
  incidentId: string;
  touristName: string;
  touristId: string;
  location: string;
  coordinates: [number, number];
  risk: number;
  time: string;
  severity: string;
  status: string;
  message: string;
  aiAnalysis?: AiAnalysisDetails;
}
