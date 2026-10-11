import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Activity,
  ShieldCheck,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { useSafetySimulation } from '../context/SafetySimulationContext';
import { StatCard } from '../components/ui/StatCard';

export const AnalyticsPage: React.FC = () => {
  const { kpiStats } = useSafetySimulation();

  // Hourly safety trajectory
  const hourlySafetyData = [
    { time: '06:00', safeScore: 98, activeTourists: 42, incidents: 0 },
    { time: '08:00', safeScore: 96, activeTourists: 78, incidents: 1 },
    { time: '10:00', safeScore: 93, activeTourists: 110, incidents: 2 },
    { time: '12:00', safeScore: 89, activeTourists: 128, incidents: 4 },
    { time: '14:00', safeScore: 91, activeTourists: 124, incidents: 3 },
    { time: '16:00', safeScore: 88, activeTourists: 135, incidents: 5 },
    { time: '18:00', safeScore: 84, activeTourists: 120, incidents: 6 },
    { time: '20:00', safeScore: 82, activeTourists: 95, incidents: 4 },
  ];

  // Incidents classification
  const incidentTypeData = [
    { type: 'Geofence Breach', count: 18, fill: '#ea580c' },
    { type: 'Caution Warning', count: 42, fill: '#d97706' },
    { type: 'SOS Panic Alarm', count: 4, fill: '#dc2626' },
    { type: 'Biometric Alert', count: 9, fill: '#3b82f6' },
    { type: 'Route Deviation', count: 14, fill: '#8b5cf6' },
  ];

  // Zone occupancy
  const zoneOccupancyData = [
    { name: 'Safe Zone (Promenade)', value: 96, color: '#16a34a' },
    { name: 'Warning Zone (Buffer)', value: 24, color: '#d97706' },
    { name: 'Danger Zone (Restricted)', value: 8, color: '#dc2626' },
  ];

  // Response latency SLA
  const responseTimeData = [
    { unit: 'Patrol 12', responseTime: 2.8, target: 4.0 },
    { unit: 'Med-Evac 03', responseTime: 4.2, target: 5.0 },
    { unit: 'Coast Guard 01', responseTime: 3.6, target: 6.0 },
    { unit: 'Drone Alpha', responseTime: 1.1, target: 2.0 },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
              Civil Protection Telemetry Intelligence
            </span>
            <span className="text-xs text-slate-500 font-mono">Aggregation Period: 24h Real-Time</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            SAFETY & RISK TELEMETRY ANALYTICS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quantitative assessment of sector safety indices, geofence compliance curves, and emergency QRF response times.
          </p>
        </div>

        <button
          onClick={() => alert('Analytics export report (PDF/CSV) generated for Sector 4.')}
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs shrink-0"
        >
          <Download className="h-4 w-4" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Sector Safety Index"
          value="94.2%"
          subtitle="Nominal threshold: >90%"
          icon={<ShieldCheck className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="Avg Dispatch Latency"
          value="3.4 min"
          subtitle="Target SLA: <5.0 min"
          icon={<Clock className="h-5 w-5" />}
          variant="primary"
        />
        <StatCard
          title="Geofence Compliance"
          value="93.8%"
          subtitle="120 of 128 compliant"
          icon={<MapPin className="h-5 w-5" />}
          variant="warning"
        />
        <StatCard
          title="SOS Distress Triage"
          value="100%"
          subtitle="0 unaddressed alerts"
          icon={<Activity className="h-5 w-5" />}
          variant="critical"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: 24h Safety Trajectory Curve (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Hourly Sector Safety Index vs Active Tourists
              </h3>
              <p className="text-xs text-slate-500">Live 12-hour historical trend</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              High Operational Readiness
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlySafetyData}>
                <defs>
                  <linearGradient id="safetyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="touristGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area
                  type="monotone"
                  dataKey="safeScore"
                  name="Safety Score %"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#safetyGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="activeTourists"
                  name="Active Tourists"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#touristGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Zone Occupancy Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Zone Occupancy Ratio</h3>
            <p className="text-xs text-slate-500">Live distribution across zones</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={zoneOccupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {zoneOccupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {zoneOccupancyData.map(z => (
              <div key={z.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: z.color }}></span>
                  <span>{z.name}</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{z.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Incident Classification & Responder Unit Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Classification Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">
            Monthly Incident Breakdown by Category
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="type" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" name="Logged Events" radius={[6, 6, 0, 0]}>
                  {incidentTypeData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* QRF Response Times vs SLA Targets */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">
            QRF Dispatch Response Latency (Minutes) vs SLA Target
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="unit" type="category" stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="responseTime" name="Actual Response (min)" fill="#2563eb" radius={[0, 4, 4, 0]} />
                <Bar dataKey="target" name="SLA Target (min)" fill="#94a3b8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
