import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SafetySimulationProvider } from './context/SafetySimulationContext';
import { Navbar } from './components/layout/Navbar';
import { SimulationBar } from './components/layout/SimulationBar';
import { AlertBanner } from './components/layout/AlertBanner';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { TouristDashboard } from './pages/TouristDashboard';
import { SafetyMapPage } from './pages/SafetyMapPage';
import { DigitalIdPage } from './pages/DigitalIdPage';
import { EmergencySosPage } from './pages/EmergencySosPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditLedgerPage } from './pages/AuditLedgerPage';

export const AppContent: React.FC = () => {
  const [isSimulationOpen, setIsSimulationOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      {/* Top Navbar with live telemetry */}
      <Navbar
        onToggleSimulation={() => setIsSimulationOpen(!isSimulationOpen)}
        isSimulationOpen={isSimulationOpen}
      />

      {/* Persistent DEMO SIMULATION Action Panel */}
      {isSimulationOpen && <SimulationBar />}

      {/* Global Alert Notification Banner */}
      <AlertBanner />

      {/* Main Page Route Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/tourist" element={<TouristDashboard />} />
          <Route path="/map" element={<SafetyMapPage />} />
          <Route path="/digital-id" element={<DigitalIdPage />} />
          <Route path="/emergency" element={<EmergencySosPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/audit-ledger" element={<AuditLedgerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer with safety disclaimers */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SafetySimulationProvider>
      <Router>
        <AppContent />
      </Router>
    </SafetySimulationProvider>
  );
};

export default App;
