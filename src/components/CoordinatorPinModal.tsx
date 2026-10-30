/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, AlertCircle, X } from 'lucide-react';

export const CoordinatorPinModal: React.FC = () => {
  const { coordinatorPinModalOpen, setCoordinatorPinModalOpen, verifyCoordinatorPin } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!coordinatorPinModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyCoordinatorPin(pin);
    if (success) {
      setPin('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-6 relative">
          <button
            onClick={() => {
              setCoordinatorPinModalOpen(false);
              setError(false);
              setPin('');
            }}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-emerald-800/80 border border-emerald-700 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-emerald-300" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Otorisasi Akun Koordinator Sarpras
          </h3>
          <p className="text-xs text-emerald-200 mt-1">
            Akses khusus persetujuan (ACC), perubahan armada, dan pengaturan logo lembaga.
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Masukkan PIN Koordinator
            </label>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="••••"
              autoFocus
              className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            />
            {error && (
              <p className="text-xs text-rose-600 flex items-center gap-1.5 mt-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                PIN salah. Silakan periksa kembali atau hubungi Koordinator Sarpras.
              </p>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
            <div className="font-semibold flex items-center gap-1.5 mb-1 text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Otorisasi Keamanan Terbatas
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Halaman ini dilindungi kode PIN keamanan khusus yang hanya dimiliki oleh Koordinator Sarpras Yayasan.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setCoordinatorPinModalOpen(false);
                setError(false);
                setPin('');
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Masuk Mode Koordinator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
