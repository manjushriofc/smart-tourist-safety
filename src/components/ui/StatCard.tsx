import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'critical' | 'primary';
  onClick?: () => void;
  badgeText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  onClick,
  badgeText,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          border: 'border-emerald-200 hover:border-emerald-300',
          bg: 'bg-white',
          valueColor: 'text-emerald-700',
          iconBg: 'bg-emerald-50 text-emerald-600',
          accent: 'bg-emerald-500',
        };
      case 'warning':
        return {
          border: 'border-amber-200 hover:border-amber-300',
          bg: 'bg-white',
          valueColor: 'text-amber-700',
          iconBg: 'bg-amber-50 text-amber-600',
          accent: 'bg-amber-500',
        };
      case 'danger':
        return {
          border: 'border-orange-200 hover:border-orange-300',
          bg: 'bg-white',
          valueColor: 'text-orange-700',
          iconBg: 'bg-orange-50 text-orange-600',
          accent: 'bg-orange-500',
        };
      case 'critical':
        return {
          border: 'border-red-300 hover:border-red-400 ring-1 ring-red-100',
          bg: 'bg-red-50/40',
          valueColor: 'text-red-700',
          iconBg: 'bg-red-100 text-red-700',
          accent: 'bg-red-600',
        };
      case 'primary':
        return {
          border: 'border-blue-200 hover:border-blue-300',
          bg: 'bg-white',
          valueColor: 'text-blue-700',
          iconBg: 'bg-blue-50 text-blue-600',
          accent: 'bg-blue-600',
        };
      default:
        return {
          border: 'border-slate-200 hover:border-slate-300',
          bg: 'bg-white',
          valueColor: 'text-slate-900',
          iconBg: 'bg-slate-100 text-slate-700',
          accent: 'bg-slate-800',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border ${styles.border} ${styles.bg} p-5 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${styles.accent}`} />
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold tracking-tight ${styles.valueColor}`}>
              {value}
            </span>
            {badgeText && (
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`p-2.5 rounded-lg ${styles.iconBg} shrink-0`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
