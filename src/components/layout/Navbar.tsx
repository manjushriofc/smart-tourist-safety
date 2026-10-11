import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  MapPin,
  IdCard,
  AlertOctagon,
  FileText,
  BarChart3,
  Database,
  UserCheck,
  Menu,
  X,
  Activity,
  Radio,
  Sliders,
} from 'lucide-react';
import { useSafetySimulation } from '../../context/SafetySimulationContext';

export const Navbar: React.FC<{ onToggleSimulation?: () => void; isSimulationOpen?: boolean }> = ({
  onToggleSimulation,
  isSimulationOpen = true,
}) => {
  const { kpiStats, simulationMode, primaryTourist, incidents } = useSafetySimulation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED').length;

  const navLinks = [
    { name: 'Command Center', path: '/admin', icon: LayoutDashboard },
    { name: 'Tourist View', path: '/tourist', icon: UserCheck },
    { name: 'Safety Map', path: '/map', icon: MapPin },
    { name: 'Digital ID', path: '/digital-id', icon: IdCard },
    { name: 'Emergency / SOS', path: '/emergency', icon: AlertOctagon, badge: primaryTourist.sosActive ? 'ACTIVE' : undefined },
    { name: 'Incidents', path: '/incidents', icon: FileText, count: activeIncidents },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Audit Ledger', path: '/audit-ledger', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top utility bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 sm:px-6 py-1.5 flex items-center justify-between font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SYSTEM ONLINE
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-400">
            NETWORK MESH: <strong className="text-white">ENCRYPTED (ST-SEC-v4)</strong>
          </span>
          <span className="hidden lg:inline text-slate-500">•</span>
          <span className="hidden lg:inline text-slate-400">
            TELEMETRY REFRESH: <strong className="text-white">REAL-TIME (0.8s)</strong>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">STATUS:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                simulationMode === 'SAFE'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : simulationMode === 'WARNING'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
              }`}
            >
              MODE: {simulationMode}
            </span>
          </div>
          {onToggleSimulation && (
            <button
              onClick={onToggleSimulation}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-0.5 rounded text-[11px] border border-slate-700 transition"
              title="Toggle Demo Simulation Bar"
            >
              <Sliders className="h-3 w-3" />
              <span>{isSimulationOpen ? 'Hide Simulation' : 'Show Simulation'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-800 transition">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 tracking-tight text-base leading-none">
                    SMART TOURIST SAFETY
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    GOV PROTOTYPE
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 tracking-wider uppercase mt-0.5">
                  Civil Protection & Tourist Monitoring Command
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors relative ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full animate-ping-slow">
                      {link.badge}
                    </span>
                  )}
                  {link.count !== undefined && link.count > 0 && (
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {link.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action: Demo Tourist Status Quick Pill */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/tourist"
              className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                AS
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Ananya S.</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      primaryTourist.status === 'SAFE'
                        ? 'bg-emerald-500'
                        : primaryTourist.status === 'WARNING'
                        ? 'bg-amber-500'
                        : 'bg-red-500 animate-ping'
                    }`}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {primaryTourist.id} • Risk: {primaryTourist.riskScore}%
                </div>
              </div>
            </Link>

            <Link
              to="/emergency"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                primaryTourist.sosActive
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              <span>SOS DISPATCH</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
          <div className="px-3 py-2 mb-2 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs font-bold text-slate-700">Demo Tourist: Ananya Sharma</div>
            <div className="text-[11px] text-slate-500 font-mono">
              ID: {primaryTourist.id} | Status: <strong className="text-slate-900">{primaryTourist.status}</strong> | Risk: {primaryTourist.riskScore}%
            </div>
          </div>
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-slate-500" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
                {link.count !== undefined && link.count > 0 && (
                  <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {link.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
};
