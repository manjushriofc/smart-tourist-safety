import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, AlertOctagon, Radio, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSafetySimulation } from '../../context/SafetySimulationContext';

export const AlertBanner: React.FC = () => {
  const { simulationMode, primaryTourist } = useSafetySimulation();

  if (simulationMode === 'SAFE') {
    return null;
  }

  return (
    <div
      className={`py-2 px-4 text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm ${
        simulationMode === 'SOS'
          ? 'bg-red-600 text-white animate-pulse'
          : simulationMode === 'DANGER'
          ? 'bg-orange-600 text-white'
          : 'bg-amber-500 text-slate-950'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          {simulationMode === 'SOS' ? (
            <Radio className="h-5 w-5 shrink-0 animate-spin" />
          ) : simulationMode === 'DANGER' ? (
            <AlertOctagon className="h-5 w-5 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0 text-slate-950" />
          )}
          <span>
            {simulationMode === 'SOS' && (
              <>
                <strong className="font-extrabold tracking-wide uppercase">🚨 CRITICAL EMERGENCY:</strong>{' '}
                SOS Signal activated for <strong>{primaryTourist.name}</strong> ({primaryTourist.id}) in Restricted Danger Zone.
              </>
            )}
            {simulationMode === 'DANGER' && (
              <>
                <strong className="font-extrabold tracking-wide uppercase">⚠ GEOFENCE BREACH:</strong>{' '}
                Tourist <strong>{primaryTourist.name}</strong> ({primaryTourist.id}) entered High-Risk Restricted Tidal Zone (Risk {primaryTourist.riskScore}%).
              </>
            )}
            {simulationMode === 'WARNING' && (
              <>
                <strong className="font-extrabold tracking-wide uppercase">⚠ CAUTION ADVISORY:</strong>{' '}
                Tourist <strong>{primaryTourist.name}</strong> is approaching the Coastal Buffer Warning Zone.
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={simulationMode === 'SOS' ? '/emergency' : '/map'}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition shadow-xs ${
              simulationMode === 'WARNING'
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-white text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{simulationMode === 'SOS' ? 'Open Incident Dispatch' : 'Track on Map'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
