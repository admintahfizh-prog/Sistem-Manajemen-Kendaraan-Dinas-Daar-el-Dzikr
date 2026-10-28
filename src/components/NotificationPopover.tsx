/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Volume2,
  VolumeX,
  Bot,
  Sparkles,
  Clock,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  Trash2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const NotificationPopover: React.FC = () => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    soundEnabled,
    setSoundEnabled,
    voiceEnabled,
    setVoiceEnabled,
    testAiNotificationVoice,
    setActiveTab,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const displayedNotifications = filterUnread
    ? notifications.filter((n) => !n.read)
    : notifications;

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.actionTab) {
      setActiveTab(notif.actionTab);
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_new':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'ready_pickup':
        return <KeyRound className="w-4 h-4 text-emerald-600" />;
      case 'returned':
        return <RotateCcw className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Notification Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        title="Pemberitahuan & Notifikasi Sarpras"
        aria-label="Pemberitahuan"
      >
        <Bell className="w-5 h-5" />

        {unreadNotificationCount > 0 && (
          <>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-full border-2 border-white tabular-nums">
              {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
            </span>
          </>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-xs tracking-tight">
                Peringatan &amp; Notifikasi Sarpras
              </h3>
            </div>
            {unreadNotificationCount > 0 && (
              <span className="text-[10px] bg-emerald-600 text-white font-mono font-bold px-2 py-0.5 rounded-full">
                {unreadNotificationCount} Baru
              </span>
            )}
          </div>

          {/* AI Voice & Audio Control Strip */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  soundEnabled
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
                title="Aktif/Nonaktifkan Bunyi Chime"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>Chime</span>
              </button>

              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  voiceEnabled
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
                title="Aktif/Nonaktifkan Suara AI Berbahasa Indonesia"
              >
                <Bot className="w-3.5 h-3.5 text-emerald-600" />
                <span>Suara AI</span>
              </button>
            </div>

            <button
              type="button"
              onClick={testAiNotificationVoice}
              className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
              title="Putar demo suara AI dan lonceng notifikasi"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Uji Suara AI</span>
            </button>
          </div>

          {/* Filter & Action toolbar */}
          <div className="px-3 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFilterUnread(false)}
                className={`px-2 py-0.5 rounded font-medium ${
                  !filterUnread ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
                }`}
              >
                Semua ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterUnread(true)}
                className={`px-2 py-0.5 rounded font-medium ${
                  filterUnread ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
                }`}
              >
                Belum Dibaca ({unreadNotificationCount})
              </button>
            </div>

            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={markAllNotificationsAsRead}
                  className="text-slate-500 hover:text-emerald-700 hover:underline"
                  title="Tandai semua telah dibaca"
                >
                  Baca Semua
                </button>
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="text-slate-400 hover:text-rose-600 p-0.5"
                  title="Hapus riwayat notifikasi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Notification List Container */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {displayedNotifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                <p className="font-semibold text-slate-600">Tidak ada notifikasi baru.</p>
                <p className="text-[10px] mt-0.5">
                  Setiap pengajuan booking, serah terima, atau pengembalian akan memberi peringatan di sini.
                </p>
              </div>
            ) : (
              displayedNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-50 flex items-start gap-3 ${
                    !n.read ? 'bg-emerald-50/40' : 'bg-white'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className={`font-bold leading-tight ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1" />
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {n.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-mono">{n.timestamp}</span>
                      {n.actionTab && (
                        <span className="text-emerald-700 font-semibold flex items-center gap-0.5 hover:underline">
                          Proses Sekarang &rarr;
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Notice */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-500">
            Peringatan otomatis terkirim setiap ada booking, pengambilan, atau pengembalian armada.
          </div>
        </div>
      )}
    </div>
  );
};
