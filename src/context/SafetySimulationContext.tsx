import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Tourist, SafetyZone, Incident, ResponderUnit, KPIStats, SosAlertPayload } from '../types';
import {
  INITIAL_PRIMARY_TOURIST,
  INITIAL_OTHER_TOURISTS,
  SAFETY_ZONES,
  INITIAL_INCIDENTS,
  RESPONDER_UNITS,
  SIMULATION_LOCATIONS,
} from '../data/mockData';
import { api } from '../services/api';
import { socketService } from '../services/socket';

export type SimulationMode = 'SAFE' | 'WARNING' | 'DANGER' | 'SOS';

interface SafetyContextType {
  primaryTourist: Tourist;
  otherTourists: Tourist[];
  allTourists: Tourist[];
  zones: SafetyZone[];
  incidents: Incident[];
  responderUnits: ResponderUnit[];
  simulationMode: SimulationMode;
  kpiStats: KPIStats;
  selectedTouristId: string | null;
  mapCenter: [number, number];
  mapZoom: number;
  latestSosAlert: SosAlertPayload | null;
  clearSosAlert: () => void;
  // Simulation methods
  setSafeLocation: () => Promise<void>;
  setApproachWarning: () => Promise<void>;
  setEnterDanger: () => Promise<void>;
  setActivateSos: () => Promise<void>;
  resetDemo: () => Promise<void>;
  // Incident methods (with Phase 2 statuses: ACTIVE, ACKNOWLEDGED, DISPATCHED, RESOLVED)
  acknowledgeIncident: (id: string) => Promise<void>;
  dispatchIncident: (id: string, unitName?: string) => Promise<void>;
  resolveIncident: (id: string) => Promise<void>;
  dispatchUnitToIncident: (incidentId: string, unitName: string) => Promise<void>;
  addIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => Promise<void>;
  // Selection & Map methods
  setSelectedTouristId: (id: string | null) => void;
  focusOnTourist: (touristId: string) => void;
  resetMapFocus: () => void;
}

const SafetySimulationContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetySimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [primaryTourist, setPrimaryTourist] = useState<Tourist>(INITIAL_PRIMARY_TOURIST);
  const [otherTourists, setOtherTourists] = useState<Tourist[]>(INITIAL_OTHER_TOURISTS);
  const [zones, setZones] = useState<SafetyZone[]>(SAFETY_ZONES);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [responderUnits, setResponderUnits] = useState<ResponderUnit[]>(RESPONDER_UNITS);
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('SAFE');
  const [selectedTouristId, setSelectedTouristId] = useState<string | null>('ST-IND-2026-001');
  const [mapCenter, setMapCenter] = useState<[number, number]>([15.5030, 73.8350]);
  const [mapZoom, setMapZoom] = useState<number>(14);
  const [latestSosAlert, setLatestSosAlert] = useState<SosAlertPayload | null>(null);

  const [kpiStats, setKpiStats] = useState<KPIStats>({
    activeTourists: 128,
    safe: 96,
    warning: 24,
    highRisk: 6,
    critical: 2,
    systemStatus: 'ONLINE',
    activeIncidentsCount: 3,
    avgResponseTimeMin: 3.4,
  });

  // Combine all tourists
  const allTourists = useMemo(() => {
    return [primaryTourist, ...otherTourists];
  }, [primaryTourist, otherTourists]);

  // Initial Load from Backend & Socket.IO Event Listeners
  useEffect(() => {
    // 1. Fetch initial data from Backend
    const fetchData = async () => {
      try {
        const [touristsRes, zonesRes, incidentsRes] = await Promise.all([
          api.getTourists().catch(() => null),
          api.getZones().catch(() => null),
          api.getIncidents().catch(() => null),
        ]);

        if (touristsRes && touristsRes.data) {
          const primary = touristsRes.data.find((t: Tourist) => t.id === 'ST-IND-2026-001');
          const others = touristsRes.data.filter((t: Tourist) => t.id !== 'ST-IND-2026-001');
          if (primary) setPrimaryTourist(primary);
          if (others.length > 0) setOtherTourists(others);
          if (touristsRes.kpi) setKpiStats(touristsRes.kpi);
        }

        if (zonesRes && zonesRes.data) {
          setZones(zonesRes.data);
        }

        if (incidentsRes && incidentsRes.data) {
          setIncidents(incidentsRes.data);
        }
      } catch (err) {
        console.warn('Backend fetch fallback to initial local state:', err);
      }
    };

    fetchData();

    // 2. Connect Socket.IO
    const socket = socketService.connect();

    // Listen: tourist:updated
    socket.on('tourist:updated', (updatedTourist: Tourist) => {
      console.log('[Socket Event] tourist:updated:', updatedTourist.id, updatedTourist.status);
      if (updatedTourist.id === 'ST-IND-2026-001') {
        setPrimaryTourist(updatedTourist);
        setMapCenter(updatedTourist.coordinates);
        if (updatedTourist.status === 'CRITICAL' || updatedTourist.sosActive) {
          setSimulationMode('SOS');
        } else if (updatedTourist.status === 'HIGH RISK' || updatedTourist.currentZone === 'DANGER') {
          setSimulationMode('DANGER');
        } else if (updatedTourist.status === 'WARNING' || updatedTourist.currentZone === 'WARNING') {
          setSimulationMode('WARNING');
        } else {
          setSimulationMode('SAFE');
        }
      } else {
        setOtherTourists(prev =>
          prev.map(t => (t.id === updatedTourist.id ? updatedTourist : t))
        );
      }
    });

    // Listen: incident:created
    socket.on('incident:created', (newIncident: Incident) => {
      console.log('[Socket Event] incident:created:', newIncident.id, newIncident.severity);
      setIncidents(prev => {
        const exists = prev.some(i => i.id === newIncident.id);
        if (exists) {
          return prev.map(i => (i.id === newIncident.id ? newIncident : i));
        }
        return [newIncident, ...prev];
      });
    });

    // Listen: incident:updated
    socket.on('incident:updated', (updatedIncident: Incident) => {
      console.log('[Socket Event] incident:updated:', updatedIncident.id, updatedIncident.status);
      setIncidents(prev =>
        prev.map(i => (i.id === updatedIncident.id ? updatedIncident : i))
      );
    });

    // Listen: sos:alert
    socket.on('sos:alert', (sosPayload: SosAlertPayload) => {
      console.log('[Socket Event] sos:alert:', sosPayload);
      setLatestSosAlert(sosPayload);
      setSimulationMode('SOS');
    });

    // Listen: kpi:updated
    socket.on('kpi:updated', (updatedKpis: KPIStats) => {
      setKpiStats(updatedKpis);
    });

    // Listen: demo:reset
    socket.on('demo:reset', (payload) => {
      if (payload.tourists) {
        const primary = payload.tourists.find((t: Tourist) => t.id === 'ST-IND-2026-001');
        const others = payload.tourists.filter((t: Tourist) => t.id !== 'ST-IND-2026-001');
        if (primary) setPrimaryTourist(primary);
        if (others.length > 0) setOtherTourists(others);
      }
      if (payload.incidents) setIncidents(payload.incidents);
      if (payload.kpi) setKpiStats(payload.kpi);
      setSimulationMode('SAFE');
      setLatestSosAlert(null);
      setMapCenter([15.5030, 73.8350]);
      setMapZoom(14);
    });

    return () => {
      socket.off('tourist:updated');
      socket.off('incident:created');
      socket.off('incident:updated');
      socket.off('sos:alert');
      socket.off('kpi:updated');
      socket.off('demo:reset');
    };
  }, []);

  const clearSosAlert = () => {
    setLatestSosAlert(null);
  };

  // Simulation Handlers (Calling Backend REST API)
  const setSafeLocation = async () => {
    setSimulationMode('SAFE');
    setLatestSosAlert(null);
    try {
      await api.demoSafe('ST-IND-2026-001');
    } catch (e) {
      // Local fallback
      const data = SIMULATION_LOCATIONS.SAFE;
      setPrimaryTourist(prev => ({
        ...prev,
        coordinates: data.coordinates,
        status: data.status,
        riskScore: data.riskScore,
        currentZone: data.currentZone,
        sosActive: false,
        safetyMessage: data.message,
      }));
      setMapCenter(data.coordinates);
    }
  };

  const setApproachWarning = async () => {
    setSimulationMode('WARNING');
    setLatestSosAlert(null);
    try {
      await api.demoWarning('ST-IND-2026-001');
    } catch (e) {
      const data = SIMULATION_LOCATIONS.WARNING;
      setPrimaryTourist(prev => ({
        ...prev,
        coordinates: data.coordinates,
        status: data.status,
        riskScore: data.riskScore,
        currentZone: data.currentZone,
        sosActive: false,
        safetyMessage: data.message,
      }));
      setMapCenter(data.coordinates);
    }
  };

  const setEnterDanger = async () => {
    setSimulationMode('DANGER');
    setLatestSosAlert(null);
    try {
      await api.demoDanger('ST-IND-2026-001');
    } catch (e) {
      const data = SIMULATION_LOCATIONS.DANGER;
      setPrimaryTourist(prev => ({
        ...prev,
        coordinates: data.coordinates,
        status: data.status,
        riskScore: data.riskScore,
        currentZone: data.currentZone,
        sosActive: false,
        safetyMessage: data.message,
      }));
      setMapCenter(data.coordinates);
    }
  };

  const setActivateSos = async () => {
    setSimulationMode('SOS');
    try {
      const res = await api.demoSos('ST-IND-2026-001');
      if (res && res.data && res.data.sosAlert) {
        setLatestSosAlert(res.data.sosAlert);
      }
    } catch (e) {
      const data = SIMULATION_LOCATIONS.SOS;
      setPrimaryTourist(prev => ({
        ...prev,
        coordinates: data.coordinates,
        status: data.status,
        riskScore: data.riskScore,
        currentZone: data.currentZone,
        sosActive: true,
        safetyMessage: data.message,
      }));
      setMapCenter(data.coordinates);
    }
  };

  const resetDemo = async () => {
    setSimulationMode('SAFE');
    setLatestSosAlert(null);
    try {
      await api.demoReset();
    } catch (e) {
      setPrimaryTourist(INITIAL_PRIMARY_TOURIST);
      setOtherTourists(INITIAL_OTHER_TOURISTS);
      setIncidents(INITIAL_INCIDENTS);
      setMapCenter([15.5030, 73.8350]);
      setMapZoom(14);
    }
  };

  // Incident Lifecycle Handlers
  const acknowledgeIncident = async (id: string) => {
    try {
      const res = await api.updateIncident(id, { status: 'ACKNOWLEDGED', updatedBy: 'Duty Officer' });
      if (res && res.data) {
        setIncidents(prev => prev.map(i => (i.id === id ? res.data : i)));
      }
    } catch (e) {
      setIncidents(prev =>
        prev.map(inc => (inc.id === id ? { ...inc, status: 'ACKNOWLEDGED' as const } : inc))
      );
    }
  };

  const dispatchIncident = async (id: string, unitName = 'Tourist Police Patrol 12') => {
    try {
      const res = await api.updateIncident(id, {
        status: 'DISPATCHED',
        assignedUnit: unitName,
        updatedBy: 'Operations Dispatch',
      });
      if (res && res.data) {
        setIncidents(prev => prev.map(i => (i.id === id ? res.data : i)));
      }
    } catch (e) {
      setIncidents(prev =>
        prev.map(inc => (inc.id === id ? { ...inc, status: 'DISPATCHED' as const, assignedUnit: unitName } : inc))
      );
    }
  };

  const resolveIncident = async (id: string) => {
    try {
      const res = await api.updateIncident(id, { status: 'RESOLVED', updatedBy: 'Chief Safety Officer' });
      if (res && res.data) {
        setIncidents(prev => prev.map(i => (i.id === id ? res.data : i)));
      }
    } catch (e) {
      setIncidents(prev =>
        prev.map(inc => (inc.id === id ? { ...inc, status: 'RESOLVED' as const } : inc))
      );
    }
  };

  const dispatchUnitToIncident = async (incidentId: string, unitName: string) => {
    await dispatchIncident(incidentId, unitName);
  };

  const addIncident = async (newIncData: Omit<Incident, 'id' | 'timestamp'>) => {
    try {
      const res = await api.createIncident({
        touristId: newIncData.touristId,
        touristName: newIncData.touristName,
        type: newIncData.type,
        severity: newIncData.severity,
        zone: newIncData.zone,
        description: newIncData.description,
        coordinates: newIncData.coordinates,
        assignedUnit: newIncData.assignedUnit,
      });
      if (res && res.data) {
        setIncidents(prev => [res.data, ...prev]);
      }
    } catch (e) {
      const id = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;
      const newInc: Incident = {
        ...newIncData,
        id,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'ACTIVE',
      };
      setIncidents(prev => [newInc, ...prev]);
    }
  };

  const focusOnTourist = (touristId: string) => {
    setSelectedTouristId(touristId);
    const target = allTourists.find(t => t.id === touristId);
    if (target) {
      setMapCenter(target.coordinates);
      setMapZoom(16);
    }
  };

  const resetMapFocus = () => {
    setMapCenter([15.5030, 73.8350]);
    setMapZoom(14);
  };

  return (
    <SafetySimulationContext.Provider
      value={{
        primaryTourist,
        otherTourists,
        allTourists,
        zones,
        incidents,
        responderUnits,
        simulationMode,
        kpiStats,
        selectedTouristId,
        mapCenter,
        mapZoom,
        latestSosAlert,
        clearSosAlert,
        setSafeLocation,
        setApproachWarning,
        setEnterDanger,
        setActivateSos,
        resetDemo,
        acknowledgeIncident,
        dispatchIncident,
        resolveIncident,
        dispatchUnitToIncident,
        addIncident,
        setSelectedTouristId,
        focusOnTourist,
        resetMapFocus,
      }}
    >
      {children}
    </SafetySimulationContext.Provider>
  );
};

export const useSafetySimulation = (): SafetyContextType => {
  const context = useContext(SafetySimulationContext);
  if (!context) {
    throw new Error('useSafetySimulation must be used within a SafetySimulationProvider');
  }
  return context;
};
