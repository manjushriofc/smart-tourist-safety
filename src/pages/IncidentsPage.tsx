import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  AlertOctagon,
  Radio,
  Clock,
  CheckCircle2,
  Plus,
  Eye,
  ShieldAlert,
  Send,
  MapPin,
  Check,
  User,
  RadioTower,
} from 'lucide-react';
import { useSafetySimulation } from '../context/SafetySimulationContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { Incident, IncidentSeverity, IncidentStatus } from '../types';

export const IncidentsPage: React.FC = () => {
  const { incidents, acknowledgeIncident, dispatchIncident, resolveIncident, addIncident } =
    useSafetySimulation();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New incident form state
  const [newTouristId, setNewTouristId] = useState('ST-IND-2026-001');
  const [newTouristName, setNewTouristName] = useState('Ananya Sharma');
  const [newType, setNewType] = useState('GEO-FENCE BREACH');
  const [newSeverity, setNewSeverity] = useState<IncidentSeverity>('HIGH');
  const [newZone, setNewZone] = useState('Restricted Tidal Basin');
  const [newDescription, setNewDescription] = useState('');

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch =
      searchQuery === '' ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.touristName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.touristId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      inc.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim()) return;

    await addIncident({
      touristId: newTouristId,
      touristName: newTouristName,
      type: newType,
      severity: newSeverity,
      status: 'ACTIVE',
      zone: newZone,
      description: newDescription,
      coordinates: [15.5080, 73.8500],
      assignedUnit: 'Tourist Police Patrol 12',
    });

    setIsAddModalOpen(false);
    setNewDescription('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
              Audit & Safety Dispatch Register
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Total Logged: <strong>{incidents.length} events</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            INCIDENT LOG & TRIAGE REPOSITORY
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time incident management with status lifecycle: <strong>ACTIVE</strong> → <strong>ACKNOWLEDGED</strong> → <strong>DISPATCHED</strong> → <strong>RESOLVED</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Log Manual Incident</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-6 relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by incident ID, tourist name, type, or keyword..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Severity Filters */}
          <div className="sm:col-span-3 flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Severity:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`text-[10px] font-bold px-2 py-1 rounded transition ${
                  severityFilter === sev
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="sm:col-span-3 flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Status:</span>
            {['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'DISPATCHED', 'RESOLVED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-[10px] font-bold px-2 py-1 rounded transition ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incidents Table / Cards List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
              <tr>
                <th className="px-5 py-3">Incident ID</th>
                <th className="px-5 py-3">Tourist Profile</th>
                <th className="px-5 py-3">Type & Hazard</th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Assigned Unit</th>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400 text-xs">
                    No incidents match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map(incident => {
                  const isCritical = incident.severity === 'CRITICAL';
                  const isActive = incident.status === 'ACTIVE' || incident.status === 'OPEN';
                  const isAck = incident.status === 'ACKNOWLEDGED';
                  const isDisp = incident.status === 'DISPATCHED';
                  const isResolved = incident.status === 'RESOLVED';

                  return (
                    <tr
                      key={incident.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCritical ? 'bg-red-50/20' : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                        {incident.id}
                      </td>

                      {/* Tourist */}
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{incident.touristName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{incident.touristId}</div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-800">{incident.type}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{incident.description}</div>
                      </td>

                      {/* Severity */}
                      <td className="px-5 py-3.5">
                        <StatusBadge status={incident.severity} size="sm" showPulse />
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <StatusBadge status={incident.status} size="sm" />
                      </td>

                      {/* Assigned Unit */}
                      <td className="px-5 py-3.5 text-slate-700 font-medium max-w-xs truncate">
                        {incident.assignedUnit || 'Unassigned'}
                      </td>

                      {/* Timestamp */}
                      <td className="px-5 py-3.5 font-mono text-slate-500 text-[11px]">
                        {incident.timestamp}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {isActive && (
                          <button
                            onClick={() => acknowledgeIncident(incident.id)}
                            className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold transition text-[11px]"
                            title="Mark as Acknowledged"
                          >
                            ACKNOWLEDGE
                          </button>
                        )}

                        {!isDisp && !isResolved && (
                          <button
                            onClick={() => dispatchIncident(incident.id, 'Tourist Police Patrol 12')}
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold transition text-[11px]"
                            title="Dispatch QRF Unit"
                          >
                            DISPATCH
                          </button>
                        )}

                        {!isResolved && (
                          <button
                            onClick={() => resolveIncident(incident.id)}
                            className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold transition text-[11px]"
                            title="Resolve Incident"
                          >
                            RESOLVE
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedIncident(incident)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition text-[11px]"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Incident Modal */}
      {selectedIncident && (
        <Modal
          isOpen={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
          title={`Incident Record: ${selectedIncident.id}`}
          subtitle={`Logged on ${selectedIncident.timestamp}`}
          footer={
            <div className="flex items-center gap-2">
              {selectedIncident.status === 'ACTIVE' && (
                <button
                  onClick={() => {
                    acknowledgeIncident(selectedIncident.id);
                    setSelectedIncident(null);
                  }}
                  className="px-3 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
                >
                  ACKNOWLEDGE
                </button>
              )}
              {selectedIncident.status !== 'DISPATCHED' && selectedIncident.status !== 'RESOLVED' && (
                <button
                  onClick={() => {
                    dispatchIncident(selectedIncident.id, 'Tourist Police Patrol 12');
                    setSelectedIncident(null);
                  }}
                  className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                >
                  DISPATCH
                </button>
              )}
              {selectedIncident.status !== 'RESOLVED' && (
                <button
                  onClick={() => {
                    resolveIncident(selectedIncident.id);
                    setSelectedIncident(null);
                  }}
                  className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>RESOLVE</span>
                </button>
              )}
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Tourist Profile</span>
                <span className="font-bold text-slate-900">{selectedIncident.touristName}</span>
                <span className="text-slate-500 font-mono block">{selectedIncident.touristId}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Severity & Status</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <StatusBadge status={selectedIncident.severity} size="sm" showPulse />
                  <StatusBadge status={selectedIncident.status} size="sm" />
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Zone Location</span>
                <span className="font-bold text-slate-800">{selectedIncident.zone}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Assigned Unit</span>
                <span className="font-bold text-blue-700">{selectedIncident.assignedUnit || 'None'}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-1">Incident Telemetry Description</h4>
              <p className="p-3 bg-white border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
                {selectedIncident.description}
              </p>
            </div>

            {selectedIncident.actionLog && (
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Operational Action Trail</h4>
                <div className="space-y-1 font-mono">
                  {selectedIncident.actionLog.map((log, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between gap-2">
                      <span className="text-slate-500">[{log.time}]</span>
                      <span className="text-slate-800 flex-1">{log.action}</span>
                      <span className="text-slate-500 text-[10px]">{log.agent}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Manual Incident Creation Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Manual Security / Hazard Incident"
        subtitle="Operational Field Report Entry"
        footer={
          <>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateIncident}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" />
              <span>Submit & Dispatch</span>
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateIncident} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tourist ID</label>
              <input
                type="text"
                value={newTouristId}
                onChange={e => setNewTouristId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tourist Name</label>
              <input
                type="text"
                value={newTouristName}
                onChange={e => setNewTouristName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Incident Type</label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              >
                <option value="GEO-FENCE BREACH">GEO-FENCE BREACH</option>
                <option value="SOS_ACTIVATED">SOS ACTIVATED</option>
                <option value="MEDICAL DISTRESS">MEDICAL DISTRESS</option>
                <option value="LOST ROUTE DEVIATION">LOST ROUTE DEVIATION</option>
                <option value="CURFEW VIOLATION">CURFEW VIOLATION</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Severity</label>
              <select
                value={newSeverity}
                onChange={e => setNewSeverity(e.target.value as IncidentSeverity)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Zone Location</label>
            <input
              type="text"
              value={newZone}
              onChange={e => setNewZone(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Description</label>
            <textarea
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              rows={3}
              placeholder="Describe incident narrative..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
