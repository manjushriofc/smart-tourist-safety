import React from 'react';
import { Cpu, ShieldCheck, AlertTriangle, AlertOctagon, Radio, Info, Layers, CheckCircle2, Sparkles } from 'lucide-react';
import { AiAnalysisDetails } from '../../types';
import { StatusBadge } from './StatusBadge';

interface AiRiskExplainerProps {
  analysis?: AiAnalysisDetails;
  touristName?: string;
  touristId?: string;
}

export const AiRiskExplainer: React.FC<AiRiskExplainerProps> = ({
  analysis,
  touristName = 'Ananya Sharma',
  touristId = 'ST-IND-2026-001',
}) => {
  // Default nominal analysis fallback if analysis is not yet loaded
  const fallbackAnalysis: AiAnalysisDetails = {
    riskScore: 18,
    riskLevel: 'LOW',
    engine: 'Python Scikit-Learn Contextual Ensemble v2.4',
    features: {
      locationRisk: 15.0,
      zoneRisk: 12.0,
      movementAnomaly: 10.0,
      timeRisk: 40.0,
      previousIncidents: 0,
      distanceRisk: 15.0,
      sosSignal: 0,
    },
    factors: [
      {
        factor: 'Safe Corridor Compliance',
        impact: 65,
        description: 'Tourist is fully compliant within verified CCTV & Police patrol zone.',
      },
      {
        factor: 'Safe Haven Proximity',
        impact: 25,
        description: 'Less than 150m from Heritage Promenade Tourist Police Post A.',
      },
    ],
    recommendation: '✓ NOMINAL: Continue routine telemetry monitoring. No operational intervention required.',
  };

  const current = analysis || fallbackAnalysis;
  const isCritical = current.riskLevel === 'CRITICAL';
  const isHigh = current.riskLevel === 'HIGH';
  const isMedium = current.riskLevel === 'MEDIUM';

  const getScoreColor = () => {
    if (isCritical) return 'text-red-700 bg-red-50 border-red-200';
    if (isHigh) return 'text-orange-700 bg-orange-50 border-orange-200';
    if (isMedium) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  };

  const getMeterColor = () => {
    if (isCritical) return 'bg-red-600';
    if (isHigh) return 'bg-orange-600';
    if (isMedium) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200/60 shadow-xs">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                AI Contextual Safety Risk Engine
              </h3>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded">
                ML ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Subject: <strong>{touristName}</strong> ({touristId}) • Explainable Feature Vector
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            {current.engine}
          </span>
        </div>
      </div>

      {/* Main Score & Risk Tier Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50/70 p-4 rounded-xl border border-slate-100">
        {/* Score Circle / Box */}
        <div className="md:col-span-4 flex items-center gap-4">
          <div
            className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border shadow-xs ${getScoreColor()}`}
          >
            <span className="text-2xl font-black tracking-tight">{current.riskScore}%</span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider">RISK INDEX</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Evaluated Tier
            </span>
            <StatusBadge status={current.riskLevel} size="md" showPulse />
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              0–30 Low • 31–60 Med • 61–80 High • 81–100 Crit
            </p>
          </div>
        </div>

        {/* Feature Meter Bar */}
        <div className="md:col-span-8 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Overall Contextual Hazard Intensity</span>
            <span className="font-mono font-bold text-slate-900">{current.riskScore} / 100</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out rounded-full ${getMeterColor()}`}
              style={{ width: `${current.riskScore}%` }}
            />
          </div>
          {current.features && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 pt-1 text-[10px] font-mono text-slate-500">
              <div>Zone: <strong className="text-slate-700">{current.features.zoneRisk}</strong></div>
              <div>Loc: <strong className="text-slate-700">{current.features.locationRisk}</strong></div>
              <div>Move: <strong className="text-slate-700">{current.features.movementAnomaly}</strong></div>
              <div>Time: <strong className="text-slate-700">{current.features.timeRisk}</strong></div>
              <div>Dist: <strong className="text-slate-700">{current.features.distanceRisk}</strong></div>
              <div>SOS: <strong className="text-slate-700">{current.features.sosSignal}</strong></div>
            </div>
          )}
        </div>
      </div>

      {/* Contributing Factors Breakdown (Visual Bars) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Contributing Safety Factors (Explainable Breakdown)
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            {current.factors.length} active weights
          </span>
        </div>

        <div className="space-y-2.5">
          {current.factors.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>{item.factor}</span>
                </span>
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  Impact: {item.impact}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${item.impact}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Operator Recommendation */}
      <div
        className={`p-4 rounded-xl border space-y-1 text-xs ${
          isCritical
            ? 'bg-red-50 border-red-200 text-red-950'
            : isHigh
            ? 'bg-orange-50 border-orange-200 text-orange-950'
            : isMedium
            ? 'bg-amber-50 border-amber-200 text-amber-950'
            : 'bg-emerald-50 border-emerald-200 text-emerald-950'
        }`}
      >
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-[11px]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Tactical Safety Recommendation</span>
        </div>
        <p className="font-semibold text-xs leading-relaxed">
          {current.recommendation}
        </p>
      </div>

      {/* Required framing note */}
      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
        <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span>
          AI contextual safety analysis evaluates environmental hazards, geofence compliance, and movement patterns for civil protection.
        </span>
      </div>
    </div>
  );
};
