import React from 'react';
import { TouristStatus, ZoneType, IncidentSeverity, IncidentStatus } from '../../types';

interface StatusBadgeProps {
  status: TouristStatus | ZoneType | IncidentSeverity | IncidentStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showPulse = false,
}) => {
  const normalized = (status || '').toUpperCase();

  const getStyle = () => {
    switch (normalized) {
      case 'SAFE':
      case 'RESOLVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20';
      case 'WARNING':
      case 'MEDIUM':
      case 'ACKNOWLEDGED':
        return 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-600/20';
      case 'HIGH RISK':
      case 'HIGH':
      case 'DANGER':
        return 'bg-orange-50 text-orange-800 border-orange-200 ring-orange-600/20';
      case 'CRITICAL':
      case 'RESTRICTED':
      case 'ACTIVE':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20';
      case 'OPEN':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20';
      case 'INVESTIGATING':
      case 'DISPATCHED':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDotColor = () => {
    switch (normalized) {
      case 'SAFE':
      case 'RESOLVED':
        return 'bg-emerald-500';
      case 'WARNING':
      case 'MEDIUM':
      case 'ACKNOWLEDGED':
        return 'bg-amber-500';
      case 'HIGH RISK':
      case 'HIGH':
      case 'DANGER':
        return 'bg-orange-600';
      case 'CRITICAL':
      case 'RESTRICTED':
      case 'ACTIVE':
        return 'bg-rose-600';
      case 'OPEN':
        return 'bg-rose-500';
      case 'INVESTIGATING':
      case 'DISPATCHED':
        return 'bg-blue-500';
      default:
        return 'bg-slate-500';
    }
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 font-bold tracking-wider',
  };

  const isCritical = normalized === 'CRITICAL' || (normalized === 'HIGH RISK' && showPulse) || normalized === 'ACTIVE';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs ${getStyle()} ${sizeClasses[size]}`}
    >
      <span className="relative flex h-2 w-2">
        {isCritical && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getDotColor()}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${getDotColor()}`} />
      </span>
      <span>{normalized}</span>
    </span>
  );
};
