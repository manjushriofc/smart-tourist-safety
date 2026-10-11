import React from 'react';
import { Shield, ShieldAlert, Lock, Radio, FileText, ExternalLink, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      {/* Safety Notice / Fictional disclaimer callout */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-3 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-slate-400">
          <Shield className="h-4 w-4 text-blue-400 shrink-0" />
          <p className="text-[11px] leading-relaxed">
            <strong className="text-slate-200">Prototype Disclaimer:</strong> Fictional demonstration environment.
            Restricted zones, tourist identities, and telemetry data displayed in this application are simulated for system evaluation and do not represent real-world government-designated restricted areas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldAlert className="h-5 w-5 text-blue-500" />
              <span>Smart Tourist Safety Platform</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrated real-time geofencing, IoT telemetry, verifiable digital credentials, and emergency response operations for tourist civil protection.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Command Mesh v2.4 Active</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Command Modules</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/admin" className="hover:text-white transition">
                  Safety Command Center
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition">
                  Live Safety Geofence Map
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-white transition">
                  Emergency SOS Dispatch Desk
                </Link>
              </li>
              <li>
                <Link to="/incidents" className="hover:text-white transition">
                  Incident Log & Triage
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Tourist Services</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/tourist" className="hover:text-white transition">
                  Tourist Safety Dashboard
                </Link>
              </li>
              <li>
                <Link to="/digital-id" className="hover:text-white transition">
                  Verifiable Digital ID & KYC
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-white transition">
                  Telemetry & Safety Analytics
                </Link>
              </li>
              <li>
                <Link to="/audit-ledger" className="hover:text-white transition">
                  Immutable Audit Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Emergency Helplines</h4>
            <div className="space-y-1.5 text-xs">
              <p className="flex justify-between border-b border-slate-800 pb-1">
                <span>Tourist Police Helpline:</span>
                <strong className="text-white font-mono">1363 / 112</strong>
              </p>
              <p className="flex justify-between border-b border-slate-800 pb-1">
                <span>Medical Emergency:</span>
                <strong className="text-white font-mono">108</strong>
              </p>
              <p className="flex justify-between border-b border-slate-800 pb-1">
                <span>Coast Guard Search & Rescue:</span>
                <strong className="text-white font-mono">1554</strong>
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                24/7 Multi-lingual assistance enabled.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Smart Tourist Safety & Incident Management Initiative. Phase 1 Prototype.</p>
          <div className="flex items-center gap-4">
            <span>Built with React + Vite + Leaflet</span>
            <span>•</span>
            <span className="text-slate-400">Enterprise Gov Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
