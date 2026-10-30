/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp, NavTab } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarDays,
  KeyRound,
  HeartHandshake,
  ShieldCheck,
  Menu,
  Lock,
} from 'lucide-react';

interface BottomNavProps {
  onOpenMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenMenu }) => {
  const {
    activeTab,
    setActiveTab,
    bookings,
    isCoordinator,
    setCoordinatorPinModalOpen,
  } = useApp();

  const pendingAccCount = bookings.filter((b) => b.status === 'Menunggu ACC').length;
  const readyToPickupCount = bookings.filter((b) => b.status === 'Disetujui' && !b.handoverIn).length;
  const inTripCount = bookings.filter((b) => b.status === 'Sedang Berjalan' && !b.handoverReturn).length;
  const totalBastPending = readyToPickupCount + inTripCount;

  const handleTabClick = (tabId: NavTab, requiresPin = false) => {
    if (requiresPin && !isCoordinator) {
      setCoordinatorPinModalOpen(true);
      return;
    }
    setActiveTab(tabId);
  };

  const isBastActive = activeTab === 'pengambilan' || activeTab === 'pengembalian';
  const isCoordinatorActive =
    activeTab === 'settings' ||
    activeTab === 'acc-coordinator' ||
    activeTab === 'edit-klausul' ||
    activeTab === 'edit-rekening' ||
    activeTab === 'logo-sekolah' ||
    activeTab === 'keuangan-armada' ||
    activeTab === 'armada';

  return (
    <nav
      aria-label="Navigasi Bawah Mobile"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-1 py-1 safe-bottom"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Beranda */}
        <button
          type="button"
          onClick={() => handleTabClick('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] rounded-xl transition-all relative ${
            activeTab === 'dashboard'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-transform ${
              activeTab === 'dashboard' ? 'bg-emerald-100 scale-110' : ''
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-tight mt-0.5 tracking-tight">Beranda</span>
          {activeTab === 'dashboard' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 absolute -bottom-0.5" />
          )}
        </button>

        {/* 2. Booking */}
        <button
          type="button"
          onClick={() => handleTabClick('booking')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] rounded-xl transition-all relative ${
            activeTab === 'booking'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-transform ${
              activeTab === 'booking' ? 'bg-emerald-100 scale-110' : ''
            }`}
          >
            <CalendarDays className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-tight mt-0.5 tracking-tight">Booking</span>
          {activeTab === 'booking' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 absolute -bottom-0.5" />
          )}
        </button>

        {/* 3. BAST Serah Terima */}
        <button
          type="button"
          onClick={() => handleTabClick('pengambilan')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] rounded-xl transition-all relative ${
            isBastActive
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className="relative">
            <div
              className={`p-1 rounded-xl transition-transform ${
                isBastActive ? 'bg-emerald-100 scale-110' : ''
              }`}
            >
              <KeyRound className="w-5 h-5" />
            </div>
            {totalBastPending > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white tabular-nums">
                {totalBastPending}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-tight mt-0.5 tracking-tight">BAST</span>
          {isBastActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 absolute -bottom-0.5" />
          )}
        </button>

        {/* 4. Infaq */}
        <button
          type="button"
          onClick={() => handleTabClick('infaq')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] rounded-xl transition-all relative ${
            activeTab === 'infaq'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-transform ${
              activeTab === 'infaq' ? 'bg-emerald-100 scale-110' : ''
            }`}
          >
            <HeartHandshake className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-tight mt-0.5 tracking-tight">Infaq</span>
          {activeTab === 'infaq' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 absolute -bottom-0.5" />
          )}
        </button>

        {/* 5. Koordinator */}
        <button
          type="button"
          onClick={() => handleTabClick('settings', true)}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] rounded-xl transition-all relative ${
            isCoordinatorActive
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className="relative">
            <div
              className={`p-1 rounded-xl transition-transform ${
                isCoordinatorActive ? 'bg-emerald-100 scale-110' : ''
              }`}
            >
              {isCoordinator ? (
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            {pendingAccCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white tabular-nums animate-pulse">
                {pendingAccCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-tight mt-0.5 tracking-tight">
            {isCoordinator ? 'Koordinator' : 'PIN PJ'}
          </span>
          {isCoordinatorActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 absolute -bottom-0.5" />
          )}
        </button>

        {/* 6. More / Drawer Menu */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] rounded-xl transition-all text-slate-500 hover:text-slate-900 font-medium"
          title="Buka Menu Lengkap & SOP"
        >
          <div className="p-1 rounded-xl">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-tight mt-0.5 tracking-tight">Menu</span>
        </button>
      </div>
    </nav>
  );
};
