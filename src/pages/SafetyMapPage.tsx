import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Layers,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Radio,
  User,
  ExternalLink,
  Navigation,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { useSafetySimulation } from '../context/SafetySimulationContext';
import { SafetyLeafletMap } from '../components/map/SafetyLeafletMap';
import { StatusBadge } from '../components/ui/StatusBadge';
import { RiskGauge } from '../components/ui/RiskGauge';

export const SafetyMapPage: React.FC = () => {
  const {
    allTourists,
    zones,
    selectedTouristId,
    focusOnTourist,
    resetMapFocus,
    primaryTourist,
  } = useSafetySimulation();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'tourists' | 'zones'>('tourists');

  const filteredTourists = allTourists.filter(t => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'SAFE' && t.status === 'SAFE') ||
      (filterStatus === 'WARNING' && t.status === 'WARNING') ||
      (filterStatus === 'HIGH_RISK' && (t.status === 'HIGH RISK' || t.status === 'CRITICAL')) ||
      (filterStatus === 'SOS' && (t.sosActive || t.status === 'CRITICAL'));

    const matchesSearch =
      searchQuery === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nationality.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Disclaimer */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
              GIS Geofencing Operations
            </span>
            <span className="text-xs text-slate-500 font-mono">Sector: Avalon Coastal District</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            LIVE TOURIST SAFETY MAP
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            High-precision geospatial surveillance of Safe Corridors, Buffer Warning perimeters, and Restricted Danger zones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetMapFocus}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition border border-slate-200"
          >
            <Navigation className="h-4 w-4" />
            <span>Reset Map Center</span>
          </button>
          <button
            onClick={() => focusOnTourist('ST-IND-2026-001')}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
          >
            <User className="h-4 w-4" />
            <span>Track Demo: Ananya ({primaryTourist.status})</span>
          </button>
        </div>
      </div>

      {/* Safety Disclaimer Callout */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Demonstration Zone Notice:</strong> All geographic polygons (Safe Zone, Warning Zone, Danger Zone) and GPS telemetry coordinates presented on this map are simulated for prototype evaluation and testing purposes only. They do not denote officially demarcated restricted territory in real-world geographic regions.
        </div>
      </div>

      {/* Main Grid: Map & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Map View (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <SafetyLeafletMap
            height="620px"
            filterStatus={filterStatus}
            searchQuery={searchQuery}
            showControls={true}
          />

          {/* Quick Zone Legend Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>SAFE ZONE</span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">
                Heritage Promenade & Marina Boulevard. Full police presence & CCTV mesh.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <span>WARNING ZONE</span>
              </div>
              <p className="text-[11px] text-amber-700 mt-1">
                Coastal Cliff Buffer. Cautionary boundary with steep drops & cellular fades.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-red-800">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <span>DANGER ZONE</span>
              </div>
              <p className="text-[11px] text-red-700 mt-1">
                Restricted Tidal Basin. High surge hazard. Unauthorized entry triggers breach alert.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Tourist / Zone Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col h-[690px]">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <button
              onClick={() => setActiveTab('tourists')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'tourists'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Tourists ({filteredTourists.length})
            </button>
            <button
              onClick={() => setActiveTab('zones')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'zones'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Safety Zones ({zones.length})
            </button>
          </div>

          {activeTab === 'tourists' ? (
            <>
              {/* Search & Filter Bar */}
              <div className="space-y-2 py-3 border-b border-slate-100">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by name, ID, or nation..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {['ALL', 'SAFE', 'WARNING', 'HIGH_RISK', 'SOS'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterStatus(f)}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition ${
                        filterStatus === f
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tourist Directory List */}
              <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
                {filteredTourists.map(tourist => {
                  const isSelected = selectedTouristId === tourist.id;
                  const isPrimary = tourist.isPrimaryDemo;

                  return (
                    <div
                      key={tourist.id}
                      onClick={() => focusOnTourist(tourist.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-400'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">{tourist.name}</span>
                            {isPrimary && (
                              <span className="bg-blue-600 text-white text-[9px] font-extrabold px-1 rounded">
                                DEMO
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {tourist.id} • {tourist.nationality}
                          </span>
                        </div>
                        <StatusBadge status={tourist.status} size="sm" showPulse />
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>Zone: <strong className="text-slate-700">{tourist.currentZone}</strong></span>
                        <span className="font-mono font-bold text-slate-700">Risk: {tourist.riskScore}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Zones List */
            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
              {zones.map(zone => (
                <div key={zone.id} className="p-3.5 rounded-xl border border-slate-200 space-y-2 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{zone.name}</span>
                    <StatusBadge status={zone.type} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{zone.description}</p>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex items-center justify-between font-mono">
                    <span>Speed: {zone.speedLimit}</span>
                    <span>Patrol: {zone.patrolUnit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
