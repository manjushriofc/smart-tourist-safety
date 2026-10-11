import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  UserCheck,
  MapPin,
  IdCard,
  AlertOctagon,
  FileText,
  BarChart3,
  Database,
  Radio,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Users,
  Compass,
  Cpu,
  Layers,
} from 'lucide-react';
import { useSafetySimulation } from '../context/SafetySimulationContext';
import { StatusBadge } from '../components/ui/StatusBadge';

export const LandingPage: React.FC = () => {
  const { kpiStats, simulationMode, primaryTourist, setSafeLocation, setApproachWarning, setEnterDanger, setActivateSos } =
    useSafetySimulation();

  const portals = [
    {
      title: 'Safety Command Center',
      description: 'Centralized administrative telemetry dashboard with live geofence tracking, real-time KPI matrix, and incident response dispatch.',
      link: '/admin',
      icon: LayoutDashboard,
      badge: 'ADMIN PORTAL',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Tourist Safety Portal',
      description: 'Personal safety interface for tourists (Demo: Ananya Sharma) with 1-touch emergency SOS, live risk gauge, and safety zones.',
      link: '/tourist',
      icon: UserCheck,
      badge: 'TOURIST APP',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: 'Live Safety Geofence Map',
      description: 'Full-viewport interactive GIS mapping with Safe, Warning, and Danger restricted zone polygons and live GPS pings.',
      link: '/map',
      icon: MapPin,
      badge: 'GIS GEOMAP',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      title: 'Verifiable Digital ID',
      description: 'Tamper-evident tourist credentials with cryptographic validation, QR verification, KYC status, and emergency medical records.',
      link: '/digital-id',
      icon: IdCard,
      badge: 'IDENTITY / KYC',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      title: 'Emergency & SOS Operations',
      description: 'Rapid distress dispatch console, responder unit telemetry (Police, Medical Ambulance, Coast Guard), and siren triage.',
      link: '/emergency',
      icon: AlertOctagon,
      badge: 'DISPATCH DESK',
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      title: 'Incident Management',
      description: 'Enterprise incident log with severity filtering, audit history, automated perimeter breach logs, and triage workflows.',
      link: '/incidents',
      icon: FileText,
      badge: 'LOGS & AUDIT',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      title: 'Telemetry & Risk Analytics',
      description: 'Data visualizer with risk trajectory curves, zone density trends, hourly safety index, and response latency charts.',
      link: '/analytics',
      icon: BarChart3,
      badge: 'ANALYTICS',
      badgeColor: 'bg-cyan-100 text-cyan-800',
    },
    {
      title: 'Immutable Audit Ledger',
      description: 'Enterprise cryptographic transparency ledger preview with tamper-proof event hashes and chronological audit trail.',
      link: '/audit-ledger',
      icon: Database,
      badge: 'LEDGER PROOF',
      badgeColor: 'bg-slate-200 text-slate-800',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-elevated p-8 sm:p-12">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-blue-300 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>ENTERPRISE CIVIL PROTECTION & SMART TOURIST MONITORING</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Intelligent Safety Geofencing & Emergency Command Platform
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            A comprehensive, real-time tourist protection network integrating continuous IoT telemetry, dynamic hazard geofencing, verifiable digital credentials, and rapid incident dispatch.
          </p>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 text-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Launch Command Center</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/map"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-5 py-3 rounded-xl border border-slate-700 transition text-sm"
            >
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>Open Live Safety Map</span>
            </Link>

            <Link
              to="/tourist"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-5 py-3 rounded-xl border border-slate-700 transition text-sm"
            >
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span>Demo Tourist (Ananya Sharma)</span>
            </Link>
          </div>

          {/* Real-time System KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 border-t border-slate-800">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Tourists</span>
              <span className="text-xl font-extrabold text-white font-mono">{kpiStats.activeTourists}</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Verified Safe</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">{kpiStats.safe}</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">In Caution Zone</span>
              <span className="text-xl font-extrabold text-amber-400 font-mono">{kpiStats.warning}</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-orange-400 block">High Risk</span>
              <span className="text-xl font-extrabold text-orange-400 font-mono">{kpiStats.highRisk}</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-red-400 block">Critical SOS</span>
              <span className="text-xl font-extrabold text-red-400 font-mono">{kpiStats.critical}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulation Sandbox Card */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Interactive Prototype Simulation Engine</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded">
                PHASE 1 ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly test safety status transitions for primary demo tourist <strong>Ananya Sharma</strong> ({primaryTourist.id}).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Active State:</span>
            <StatusBadge status={primaryTourist.status} size="md" showPulse />
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
              Risk: {primaryTourist.riskScore}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <button
            onClick={setSafeLocation}
            className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
              simulationMode === 'SAFE'
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">[SAFE LOCATION]</span>
                <span className="text-xs font-mono font-bold text-emerald-700">18% Risk</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                ✓ Tourist is inside a safe zone (Heritage Promenade).
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-3 block">Trigger Safe State →</span>
          </button>

          <button
            onClick={setApproachWarning}
            className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
              simulationMode === 'WARNING'
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800">[APPROACH WARNING]</span>
                <span className="text-xs font-mono font-bold text-amber-700">48% Risk</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                ⚠ Tourist approaching caution zone (Coastal Buffer).
              </p>
            </div>
            <span className="text-[11px] font-semibold text-amber-600 mt-3 block">Trigger Caution State →</span>
          </button>

          <button
            onClick={setEnterDanger}
            className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
              simulationMode === 'DANGER'
                ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-500/20'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-800">[ENTER DANGER]</span>
                <span className="text-xs font-mono font-bold text-orange-700">84% Risk</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                ⚠ GEO-FENCE BREACH: Tourist entered restricted area.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-orange-600 mt-3 block">Trigger Geofence Breach →</span>
          </button>

          <button
            onClick={setActivateSos}
            className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
              simulationMode === 'SOS'
                ? 'bg-red-50 border-red-300 ring-2 ring-red-500/20 shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-800">[ACTIVATE SOS]</span>
                <span className="text-xs font-mono font-bold text-red-700">100% Risk</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                🚨 SOS ACTIVATED: Immediate emergency response required.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-red-600 mt-3 block">Trigger Distress Beacon →</span>
          </button>
        </div>
      </section>

      {/* Portals Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">System Navigation & Modules</h2>
            <p className="text-xs text-slate-500">Access all 8 operational portals in this Phase 1 prototype.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {portals.map(p => {
            const Icon = p.icon;
            return (
              <Link
                key={p.link}
                to={p.link}
                className="group bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-card hover:border-blue-300 transition duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 pt-4 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                  <span>Open Portal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs mb-4 text-slate-500">
          Core Safety Pillars (Civil Protection Specifications)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">Dynamic Multi-Polygon Geofencing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated perimeter boundary checks against Safe, Warning, and Restricted Danger zones with sub-second position latency.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <IdCard className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">Verifiable Digital Tourist Pass</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cryptographically signed identity credentials carrying emergency medical notes, next-of-kin contacts, and instant QR verification.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
              <Radio className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">1-Touch Distress Mesh & QRF Dispatch</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rapid emergency broadcast linking distress coordinates with Tourist Police, Medical Ambulances, and Coast Guard units.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
