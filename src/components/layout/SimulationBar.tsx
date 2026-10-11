import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Radio,
  RotateCcw,
  Sparkles,
  Info,
  MapPin,
} from 'lucide-react';
import { useSafetySimulation } from '../../context/SafetySimulationContext';

export const SimulationBar: React.FC = () => {
  const {
    primaryTourist,
    simulationMode,
    setSafeLocation,
    setApproachWarning,
    setEnterDanger,
    setActivateSos,
    resetDemo,
  } = useSafetySimulation();

  return (
    <div className="bg-slate-900 border-b border-slate-800 shadow-md text-white px-4 py-3 sticky top-[41px] z-30">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Left: Simulation Label & Tourist Target Info */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 font-extrabold px-2.5 py-1 rounded-md text-xs tracking-wider flex items-center gap-1.5 uppercase">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              DEMO SIMULATION
            </span>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
              <span className="text-slate-400">Target:</span>
              <strong className="text-white font-medium">Ananya Sharma</strong>
              <span className="font-mono text-slate-400">({primaryTourist.id})</span>
            </div>
          </div>

          {/* Current Live Feedback Text */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-md bg-slate-800/90 border border-slate-700">
            {simulationMode === 'SAFE' && (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                ✓ Tourist is inside a safe zone.
              </span>
            )}
            {simulationMode === 'WARNING' && (
              <span className="text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                ⚠ Tourist approaching caution zone.
              </span>
            )}
            {simulationMode === 'DANGER' && (
              <span className="text-orange-400 flex items-center gap-1.5">
                <AlertOctagon className="h-4 w-4" />
                ⚠ GEO-FENCE BREACH: Tourist entered a restricted area.
              </span>
            )}
            {simulationMode === 'SOS' && (
              <span className="text-red-400 font-bold flex items-center gap-1.5 animate-pulse">
                <Radio className="h-4 w-4" />
                🚨 SOS ACTIVATED: Immediate response required.
              </span>
            )}
          </div>
        </div>

        {/* Right: Simulation Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-center lg:justify-end">
          {/* RESET DEMO */}
          <button
            onClick={resetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition active:scale-95"
            title="Reset simulation to initial baseline state"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>RESET DEMO</span>
          </button>

          {/* SAFE LOCATION */}
          <button
            onClick={setSafeLocation}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 border ${
              simulationMode === 'SAFE'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm shadow-emerald-900/50 ring-2 ring-emerald-500/30'
                : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-800'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>SAFE LOCATION</span>
          </button>

          {/* APPROACH WARNING */}
          <button
            onClick={setApproachWarning}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 border ${
              simulationMode === 'WARNING'
                ? 'bg-amber-600 text-white border-amber-400 shadow-sm shadow-amber-900/50 ring-2 ring-amber-500/30'
                : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-800'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>APPROACH WARNING</span>
          </button>

          {/* ENTER DANGER */}
          <button
            onClick={setEnterDanger}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 border ${
              simulationMode === 'DANGER'
                ? 'bg-orange-600 text-white border-orange-400 shadow-sm shadow-orange-900/50 ring-2 ring-orange-500/30'
                : 'bg-orange-950/80 hover:bg-orange-900 text-orange-300 border-orange-800'
            }`}
          >
            <AlertOctagon className="h-3.5 w-3.5" />
            <span>ENTER DANGER</span>
          </button>

          {/* ACTIVATE SOS */}
          <button
            onClick={setActivateSos}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-extrabold transition active:scale-95 border ${
              simulationMode === 'SOS'
                ? 'bg-red-600 text-white border-red-400 shadow-md shadow-red-900/80 ring-2 ring-red-400 animate-pulse'
                : 'bg-red-950 hover:bg-red-900 text-red-300 border-red-800'
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>ACTIVATE SOS</span>
          </button>
        </div>
      </div>

      {/* Mobile feedback banner */}
      <div className="md:hidden mt-2 pt-2 border-t border-slate-800 text-center text-xs font-semibold">
        {simulationMode === 'SAFE' && (
          <span className="text-emerald-400">✓ Tourist is inside a safe zone.</span>
        )}
        {simulationMode === 'WARNING' && (
          <span className="text-amber-400">⚠ Tourist approaching caution zone.</span>
        )}
        {simulationMode === 'DANGER' && (
          <span className="text-orange-400">⚠ GEO-FENCE BREACH: Tourist entered a restricted area.</span>
        )}
        {simulationMode === 'SOS' && (
          <span className="text-red-400 font-bold">🚨 SOS ACTIVATED: Immediate response required.</span>
        )}
      </div>
    </div>
  );
};
