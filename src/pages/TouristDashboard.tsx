import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Radio,
  User,
  IdCard,
  Phone,
  MapPin,
  Heart,
  Battery,
  Shield,
  Clock,
  Building,
} from 'lucide-react';
import { useSafetySimulation } from '../context/SafetySimulationContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { RiskGauge } from '../components/ui/RiskGauge';
import { AiRiskExplainer } from '../components/ui/AiRiskExplainer';
import { Link } from 'react-router-dom';

export const TouristDashboard: React.FC = () => {
  const {
    primaryTourist,
    setSafeLocation,
    setApproachWarning,
    setEnterDanger,
    setActivateSos,
  } = useSafetySimulation();

  const isSafe = primaryTourist.status === 'SAFE';
  const isWarning = primaryTourist.status === 'WARNING';
  const isDanger = primaryTourist.status === 'HIGH RISK';
  const isSos = primaryTourist.sosActive || primaryTourist.status === 'CRITICAL';

  const safeHavens = [
    { name: 'Heritage Promenade Tourist Police Kiosk A', distance: '150 meters', status: 'OPEN (24/7)', phone: '1363' },
    { name: 'District Emergency Medical Post #02', distance: '400 meters', status: 'STAFFED', phone: '108' },
    { name: 'Civil Defense Tourist Haven & Information', distance: '650 meters', status: 'OPEN', phone: '0832-241900' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Tourist Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              AS
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {primaryTourist.name}
                </h1>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded">
                  DEMO PASS
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                <span>
                  ID: <strong className="text-slate-800">{primaryTourist.id}</strong>
                </span>
                <span>•</span>
                <span>
                  Nationality: <strong className="text-slate-800">{primaryTourist.nationality}</strong>
                </span>
                <span>•</span>
                <span>
                  Blood: <strong className="text-slate-800">{primaryTourist.digitalId.bloodGroup}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:self-center">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Civil Status</span>
              <StatusBadge status={primaryTourist.status} size="lg" showPulse />
            </div>
            <Link
              to="/digital-id"
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
            >
              <IdCard className="h-4 w-4" />
              <span>Verifiable Digital ID</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Status & SOS Callout Card */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 transition-all duration-300 shadow-sm ${
          isSos
            ? 'bg-red-50/70 border-red-300 ring-2 ring-red-400'
            : isDanger
            ? 'bg-orange-50/70 border-orange-300 ring-2 ring-orange-400/50'
            : isWarning
            ? 'bg-amber-50/70 border-amber-300'
            : 'bg-emerald-50/70 border-emerald-300'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Status feedback message */}
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">
              {isSos && <Radio className="h-6 w-6 text-red-600 animate-spin" />}
              {isDanger && <AlertOctagon className="h-6 w-6 text-orange-600" />}
              {isWarning && <AlertTriangle className="h-6 w-6 text-amber-600" />}
              {isSafe && <ShieldCheck className="h-6 w-6 text-emerald-600" />}

              <span
                className={`text-lg sm:text-xl font-extrabold tracking-tight ${
                  isSos
                    ? 'text-red-700'
                    : isDanger
                    ? 'text-orange-800'
                    : isWarning
                    ? 'text-amber-800'
                    : 'text-emerald-800'
                }`}
              >
                {isSafe && '✓ Tourist is inside a safe zone.'}
                {isWarning && '⚠ Tourist approaching caution zone.'}
                {isDanger && '⚠ GEO-FENCE BREACH: Tourist entered a restricted area.'}
                {isSos && '🚨 SOS ACTIVATED: Immediate response required.'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-xl leading-relaxed">
              {isSafe &&
                'Your current GPS location is inside the monitored Heritage Safe Corridor. Tourist Police patrols and emergency call boxes are readily accessible.'}
              {isWarning &&
                'You are approaching the Coastal Cliff Buffer zone. Cellular coverage may fluctuate, and terrain steepness increases. Exercise caution.'}
              {isDanger &&
                'You have entered a strictly restricted tidal surge hazard zone. Please turn around and return towards the marked green corridor immediately.'}
              {isSos &&
                'Your distress beacon is actively broadcasting high-precision GPS coordinates to regional police, coast guard, and medical responders. Stand by for contact.'}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-600 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-blue-600" />
                Current Zone: <strong className="text-slate-900">{primaryTourist.currentZone} ZONE</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Battery className="h-4 w-4 text-emerald-600" />
                Device Battery: <strong className="text-slate-900">{primaryTourist.batteryLevel}%</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-500" />
                Last Ping: <strong className="text-slate-900">{primaryTourist.lastPing}</strong>
              </span>
            </div>
          </div>

          {/* Big Interactive 1-Touch SOS Button */}
          <div className="shrink-0 text-center">
            <button
              onClick={() => {
                if (isSos) {
                  setSafeLocation();
                } else {
                  setActivateSos();
                }
              }}
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center text-white font-extrabold shadow-2xl transition transform active:scale-95 ${
                isSos
                  ? 'bg-red-600 hover:bg-red-700 ring-8 ring-red-300 animate-pulse'
                  : 'bg-red-600 hover:bg-red-700 ring-4 ring-red-200'
              }`}
            >
              <Radio className="h-8 w-8 mb-1" />
              <span className="text-base tracking-wider">{isSos ? 'SOS ACTIVE' : 'EMERGENCY'}</span>
              <span className="text-[10px] font-bold opacity-90">{isSos ? 'TAP TO CANCEL' : 'PRESS FOR SOS'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Contextual Safety Risk Engine Card */}
      <AiRiskExplainer
        analysis={primaryTourist.aiAnalysis}
        touristName={primaryTourist.name}
        touristId={primaryTourist.id}
      />

      {/* Telemetry Gauge & Quick Testing Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Telemetry Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Personal Safety Risk Score</h3>
            <span className="text-xs font-mono font-bold text-slate-500">Live AI Index</span>
          </div>

          <RiskGauge score={primaryTourist.riskScore} size="lg" />

          <p className="text-xs text-slate-500 leading-relaxed">
            Real-time telemetry computes environmental hazard factors, proximity to restricted tidal perimeters, and active civil defense alerts.
          </p>
        </div>

        {/* Quick Simulation Trigger Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Simulation Quick Switch</h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Demo Tool</span>
          </div>
          <p className="text-xs text-slate-500">
            Switch tourist location state to observe real-time AI risk analysis and geofencing:
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={setSafeLocation}
              className={`text-xs font-bold py-2 px-3 rounded-lg border transition text-left ${
                isSafe ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              [SAFE LOCATION] (18%)
            </button>
            <button
              onClick={setApproachWarning}
              className={`text-xs font-bold py-2 px-3 rounded-lg border transition text-left ${
                isWarning ? 'bg-amber-600 text-white border-amber-600' : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              [APPROACH WARNING] (48%)
            </button>
            <button
              onClick={setEnterDanger}
              className={`text-xs font-bold py-2 px-3 rounded-lg border transition text-left ${
                isDanger ? 'bg-orange-600 text-white border-orange-600' : 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100'
              }`}
            >
              [ENTER DANGER] (84%)
            </button>
            <button
              onClick={setActivateSos}
              className={`text-xs font-bold py-2 px-3 rounded-lg border transition text-left ${
                isSos ? 'bg-red-600 text-white border-red-600' : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
              }`}
            >
              [ACTIVATE SOS] (100%)
            </button>
          </div>
        </div>
      </div>

      {/* Safe Havens & Emergency Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span>Nearby Safe Havens & Police Kiosks</span>
            </h3>
            <Link to="/map" className="text-xs text-blue-600 font-bold hover:underline">
              View on Map
            </Link>
          </div>

          <div className="space-y-3">
            {safeHavens.map((haven, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900">{haven.name}</h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 font-mono">
                    <span>{haven.distance}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">{haven.status}</span>
                  </div>
                </div>
                <a
                  href={`tel:${haven.phone}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Call</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-600" />
            <span>Emergency Contacts & Medical Info</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Primary Next-of-Kin Contact
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{primaryTourist.digitalId.emergencyContactName}</p>
                  <p className="text-slate-500">{primaryTourist.digitalId.emergencyContactRelation}</p>
                </div>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  {primaryTourist.digitalId.emergencyContactPhone}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Group</span>
                <span className="font-bold text-slate-900 font-mono">{primaryTourist.digitalId.bloodGroup}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Insurance Policy</span>
                <span className="font-bold text-slate-900 font-mono text-[11px] truncate block">
                  {primaryTourist.digitalId.travelInsurancePolicy}
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-900 text-xs">
              <strong>Accommodation:</strong> {primaryTourist.digitalId.hotelAccommodation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
