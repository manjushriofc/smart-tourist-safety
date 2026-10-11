import React from 'react';

interface RiskGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const clampedScore = Math.max(0, Math.min(100, score));

  const getColor = (val: number) => {
    if (val <= 30) return { bg: 'bg-emerald-500', text: 'text-emerald-700', label: 'LOW RISK' };
    if (val <= 60) return { bg: 'bg-amber-500', text: 'text-amber-700', label: 'MODERATE RISK' };
    if (val <= 85) return { bg: 'bg-orange-600', text: 'text-orange-700', label: 'HIGH RISK' };
    return { bg: 'bg-red-600', text: 'text-red-700', label: 'CRITICAL HAZARD' };
  };

  const { bg, text, label } = getColor(clampedScore);

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">Risk Score Telemetry</span>
          <span className={`font-bold ${text}`}>
            {clampedScore}% • {label}
          </span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 ${heightClasses[size]}`}>
        <div
          className={`${bg} h-full transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${clampedScore}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 font-mono px-0.5">
        <span>0 (Safe)</span>
        <span>50 (Warning)</span>
        <span>100 (Critical)</span>
      </div>
    </div>
  );
};
