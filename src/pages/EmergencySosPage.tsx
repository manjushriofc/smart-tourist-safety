import React, { useState } from 'react';
import {
  AlertOctagon,
  Radio,
  PhoneCall,
  Navigation,
  Send,
  CheckCircle2,
  Clock,
  Shield,
  Ambulance,
  LifeBuoy,
  Volume2,
  VolumeX,
  MapPin,
  Flame,
  Activity,
  User,
  ExternalLink,
} from 'lucide-react';
import { useSafetySimulation } from '../context/SafetySimulationContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { StatCard } from '../components/ui/StatCard';
import { RiskGauge } from '../components/ui/RiskGauge';
import { Link } from 'react-router-dom';

export const EmergencySosPage: React.FC = () => {
  const {
    incidents,
    primaryTourist,
    simulationMode,
    responderUnits,
    dispatchUnitToIncident,
    resolveIncident,
    setSafeLocation,
    setActivateSos,
  } = useSafetySimulation();

  const [sirenMuted, setSirenMuted] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Critical/SOS incidents
  const criticalIncidents = incidents.filter(
    i => i.severity === 'CRITICAL' || i.type === 'SOS ACTIVATED' || (i.touristId === primaryTourist.id && primaryTourist.sosActive)
  );

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage('');
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              QRF Tactical Operations
            </span>
            <span className="text-xs text-slate-500 font-mono">Channel: SEC-EMERGENCY-01</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            EMERGENCY & SOS COMMAND DESK
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Priority distress beacon triage, rapid responder unit mobilization, and multi-agency evacuation coordination.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSirenMuted(!sirenMuted)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition border ${
              sirenMuted
                ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            }`}
          >
            {sirenMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 animate-bounce" />}
            <span>{sirenMuted ? 'Siren Muted' : 'Siren Active'}</span>
          </button>

          {primaryTourist.sosActive ? (
            <button
              onClick={setSafeLocation}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Resolve Primary SOS (Safe)</span>
            </button>
          ) : (
            <button
              onClick={setActivateSos}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs animate-pulse"
            >
              <Radio className="h-4 w-4" />
              <span>Simulate Tourist SOS</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency Status Banner when SOS is active */}
      {simulationMode === 'SOS' && (
        <div className="bg-red-600 text-white p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3 text-center md:text-left">
            <Radio className="h-8 w-8 shrink-0 animate-spin" />
            <div>
              <h3 className="text-base font-extrabold tracking-wide">
                ACTIVE DISTRESS BEACON: ANANYA SHARMA (ST-IND-2026-001)
              </h3>
              <p className="text-xs text-red-100 mt-0.5">
                GPS Coordinate Lock: [15.5110, 73.8520] • Restricted High-Tide Rocky Shoals • Immediate QRF Mobilization Required
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatchUnitToIncident('INC-2026-001', 'Rapid Medical Ambulance QRF 03')}
            className="bg-white hover:bg-red-50 text-red-700 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow transition"
          >
            Auto-Dispatch Nearest QRF Unit
          </button>
        </div>
      )}

      {/* Grid: Active SOS Queue & Responder Units */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active SOS Distress Triage List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                ACTIVE DISTRESS BEACONS
              </h2>
              <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {criticalIncidents.length} Critical
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Response SLA: &lt;4 mins</span>
          </div>

          <div className="space-y-4">
            {criticalIncidents.map(incident => (
              <div
                key={incident.id}
                className="bg-white rounded-2xl border border-red-200 p-5 shadow-xs space-y-3 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />

                <div className="flex items-start justify-between gap-2 pt-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{incident.id}</span>
                      <StatusBadge status={incident.severity} size="sm" showPulse />
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800 mt-1">
                      {incident.touristName} ({incident.touristId})
                    </h3>
                  </div>

                  <StatusBadge status={incident.status} size="sm" />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-red-600" />
                      {incident.zone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {incident.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed pt-1">
                    {incident.description}
                  </p>
                </div>

                {/* Assigned Unit Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold text-[11px] uppercase">Unit:</span>
                    <span className="font-bold text-blue-700">
                      {incident.assignedUnit || 'Awaiting Unit Assignment'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatchUnitToIncident(incident.id, 'Tourist Police Patrol 12')}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg border border-blue-200 transition text-xs"
                    >
                      Dispatch Patrol
                    </button>
                    <button
                      onClick={() => resolveIncident(incident.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition text-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Resolve</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Responder Units Fleet (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              RESPONDER UNITS (QRF)
            </h2>
            <span className="text-xs text-slate-500 font-mono">4 Units Monitored</span>
          </div>

          <div className="space-y-3">
            {responderUnits.map(unit => (
              <div
                key={unit.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{unit.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 font-mono">
                    <span>{unit.location}</span>
                    <span>•</span>
                    <span>ETA: <strong className="text-slate-800">{unit.eta}</strong></span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full block text-center mb-1.5 ${
                      unit.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : unit.status === 'DISPATCHED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {unit.status}
                  </span>
                  <button
                    onClick={() => dispatchUnitToIncident('INC-2026-001', unit.name)}
                    className="text-[11px] bg-slate-900 hover:bg-slate-800 text-white font-bold px-2.5 py-1 rounded transition"
                  >
                    Deploy Unit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Regional Emergency Geobroadcast Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3 mt-6">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-blue-400" />
              <h3 className="font-bold text-sm">Emergency Cell Broadcast Tool</h3>
            </div>
            <p className="text-xs text-slate-400">
              Transmit high-priority safety advisory or evacuation push notification to all tourists in the sector.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-2">
              <textarea
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                placeholder="Type emergency alert message (e.g., High tide warning: Please exit the rocky zone immediately)..."
                rows={2}
                className="w-full text-xs p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-lg transition"
              >
                {broadcastSent ? '✓ Broadcast Transmitted to 128 Devices' : 'Broadcast to Sector (SMS + Push)'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
