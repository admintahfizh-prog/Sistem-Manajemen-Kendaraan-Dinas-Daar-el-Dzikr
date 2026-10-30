/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  PlusCircle,
  Shield,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Database,
} from 'lucide-react';
import { NotificationPopover } from './NotificationPopover';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const {
    activeTab,
    setActiveTab,
    isCoordinator,
    setCoordinatorPinModalOpen,
    logoutCoordinator,
    sidebarCollapsed,
    toggleSidebar,
    isFirestoreConnected,
    firestoreSyncStatus,
  } = useApp();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard & Status Armada';
      case 'armada':
        return 'Daftar Armada Kendaraan Dinas';
      case 'booking':
        return 'Booking Jadwal Hari & Jam';
      case 'acc-coordinator':
        return 'Otorisasi & ACC Koordinator';
      case 'pengambilan':
        return 'Berita Acara Pengambilan (Check-out)';
      case 'pengembalian':
        return 'Berita Acara Pengembalian (Check-in)';
      case 'infaq':
        return 'Rekapitulasi Infaq & Pemakaian Pribadi';
      case 'keuangan-armada':
        return 'Buku Kas & Saldo Armada (Pemasukan & Pengeluaran)';
      case 'sop':
        return 'SOP & Klausul Penggunaan Kendaraan';
      case 'settings':
        return 'Pengaturan & Otorisasi Koordinator';
      case 'edit-klausul':
        return 'Edit Klausul SOP (Koordinator)';
      case 'edit-rekening':
        return 'Edit Data Rekening & Infaq';
      case 'logo-sekolah':
        return 'Upload Logo & Pengaturan Sarpras';
      case 'petunjuk':
        return 'Petunjuk Penggunaan Sistem';
      default:
        return 'Kendaraan Yayasan';
    }
  };

  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="h-16 px-4 md:px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Zone 1: Toggle Sidebar (Mobile + Desktop) + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Toggle Button (Hide / Show) */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-xl border transition-all text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          title={sidebarCollapsed ? 'Tampilkan Menu Sidebar' : 'Sembunyikan Menu Sidebar'}
          aria-label="Toggle Sidebar"
        >
          {sidebarCollapsed ? (
            <>
              <PanelLeftOpen className="w-4 h-4 text-emerald-700" />
              <span className="text-[11px] font-semibold text-emerald-800">Tampilkan Menu</span>
            </>
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 text-slate-500" />
              <span className="text-[11px] font-medium text-slate-600">Sembunyikan Menu</span>
            </>
          )}
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Daar el Dzikr</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-800 font-medium truncate">{getTabTitle()}</span>
          </div>
          <h2 className="text-sm md:text-base font-bold text-slate-900 truncate">
            {getTabTitle()}
          </h2>
        </div>
      </div>

      {/* Zone 2: Date, Firebase Status & Mode Switcher */}
      <div className="hidden md:flex items-center gap-3 text-xs">
        {/* Firestore Database Live Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
            isFirestoreConnected
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : firestoreSyncStatus === 'error'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
          title="Sinkronisasi Data Realtime Firebase Firestore"
        >
          <Database className={`w-3.5 h-3.5 ${isFirestoreConnected ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>Firebase</span>
          <span className="relative flex h-2 w-2">
            {isFirestoreConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isFirestoreConnected
                  ? 'bg-emerald-500'
                  : firestoreSyncStatus === 'error'
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
            ></span>
          </span>
          <span className="text-[10px] font-semibold">
            {isFirestoreConnected ? 'Live' : 'Sync'}
          </span>
        </div>

        <div className="text-slate-500 tabular-nums">
          {currentDateFormatted}
        </div>

        {isCoordinator ? (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Akun: Koordinator Sarpras</span>
            <button
              type="button"
              onClick={logoutCoordinator}
              className="text-xs text-rose-600 hover:underline ml-1 font-semibold"
            >
              (Keluar)
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCoordinatorPinModalOpen(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors font-medium"
          >
            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Mode Tamu / Guru</span>
            <span className="text-[11px] text-emerald-700 font-semibold underline ml-0.5">
              Masuk Koordinator
            </span>
          </button>
        )}
      </div>

      {/* Zone 3: Notification Bell & Primary Action CTA */}
      <div className="flex items-center gap-2 shrink-0">
        <NotificationPopover />

        <button
          type="button"
          onClick={() => setActiveTab('booking')}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Pesan Booking</span>
          <span className="sm:hidden">Booking</span>
        </button>
      </div>
    </header>
  );
};
