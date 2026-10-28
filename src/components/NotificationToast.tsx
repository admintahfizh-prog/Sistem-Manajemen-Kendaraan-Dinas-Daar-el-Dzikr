/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  X,
  Clock,
  KeyRound,
  RotateCcw,
  Volume2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toastNotification, dismissToast, setActiveTab, voiceEnabled } = useApp();

  useEffect(() => {
    if (!toastNotification) return;

    const timer = setTimeout(() => {
      dismissToast();
    }, 6000);

    return () => clearTimeout(timer);
  }, [toastNotification, dismissToast]);

  if (!toastNotification) return null;

  const handleAction = () => {
    if (toastNotification.actionTab) {
      setActiveTab(toastNotification.actionTab);
    }
    dismissToast();
  };

  const getIcon = () => {
    switch (toastNotification.type) {
      case 'booking_new':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'ready_pickup':
        return <KeyRound className="w-5 h-5 text-emerald-500" />;
      case 'returned':
        return <RotateCcw className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 shrink-0">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0 text-xs">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="font-bold text-slate-100 truncate">
              {toastNotification.title}
            </span>
            <button
              type="button"
              onClick={dismissToast}
              className="text-slate-400 hover:text-white p-0.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
            {toastNotification.message}
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
            {voiceEnabled ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3" /> Suara AI Aktif
              </span>
            ) : (
              <span className="text-slate-400">Pemberitahuan Sistem</span>
            )}

            <button
              type="button"
              onClick={handleAction}
              className="font-bold text-emerald-300 hover:text-white flex items-center gap-0.5 hover:underline"
            >
              Lihat Detail <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
