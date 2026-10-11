import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Tooltip,
  useMap,
  Circle,
} from 'react-leaflet';
import L from 'leaflet';
import { Tourist, SafetyZone } from '../../types';
import { useSafetySimulation } from '../../context/SafetySimulationContext';
import { StatusBadge } from '../ui/StatusBadge';
import { RiskGauge } from '../ui/RiskGauge';
import { ShieldCheck, AlertTriangle, AlertOctagon, Radio, Navigation, Eye, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Custom Map Controller to smoothly pan/zoom when simulation state changes
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);
  return null;
};

// Create custom SVG DivIcons for Leaflet
const createTouristIcon = (tourist: Tourist, isSelected: boolean) => {
  const isPrimary = tourist.isPrimaryDemo;
  const isSos = tourist.sosActive || tourist.status === 'CRITICAL';
  const isDanger = tourist.status === 'HIGH RISK' || tourist.currentZone === 'DANGER';
  const isWarning = tourist.status === 'WARNING';

  let color = '#16a34a'; // safe green
  let border = '#15803d';
  let glyph = '✓';

  if (isSos) {
    color = '#dc2626';
    border = '#991b1b';
    glyph = 'SOS';
  } else if (isDanger) {
    color = '#ea580c';
    border = '#c2410c';
    glyph = '!';
  } else if (isWarning) {
    color = '#d97706';
    border = '#b45309';
    glyph = '⚠';
  }

  const pulseClass = isSos ? 'sos-marker-pulse' : '';
  const starBadge = isPrimary
    ? `<span style="position: absolute; top: -6px; right: -6px; background: #1e40af; color: white; font-size: 9px; font-weight: 800; border-radius: 9999px; padding: 1px 4px; border: 1.5px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">DEMO</span>`
    : '';

  const html = `
    <div style="position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
      ${starBadge}
      <div class="${pulseClass}" style="
        width: ${isPrimary ? '34px' : '28px'};
        height: ${isPrimary ? '34px' : '28px'};
        background-color: ${color};
        border: ${isSelected || isPrimary ? '3px solid #ffffff' : '2px solid #ffffff'};
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 800;
        font-size: ${isSos ? '10px' : isPrimary ? '13px' : '11px'};
        letter-spacing: -0.5px;
      ">
        ${glyph}
      </div>
      <div style="
        background: #0f172a;
        color: #ffffff;
        font-size: 10px;
        font-weight: 700;
        padding: 1px 6px;
        border-radius: 4px;
        margin-top: 2px;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.25);
        border: 1px solid rgba(255,255,255,0.2);
      ">
        ${tourist.name.split(' ')[0]}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-tourist-div-icon',
    iconSize: [60, 50],
    iconAnchor: [30, 25],
    popupAnchor: [0, -25],
  });
};

interface SafetyLeafletMapProps {
  height?: string;
  showControls?: boolean;
  filterStatus?: string;
  searchQuery?: string;
}

export const SafetyLeafletMap: React.FC<SafetyLeafletMapProps> = ({
  height = '520px',
  showControls = true,
  filterStatus = 'ALL',
  searchQuery = '',
}) => {
  const {
    allTourists,
    zones,
    selectedTouristId,
    mapCenter,
    mapZoom,
    focusOnTourist,
    resetMapFocus,
  } = useSafetySimulation();

  const navigate = useNavigate();

  // Filter tourists based on active filters
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
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-card bg-slate-100">
      {/* Top Map Banner with Status & Disclaimer */}
      <div className="bg-slate-900/90 backdrop-blur-xs text-white text-xs px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-800 z-20 relative">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-bold tracking-wide">LIVE SAFETY GEOFENCE MATRIX</span>
          <span className="text-slate-400 text-[11px] hidden md:inline">
            • Tracking {filteredTourists.length} active tourists in sector
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <span className="bg-blue-900/60 text-blue-200 border border-blue-700/50 px-2 py-0.5 rounded font-mono">
            Sector: Avalon Coast (Simulated)
          </span>
          <button
            onClick={resetMapFocus}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded border border-slate-700 transition"
          >
            <Navigation className="h-3 w-3" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Map Leaflet Container */}
      <div style={{ height }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render Safety Zones */}
          {zones.map(zone => {
            const isSafe = zone.type === 'SAFE';
            const isWarn = zone.type === 'WARNING';
            const isDanger = zone.type === 'DANGER';

            return (
              <Polygon
                key={zone.id}
                positions={zone.coordinates}
                pathOptions={{
                  color: zone.borderColor,
                  fillColor: zone.fillColor,
                  fillOpacity: isDanger ? 0.35 : isWarn ? 0.28 : 0.2,
                  weight: isDanger ? 2.5 : 2,
                  dashArray: isWarn ? '5, 5' : undefined,
                }}
              >
                <Tooltip sticky direction="center" className="font-sans font-bold text-xs">
                  <div className="text-center font-bold">
                    <p className="text-slate-900">{zone.name}</p>
                    <p className="text-[10px] text-slate-500 font-normal">Patrol: {zone.patrolUnit}</p>
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}

          {/* Render Tourist Markers */}
          {filteredTourists.map(tourist => {
            const isSelected = selectedTouristId === tourist.id;
            return (
              <Marker
                key={tourist.id}
                position={tourist.coordinates}
                icon={createTouristIcon(tourist, isSelected)}
                eventHandlers={{
                  click: () => {
                    focusOnTourist(tourist.id);
                  },
                }}
              >
                <Popup className="custom-popup" minWidth={280}>
                  <div className="p-4 space-y-3 font-sans">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-slate-900 text-sm">{tourist.name}</h4>
                          {tourist.isPrimaryDemo && (
                            <span className="bg-blue-100 text-blue-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                              PRIMARY DEMO
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          ID: {tourist.id} • {tourist.nationality}
                        </p>
                      </div>
                      <StatusBadge status={tourist.status} size="sm" showPulse />
                    </div>

                    {/* Safety details */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                          Current Zone
                        </span>
                        <span className="font-bold text-slate-800">{tourist.currentZone} ZONE</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                          Battery Telemetry
                        </span>
                        <span className="font-bold text-slate-800">{tourist.batteryLevel}% (Healthy)</span>
                      </div>
                    </div>

                    {/* Risk score gauge */}
                    <RiskGauge score={tourist.riskScore} size="sm" />

                    {/* Live safety message */}
                    {tourist.safetyMessage && (
                      <div
                        className={`text-xs p-2 rounded-md font-medium border ${
                          tourist.status === 'CRITICAL'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : tourist.status === 'HIGH RISK'
                            ? 'bg-orange-50 text-orange-800 border-orange-200'
                            : tourist.status === 'WARNING'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {tourist.safetyMessage}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => navigate('/tourist')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-2 rounded-lg transition text-center flex items-center justify-center gap-1"
                      >
                        <User className="h-3.5 w-3.5" />
                        <span>View Profile</span>
                      </button>
                      <button
                        onClick={() => navigate('/digital-id')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-1.5 px-2.5 rounded-lg transition border border-slate-200"
                        title="Verifiable Digital ID"
                      >
                        Digital ID
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Legend Overlay */}
      {showControls && (
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/80 shadow-lg max-w-xs text-xs space-y-2.5">
          <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center justify-between">
            <span>Safety Geofence Legend</span>
            <span className="text-[10px] text-slate-400 font-mono">Real-Time</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500/30 border-2 border-emerald-600"></span>
              <span className="text-slate-700 font-medium text-[11px]">
                SAFE ZONE (Promenade & Corridor)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-xs bg-amber-500/30 border-2 border-amber-600 border-dashed"></span>
              <span className="text-slate-700 font-medium text-[11px]">
                WARNING ZONE (Periphery Buffer)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-xs bg-red-500/40 border-2 border-red-600"></span>
              <span className="text-slate-700 font-medium text-[11px]">
                DANGER ZONE (Restricted Tidal Basin)
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-1.5 flex items-center justify-between text-[10px] text-slate-500">
            <span>Primary Marker: <strong>Ananya S.</strong></span>
            <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => focusOnTourist('ST-IND-2026-001')}>
              Locate Target
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
