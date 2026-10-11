import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Radio,
  MapPin,
  Clock,
  CheckCircle2,
  PhoneCall,
  Send,
  Eye,
  ExternalLink,
  Shield,
  X,
  Flame,
  Check,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { useSafetySimulation } from '../context/SafetySimulationContext';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SafetyLeafletMap } from '../components/map/SafetyLeafletMap';
import { Modal } from '../components/ui/Modal';
import { AiRiskExplainer } from '../components/ui/AiRiskExplainer';
import { Incident } from '../types';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const {
    kpiStats,
    incidents,
    primaryTourist,
    simulationMode,
    latestSosAlert,
    clearSosAlert,
    acknowledgeIncident,
    dispatchIncident,
    resolveIncident,
    focusOnTourist,
  } = useSafetySimulation();

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* 🚨 CRITICAL SOS ALERT BANNER */}
      {(latestSosAlert || (simulationMode === 'SOS' && primaryTourist.sosActive)) && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 rounded-2xl shadow-2xl border-2 border-red-400 relative overflow-hidden animate-pulse">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-lg border border-white/30">
                <Radio className="h-8 w-8 animate-spin" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-white text-red-700 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    DISTRESS BEACON ACTIVE
                  </span>
                  <span className="text-red-100 text-xs font-mono">
                    Incident: <strong>{latestSosAlert?.incidentId || 'INC-2026-SOS'}</strong>
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  🚨 CRITICAL SOS ALERT
                </h2>
                <p className="text-xs text-red-100 font-medium">
                  Emergency distress beacon triggered with real-time GPS coordinate lock.
                </p>
              </div>
            </div>

            <button
              onClick={clearSosAlert}
              className="text-white/80 hover:text-white p-1.5 rounded-lg bg-black/20 hover:bg-black/30 transition"
              title="Dismiss alert banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Key Fields Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 bg-black/25 p-4 rounded-xl backdrop-blur-xs border border-white/10 text-xs font-mono">
            <div>
              <span className="text-red-200 text-[10px] uppercase block font-sans font-bold">Tourist</span>
              <span className="font-bold text-white text-sm">
                {latestSosAlert?.touristName || primaryTourist.name}
              </span>
              <span className="text-red-200 text-[11px] block">
                {latestSosAlert?.touristId || primaryTourist.id}
              </span>
            </div>

            <div className="col-span-2">
              <span className="text-red-200 text-[10px] uppercase block font-sans font-bold">Location</span>
              <span className="font-bold text-white block truncate">
                {latestSosAlert?.location || 'Restricted High-Tide Rocky Shoals [15.5110, 73.8520]'}
              </span>
              <span className="text-red-200 text-[11px]">Sector 4 Danger Zone</span>
            </div>

            <div>
              <span className="text-red-200 text-[10px] uppercase block font-sans font-bold">Risk Score</span>
              <span className="font-extrabold text-white text-sm bg-red-800/80 px-2 py-0.5 rounded border border-red-500 inline-block">
                {latestSosAlert?.risk || 100}% CRITICAL
              </span>
            </div>

            <div>
              <span className="text-red-200 text-[10px] uppercase block font-sans font-bold">Time</span>
              <span className="font-bold text-white block">
                {latestSosAlert?.time ? latestSosAlert.time.substring(11, 19) : new Date().toLocaleTimeString()}
              </span>
              <span className="text-red-200 text-[10px]">Real-Time Sync</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-white/15">
            <button
              onClick={() => {
                const targetId = latestSosAlert?.incidentId || 'INC-2026-001';
                acknowledgeIncident(targetId);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition shadow-md"
            >
              ACKNOWLEDGE
            </button>

            <button
              onClick={() => {
                const targetId = latestSosAlert?.incidentId || 'INC-2026-001';
                dispatchIncident(targetId, 'Rapid Medical Ambulance QRF 03');
              }}
              className="bg-white hover:bg-slate-100 text-red-700 font-black text-xs px-4 py-2 rounded-xl transition shadow-md"
            >
              DISPATCH QRF UNIT
            </button>

            <button
              onClick={() => {
                const targetId = latestSosAlert?.incidentId || 'INC-2026-001';
                resolveIncident(targetId);
                clearSosAlert();
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-xl transition shadow-md"
            >
              RESOLVE INCIDENT
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
              Operations Telemetry Console
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SYSTEM ONLINE
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            SMART TOURIST SAFETY COMMAND CENTER
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized civil monitoring, dynamic geofence containment, and AI Contextual Safety Risk analysis.
          </p>
        </div>

        {/* Top right quick actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/map"
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition border border-slate-200"
          >
            <MapPin className="h-4 w-4 text-blue-600" />
            <span>Full Map View</span>
          </Link>

          <Link
            to="/emergency"
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs ${
              simulationMode === 'SOS'
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>Emergency Dispatch</span>
          </Link>
        </div>
      </div>

      {/* 5 KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="ACTIVE TOURISTS"
          value={kpiStats.activeTourists}
          subtitle="Monitored within sector"
          icon={<Users className="h-5 w-5" />}
          variant="primary"
        />
        <StatCard
          title="SAFE"
          value={kpiStats.safe}
          subtitle="Inside verified safe corridor"
          icon={<ShieldCheck className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="WARNING"
          value={kpiStats.warning}
          subtitle="Approaching buffer perimeter"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="warning"
        />
        <StatCard
          title="HIGH RISK"
          value={kpiStats.highRisk}
          subtitle="Geofence breach detected"
          icon={<AlertOctagon className="h-5 w-5" />}
          variant="danger"
        />
        <StatCard
          title="CRITICAL"
          value={kpiStats.critical}
          subtitle="Active distress / SOS beacon"
          icon={<Radio className="h-5 w-5" />}
          variant="critical"
        />
      </div>

      {/* Main Section: LIVE TOURIST MAP & ACTIVE INCIDENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Left: LIVE TOURIST MAP */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                LIVE TOURIST MAP
              </h2>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                Avalon Coastal Zone
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => focusOnTourist('ST-IND-2026-001')}
                className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-md border border-blue-200 hover:bg-blue-100 transition"
              >
                Focus: Ananya Sharma ({primaryTourist.status})
              </button>
            </div>
          </div>

          <SafetyLeafletMap height="540px" />
        </div>

        {/* Main Right: ACTIVE INCIDENTS */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                ACTIVE INCIDENTS
              </h2>
              <p className="text-xs text-slate-500">
                {incidents.filter(i => i.status !== 'RESOLVED').length} open security & distress events
              </p>
            </div>

            <Link
              to="/incidents"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
            >
              <span>View All ({incidents.length})</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {/* Incidents Card Container */}
          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {incidents.map(incident => {
              const isCritical = incident.severity === 'CRITICAL';
              const isHigh = incident.severity === 'HIGH';

              return (
                <div
                  key={incident.id}
                  className={`rounded-xl p-4 border transition duration-150 relative bg-white shadow-xs hover:shadow-md ${
                    isCritical
                      ? 'border-red-300 bg-red-50/30 ring-1 ring-red-200'
                      : isHigh
                      ? 'border-orange-200 hover:border-orange-300'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {incident.id}
                        </span>
                        <StatusBadge status={incident.severity} size="sm" showPulse />
                      </div>
                      <div className="text-xs font-semibold text-slate-700">
                        Tourist: <strong className="text-slate-900">{incident.touristId}</strong> ({incident.touristName})
                      </div>
                    </div>

                    <StatusBadge status={incident.status} size="sm" />
                  </div>

                  {/* Incident Type & Description */}
                  <div className="mt-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                    <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      {isCritical ? (
                        <Radio className="h-3.5 w-3.5 text-red-600 animate-pulse" />
                      ) : (
                        <AlertOctagon className="h-3.5 w-3.5 text-orange-600" />
                      )}
                      <span>{incident.type}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {incident.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {incident.timestamp.substring(11, 19)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {incident.status === 'ACTIVE' && (
                        <button
                          onClick={() => acknowledgeIncident(incident.id)}
                          className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold transition text-[10px]"
                        >
                          ACKNOWLEDGE
                        </button>
                      )}

                      {incident.status !== 'DISPATCHED' && incident.status !== 'RESOLVED' && (
                        <button
                          onClick={() => dispatchIncident(incident.id, 'Tourist Police Patrol 12')}
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold transition text-[10px]"
                        >
                          DISPATCH
                        </button>
                      )}

                      {incident.status !== 'RESOLVED' && (
                        <button
                          onClick={() => resolveIncident(incident.id)}
                          className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold transition text-[10px]"
                        >
                          RESOLVE
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedIncident(incident)}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition text-[10px]"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI CONTEXTUAL SAFETY RISK ENGINE LIVE CARD */}
      <AiRiskExplainer
        analysis={primaryTourist.aiAnalysis}
        touristName={primaryTourist.name}
        touristId={primaryTourist.id}
      />

      {/* Incident Details Modal */}
      {selectedIncident && (
        <Modal
          isOpen={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
          title={`Incident Inspection: ${selectedIncident.id}`}
          subtitle={`Reported on ${selectedIncident.timestamp}`}
          footer={
            <>
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
              {selectedIncident.status !== 'RESOLVED' && (
                <button
                  onClick={() => {
                    resolveIncident(selectedIncident.id);
                    setSelectedIncident(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Mark as Resolved</span>
                </button>
              )}
            </>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Tourist</span>
                <span className="font-bold text-slate-900">{selectedIncident.touristName}</span>
                <span className="text-slate-500 font-mono block">{selectedIncident.touristId}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Severity & Status</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <StatusBadge status={selectedIncident.severity} size="sm" showPulse />
                  <StatusBadge status={selectedIncident.status} size="sm" />
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Zone Location</span>
                <span className="font-bold text-slate-800">{selectedIncident.zone}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Assigned Unit</span>
                <span className="font-bold text-blue-700">{selectedIncident.assignedUnit || 'Unassigned'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800">Incident Narrative</h4>
              <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                {selectedIncident.description}
              </p>
            </div>

            {selectedIncident.actionLog && selectedIncident.actionLog.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800">Audit & Action Trail</h4>
                <div className="space-y-1.5 text-xs font-mono">
                  {selectedIncident.actionLog.map((log, idx) => (
                    <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-200 flex items-start gap-2">
                      <span className="text-slate-400 shrink-0">[{log.time}]</span>
                      <span className="text-slate-700 flex-1">{log.action}</span>
                      <span className="text-slate-500 text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">{log.agent}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
