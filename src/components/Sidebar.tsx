/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp, NavTab } from '../context/AppContext';
import {
  LayoutDashboard,
  Truck,
  CalendarDays,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  BookOpenCheck,
  HeartHandshake,
  ImageUp,
  HelpCircle,
  Lock,
  LogOut,
  ChevronRight,
  School,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    activeTab,
    setActiveTab,
    bookings,
    isCoordinator,
    setCoordinatorPinModalOpen,
    logoutCoordinator,
    settings,
  } = useApp();

  const pendingAccCount = bookings.filter((b) => b.status === 'Menunggu ACC').length;
  const readyToPickupCount = bookings.filter((b) => b.status === 'Disetujui' && !b.handoverIn).length;
  const inTripCount = bookings.filter((b) => b.status === 'Sedang Berjalan' && !b.handoverReturn).length;

  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
    coordinatorOnly?: boolean;
    category?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard & Rekap',
      icon: LayoutDashboard,
      category: 'Utama',
    },
    {
      id: 'armada',
      label: 'Daftar Armada Mobil',
      icon: Truck,
      category: 'Utama',
    },
    {
      id: 'booking',
      label: 'Booking Hari & Jam',
      icon: CalendarDays,
      category: 'Operasional',
    },
    {
      id: 'acc-coordinator',
      label: 'ACC Koordinator',
      icon: ShieldCheck,
      badge: pendingAccCount,
      badgeColor: 'bg-amber-500 text-white',
      coordinatorOnly: true,
      category: 'Operasional',
    },
    {
      id: 'pengambilan',
      label: 'Pengambilan Kendaraan',
      icon: KeyRound,
      badge: readyToPickupCount > 0 ? readyToPickupCount : undefined,
      badgeColor: 'bg-emerald-600 text-white',
      category: 'Berita Acara (BAST)',
    },
    {
      id: 'pengembalian',
      label: 'Pengembalian Kendaraan',
      icon: RotateCcw,
      badge: inTripCount > 0 ? inTripCount : undefined,
      badgeColor: 'bg-blue-600 text-white',
      category: 'Berita Acara (BAST)',
    },
    {
      id: 'infaq',
      label: 'Perorangan & Infaq',
      icon: HeartHandshake,
      category: 'Keuangan & Sosial',
    },
    {
      id: 'sop',
      label: 'SOP & Klausul Dinas',
      icon: BookOpenCheck,
      category: 'Panduan & Regulasi',
    },
    {
      id: 'logo-sekolah',
      label: 'Upload Logo & Sarpras',
      icon: ImageUp,
      coordinatorOnly: true,
      category: 'Pengaturan',
    },
    {
      id: 'petunjuk',
      label: 'Petunjuk Penggunaan',
      icon: HelpCircle,
      category: 'Panduan & Regulasi',
    },
  ];

  const handleNavClick = (tabId: NavTab, coordinatorOnly?: boolean) => {
    if (coordinatorOnly && !isCoordinator) {
      setCoordinatorPinModalOpen(true);
      return;
    }
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Lockup */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800/80 overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-inner">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Logo Daar el Dzikr"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <School className="w-6 h-6 text-emerald-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-bold text-white tracking-tight leading-snug truncate">
                {settings.schoolName}
              </h1>
              <p className="text-[11px] text-emerald-400 font-medium truncate">
                SIM Kendaraan Dinas
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item, idx) => {
            const isActive = activeTab === item.id;
            const isLocked = item.coordinatorOnly && !isCoordinator;
            const showCategoryHeading =
              idx === 0 || navItems[idx - 1].category !== item.category;

            return (
              <React.Fragment key={item.id}>
                {showCategoryHeading && item.category && (
                  <div className="pt-3 pb-1 px-3 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                    {item.category}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id, item.coordinatorOnly)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <item.icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                      }`}
                    />
                    <span className="truncate whitespace-nowrap">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isLocked && (
                      <span
                        title="Perlu akses PIN Koordinator"
                        className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded flex items-center gap-1 border border-slate-700"
                      >
                        <Lock className="w-2.5 h-2.5" />
                        PIN
                      </span>
                    )}
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${
                          item.badgeColor || 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                  </div>
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer Role Card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          {isCoordinator ? (
            <div className="bg-emerald-950/60 border border-emerald-800/70 rounded-xl p-3 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Koordinator Aktif
                </span>
                <button
                  type="button"
                  onClick={logoutCoordinator}
                  title="Keluar dari akun koordinator"
                  className="text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-1">{settings.coordinatorName}</p>
              <div className="mt-2 pt-2 border-t border-emerald-900/60 flex items-center justify-between text-[10px] text-emerald-400">
                <span>Hak Akses Penuh</span>
                <button
                  type="button"
                  onClick={logoutCoordinator}
                  className="hover:underline text-rose-300"
                >
                  Keluar Mode
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-300">Mode: Guru / Staf</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2.5">
                Pengajuan booking dapat dilakukan oleh seluruh staf.
              </p>
              <button
                type="button"
                onClick={() => setCoordinatorPinModalOpen(true)}
                className="w-full py-1.5 px-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3 h-3 text-emerald-400" />
                Masuk Akun Koordinator
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
