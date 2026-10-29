/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Building2,
  Phone,
  Save,
  CheckCircle2,
  ShieldAlert,
  Coins,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

export const EditRekeningView: React.FC = () => {
  const {
    isCoordinator,
    setCoordinatorPinModalOpen,
    settings,
    updateSchoolSettings,
    setActiveTab,
  } = useApp();

  const [form, setForm] = useState({
    bankName: settings.bankName || 'Bank Syariah Indonesia (BSI)',
    bankAccountNumber: settings.bankAccountNumber || '712-345-6789',
    bankAccountHolder: settings.bankAccountHolder || 'Yayasan Wakaf Pendidikan Daar el Dzikr (Kas Kendaraan)',
    bankConfirmationPhone: settings.bankConfirmationPhone || '0812-9876-5432',
    bankNotes:
      settings.bankNotes ||
      'Silakan cantumkan nama peminjam pada berita transfer, lalu kirim bukti transfer ke WA Koordinator Sarpras.',
    infaq12Hours: settings.infaq12Hours || 50000,
    infaq24Hours: settings.infaq24Hours || 100000,
    washingPenaltyAmount: settings.washingPenaltyAmount || 35000,
    coordinatorName: settings.coordinatorName || '',
    coordinatorPhone: settings.coordinatorPhone || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isCoordinator) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-lg mx-auto my-12 shadow-xs">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Akses Khusus Koordinator Sarpras</h2>
        <p className="text-xs text-slate-600 mt-2 mb-6">
          Pengaturan nomor rekening bank yayasan dan besaran anjuran infaq hanya dapat diakses oleh Koordinator terotorisasi.
        </p>
        <button
          type="button"
          onClick={() => setCoordinatorPinModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs transition-colors shadow-xs"
        >
          Masukkan PIN Koordinator
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings({
      bankName: form.bankName,
      bankAccountNumber: form.bankAccountNumber,
      bankAccountHolder: form.bankAccountHolder,
      bankConfirmationPhone: form.bankConfirmationPhone,
      bankNotes: form.bankNotes,
      infaq12Hours: Number(form.infaq12Hours),
      infaq24Hours: Number(form.infaq24Hours),
      washingPenaltyAmount: Number(form.washingPenaltyAmount),
      coordinatorName: form.coordinatorName,
      coordinatorPhone: form.coordinatorPhone,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Pengaturan Data Rekening &amp; Infaq Yayasan
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasikan rekening bank penyaluran infaq kendaraan, nomor WhatsApp konfirmasi, serta tarif kompensasi infaq dan denda cuci mobil.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('infaq')}
          className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          Lihat Halaman Infaq <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-xs text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            Data rekening dan tarif infaq berhasil diperbarui! Perubahan langsung berlaku di formulir booking, BAST pengembalian, dan buku infaq.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Data Rekening Bank */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">Rekening Bank Resmi Kas Kendaraan</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Bank
              </label>
              <input
                type="text"
                required
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                placeholder="Contoh: Bank Syariah Indonesia (BSI)"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Rekening
              </label>
              <input
                type="text"
                required
                value={form.bankAccountNumber}
                onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
                placeholder="Contoh: 712-345-6789"
                className="w-full font-mono font-bold text-slate-900 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Atas Nama (Pemilik Rekening)
              </label>
              <input
                type="text"
                required
                value={form.bankAccountHolder}
                onChange={(e) => setForm({ ...form, bankAccountHolder: e.target.value })}
                placeholder="Contoh: Yayasan Wakaf Pendidikan Daar el Dzikr"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor WhatsApp Konfirmasi Bukti Transfer
              </label>
              <input
                type="text"
                required
                value={form.bankConfirmationPhone}
                onChange={(e) => setForm({ ...form, bankConfirmationPhone: e.target.value })}
                placeholder="0812-9876-5432"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Catatan / Petunjuk Transfer untuk Peminjam
              </label>
              <textarea
                rows={2}
                value={form.bankNotes}
                onChange={(e) => setForm({ ...form, bankNotes: e.target.value })}
                placeholder="Petunjuk berita transfer dan konfirmasi..."
                className="w-full border border-slate-300 rounded-xl p-3 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Tarif Infaq & Denda Cuci */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Coins className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">
              Kompensasi Infaq Pribadi &amp; Pengganti Cuci
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-emerald-950">Infaq 12 Jam (Setengah Hari)</label>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  50rb
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Peminjaman perorangan dengan durasi pemakaian sampai dengan 12 jam.
              </p>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-slate-500">Rp</span>
                <input
                  type="number"
                  step="5000"
                  required
                  value={form.infaq12Hours}
                  onChange={(e) => setForm({ ...form, infaq12Hours: Number(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 font-mono font-bold bg-white border border-emerald-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-blue-950">Infaq 24 Jam (1 Hari Penuh)</label>
                <span className="text-[10px] bg-blue-200 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                  100rb
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Peminjaman perorangan dengan durasi pemakaian sampai dengan 24 jam.
              </p>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-slate-500">Rp</span>
                <input
                  type="number"
                  step="10000"
                  required
                  value={form.infaq24Hours}
                  onChange={(e) => setForm({ ...form, infaq24Hours: Number(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 font-mono font-bold bg-white border border-blue-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-amber-950">Pengganti Cuci Mobil</label>
                <span className="text-[10px] bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  35k
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Biaya steam cuci armada apabila mobil dikembalikan dalam keadaan kotor.
              </p>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-slate-500">Rp</span>
                <input
                  type="number"
                  step="5000"
                  required
                  value={form.washingPenaltyAmount}
                  onChange={(e) =>
                    setForm({ ...form, washingPenaltyAmount: Number(e.target.value) })
                  }
                  className="w-full pl-10 pr-3 py-2 font-mono font-bold bg-white border border-amber-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Data Kontak Koordinator Sarpras */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Phone className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">Kontak Person Koordinator Sarpras</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap Koordinator
              </label>
              <input
                type="text"
                required
                value={form.coordinatorName}
                onChange={(e) => setForm({ ...form, coordinatorName: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Telepon / WhatsApp Koordinator
              </label>
              <input
                type="text"
                required
                value={form.coordinatorPhone}
                onChange={(e) => setForm({ ...form, coordinatorPhone: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-800 pb-2 text-xs">
            <span className="text-emerald-300 flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Tampilan Pratinjau Rekening bagi Peminjam
            </span>
            <span className="text-[11px] text-emerald-400">Kendaraan Yayasan Daar el Dzikr</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <p className="text-emerald-300 text-[11px]">Bank Tujuan Transfer</p>
              <p className="font-bold text-sm text-white mt-0.5">{form.bankName}</p>
              <p className="text-emerald-200 mt-2 text-[11px]">Nomor Rekening</p>
              <p className="font-mono text-xl font-bold tracking-wider text-amber-300">
                {form.bankAccountNumber}
              </p>
              <p className="text-emerald-200 text-[11px] mt-1">a.n. {form.bankAccountHolder}</p>
            </div>

            <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-emerald-800 sm:pl-4">
              <p className="text-emerald-300 text-[11px]">Tarif Kompensasi Infaq Pribadi:</p>
              <div className="flex justify-between text-xs py-1 border-b border-emerald-800/60">
                <span>Durasi s.d 12 Jam</span>
                <span className="font-mono font-bold text-amber-300">
                  Rp {(Number(form.infaq12Hours) || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-emerald-800/60">
                <span>Durasi s.d 24 Jam (1 Hari)</span>
                <span className="font-mono font-bold text-amber-300">
                  Rp {(Number(form.infaq24Hours) || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span>Pengganti Cuci Armada Kotor</span>
                <span className="font-mono font-bold text-amber-300">
                  Rp {(Number(form.washingPenaltyAmount) || 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            Simpan Pengaturan Rekening &amp; Infaq
          </button>
        </div>
      </form>
    </div>
  );
};
