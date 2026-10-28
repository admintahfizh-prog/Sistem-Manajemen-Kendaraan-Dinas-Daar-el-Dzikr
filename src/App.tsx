/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CoordinatorPinModal } from './components/CoordinatorPinModal';
import { PrintModal } from './components/PrintModal';
import { PanelLeftOpen } from 'lucide-react';

import { DashboardView } from './views/DashboardView';
import { ArmadaView } from './views/ArmadaView';
import { BookingView } from './views/BookingView';
import { CoordinatorAccView } from './views/CoordinatorAccView';
import { PengambilanView } from './views/PengambilanView';
import { PengembalianView } from './views/PengembalianView';
import { InfaqView } from './views/InfaqView';
import { SopView } from './views/SopView';
import { LogoUploadView } from './views/LogoUploadView';
import { PetunjukPenggunaanView } from './views/PetunjukPenggunaanView';

const MainContent: React.FC = () => {
  const { activeTab, sidebarCollapsed, setSidebarCollapsed } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'armada':
        return <ArmadaView />;
      case 'booking':
        return <BookingView />;
      case 'acc-coordinator':
        return <CoordinatorAccView />;
      case 'pengambilan':
        return <PengambilanView />;
      case 'pengembalian':
        return <PengembalianView />;
      case 'infaq':
        return <InfaqView />;
      case 'sop':
        return <SopView />;
      case 'logo-sekolah':
        return <LogoUploadView />;
      case 'petunjuk':
        return <PetunjukPenggunaanView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row font-sans text-slate-900 overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating Quick Restore Sidebar Button (visible on desktop when sidebar is hidden) */}
      {sidebarCollapsed && (
        <button
          type="button"
          onClick={() => setSidebarCollapsed(false)}
          className="hidden lg:flex fixed bottom-5 left-5 z-30 items-center gap-2 px-3.5 py-2 bg-slate-900/95 hover:bg-slate-900 text-white border border-slate-700/80 rounded-xl shadow-lg text-xs font-semibold backdrop-blur-xs transition-all hover:scale-105 group"
          title="Tampilkan Menu Sidebar"
        >
          <PanelLeftOpen className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>Buka Menu Sidebar</span>
        </button>
      )}

      {/* Security Modals & Print Handlers */}
      <CoordinatorPinModal />
      <PrintModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
