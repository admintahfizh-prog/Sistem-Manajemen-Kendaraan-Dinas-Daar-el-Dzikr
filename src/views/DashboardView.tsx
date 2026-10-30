/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HeartHandshake,
  Calendar,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  Gauge,
  Fuel,
  Bot,
  Sparkles,
  BookOpen,
  Edit3,
  FileCheck2,
  Coins,
  Shield,
  HelpCircle,
  Car,
  ChevronDown,
  ChevronUp,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Lock,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    vehicles,
    bookings,
    infaqRecords,
    expenses,
    totalInfaqAmount,
    totalExpenseAmount,
    cashBalance,
    settings,
    sopClauses,
    setActiveTab,
    setCoordinatorPinModalOpen,
    isCoordinator,
    setPrintDoc,
    testAiNotificationVoice,
  } = useApp();

  const [expandedChapter, setExpandedChapter] = useState<number | null>(0);

  const totalArmada = vehicles.length;
  const availableArmada = vehicles.filter((v) => v.status === 'Tersedia').length;
  const inUseArmada = vehicles.filter((v) => v.status === 'Digunakan').length;

  const pendingBookings = bookings.filter((b) => b.status === 'Menunggu ACC');
  const activeTrips = bookings.filter((b) => b.status === 'Sedang Berjalan');
  const approvedUpcoming = bookings.filter((b) => b.status === 'Disetujui');

  const getVehicleName = (vehicleId: string) => {
    return vehicles.find((v) => v.id === vehicleId)?.name || 'Suzuki APV Yayasan';
  };

  const getVehiclePlate = (vehicleId: string) => {
    return vehicles.find((v) => v.id === vehicleId)?.plateNumber || 'B 1928 SDZ';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice if Pending ACC */}
      {pendingBookings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-amber-900">
                Ada {pendingBookings.length} Permohonan Booking Menunggu ACC Koordinator
              </p>
              <p className="text-amber-700 text-[11px] mt-0.5">
                Segera periksa dan setujui jadwal untuk penerbitan surat tugas jalan resmi.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isCoordinator) {
                setActiveTab('acc-coordinator');
              } else {
                setCoordinatorPinModalOpen(true);
              }
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Buka ACC Koordinator
          </button>
        </div>
      )}

      {/* AI Voice Notification Control Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Sistem Peringatan &amp; Suara AI Notifikasi</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                AI Voice Aktif
              </span>
            </div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Otomatis memberi peringatan suara saat permohonan booking baru masuk, siap serah terima BAST Ambil, &amp; pengembalian armada.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={testAiNotificationVoice}
          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold transition-colors flex items-center gap-1.5 shadow-xs text-xs shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Uji Suara AI Notifikasi
        </button>
      </div>

      {/* PROMINENT SOP & KLAUSUL ON FRONT DASHBOARD */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-700/60 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-[11px] font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              SOP Resmi Penggunaan Kendaraan Yayasan Daar el Dzikr
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Pedoman Pokok, Klausul &amp; Ketentuan Operasional
            </h2>
            <p className="text-xs text-emerald-100/80 max-w-2xl leading-relaxed">
              Seluruh peminjam dari unit kerja PAUD, SD, SMP, MA, Pesantren, Yayasan, maupun Pribadi wajib menaati amanah pemakaian kendaraan dinas sesuai SOP yang berlaku.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (isCoordinator) {
                  setActiveTab('edit-klausul');
                } else {
                  setCoordinatorPinModalOpen(true);
                }
              }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit Klausul (Koordinator)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('petunjuk')}
              className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-emerald-600"
            >
              <HelpCircle className="w-4 h-4" />
              Petunjuk Integrasi
            </button>
          </div>
        </div>

        {/* Highlight Quick Rules Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-emerald-800/60 border border-emerald-700 rounded-2xl p-3.5 backdrop-blur-xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-emerald-200 flex items-center justify-center mb-2">
              <Car className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-emerald-300 font-semibold uppercase">Armada Resmi</p>
            <p className="font-bold text-white mt-0.5">Suzuki APV Arena</p>
            <p className="text-[10px] text-emerald-200 mt-0.5">B 1928 SDZ</p>
          </div>

          <div className="bg-emerald-800/60 border border-emerald-700 rounded-2xl p-3.5 backdrop-blur-xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-emerald-200 flex items-center justify-center mb-2">
              <Shield className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-emerald-300 font-semibold uppercase">Unit Kerja</p>
            <p className="font-bold text-white mt-0.5">7 Kategori</p>
            <p className="text-[10px] text-emerald-200 mt-0.5">PAUD - Yayasan - Pribadi</p>
          </div>

          <div className="bg-emerald-800/60 border border-emerald-700 rounded-2xl p-3.5 backdrop-blur-xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-emerald-200 flex items-center justify-center mb-2">
              <Coins className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-emerald-300 font-semibold uppercase">Infaq 12 Jam</p>
            <p className="font-bold text-amber-300 mt-0.5">Rp {(settings?.infaq12Hours ?? 50000).toLocaleString('id-ID')}</p>
            <p className="text-[10px] text-emerald-200 mt-0.5">50rb (Pribadi)</p>
          </div>

          <div className="bg-emerald-800/60 border border-emerald-700 rounded-2xl p-3.5 backdrop-blur-xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-emerald-200 flex items-center justify-center mb-2">
              <Coins className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-emerald-300 font-semibold uppercase">Infaq 24 Jam</p>
            <p className="font-bold text-amber-300 mt-0.5">Rp {(settings?.infaq24Hours ?? 100000).toLocaleString('id-ID')}</p>
            <p className="text-[10px] text-emerald-200 mt-0.5">100rb (1 Hari)</p>
          </div>

          <div className="bg-emerald-800/60 border border-emerald-700 rounded-2xl p-3.5 backdrop-blur-xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-emerald-200 flex items-center justify-center mb-2">
              <Fuel className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-emerald-300 font-semibold uppercase">Level Bensin</p>
            <p className="font-bold text-white mt-0.5">Strip 3 (Full)</p>
            <p className="text-[10px] text-emerald-200 mt-0.5">Wajib Kembali Full</p>
          </div>

          <div className="bg-emerald-800/60 border border-emerald-700 rounded-2xl p-3.5 backdrop-blur-xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-emerald-200 flex items-center justify-center mb-2">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-emerald-300 font-semibold uppercase">Cuci &amp; Cover</p>
            <p className="font-bold text-amber-300 mt-0.5">Cuci 35k</p>
            <p className="text-[10px] text-emerald-200 mt-0.5">Cover Tertutup Rapi</p>
          </div>
        </div>

        {/* Expandable SOP Clauses List */}
        <div className="bg-white/10 border border-emerald-700/70 rounded-2xl p-4 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-200">
            <span>Rincian Pasal &amp; Klausul SOP (Dapat Diedit Koordinator):</span>
            <button
              type="button"
              onClick={() => setActiveTab('sop')}
              className="text-white hover:text-amber-300 font-bold flex items-center gap-1 text-xs"
            >
              Buka Halaman SOP Lengkap &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {sopClauses.map((chap, idx) => {
              const isExpanded = expandedChapter === idx;
              return (
                <div
                  key={idx}
                  className="bg-emerald-950/40 border border-emerald-700/50 rounded-xl overflow-hidden text-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedChapter(isExpanded ? null : idx)}
                    className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-emerald-900/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold px-2 py-0.5 bg-emerald-600/60 rounded text-[11px] text-white">
                        {chap.chapter}
                      </span>
                      <span className="font-bold text-white text-xs">{chap.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-300 text-[11px]">
                      <span>{chap.points.length} Poin</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-1 border-t border-emerald-800/40 space-y-2.5 bg-emerald-950/20">
                      {chap.points.map((pt, pIdx) => (
                        <div key={pIdx} className="p-2.5 rounded-lg bg-emerald-900/30 border border-emerald-700/30">
                          <p className="font-bold text-emerald-200 text-[11px]">
                            {pt.no} {pt.title}
                          </p>
                          <p className="text-emerald-100/90 text-xs mt-1 leading-relaxed">
                            {pt.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Armada */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Armada Yayasan</span>
            <Truck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalArmada}
            </span>
            <span className="text-xs text-slate-500">Unit (Suzuki APV)</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-medium">{availableArmada} Siap Jalan</span>
            <span className="text-slate-400">·</span>
            <span className="text-blue-700 font-medium">{inUseArmada} Beroperasi</span>
          </div>
        </div>

        {/* Booking Menunggu ACC */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Menunggu ACC</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-600">
              {pendingBookings.length}
            </span>
            <span className="text-xs text-slate-500">Permohonan</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Butuh verifikasi PIN</span>
            <button
              onClick={() => setActiveTab('acc-coordinator')}
              className="text-emerald-700 font-semibold hover:underline"
            >
              ACC Sekarang &rarr;
            </button>
          </div>
        </div>

        {/* Sedang Berjalan */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Sedang Berjalan</span>
            <KeyRound className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-blue-700">
              {activeTrips.length}
            </span>
            <span className="text-xs text-slate-500">Dalam Perjalanan</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Menunggu serah kembali</span>
            <button
              onClick={() => setActiveTab('pengembalian')}
              className="text-blue-700 font-semibold hover:underline"
            >
              BAST Kembali &rarr;
            </button>
          </div>
        </div>

        {/* Saldo Kas Armada */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 text-xs mb-2">
            <span className="font-semibold">Saldo Kas Armada</span>
            <Wallet className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-emerald-800">Rp</span>
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-800">
              {(cashBalance ?? 0).toLocaleString('id-ID')}
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-medium">Infaq - Pengeluaran</span>
            <button
              onClick={() => setActiveTab('keuangan-armada')}
              className="text-emerald-900 font-bold hover:underline"
            >
              Buku Kas &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Bar Alur */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Alur Terintegrasi Penggunaan Kendaraan Yayasan
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => setActiveTab('booking')}
            className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-900">1. Booking Jam &amp; Hari</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Pilih unit kerja (PAUD - Pribadi)</p>
          </button>

          <button
            onClick={() => setActiveTab('acc-coordinator')}
            className="p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-900">2. ACC Koordinator</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Otorisasi PIN &amp; Surat Tugas</p>
          </button>

          <button
            onClick={() => setActiveTab('pengambilan')}
            className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <KeyRound className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-900">3. BAST Pengambilan</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Cek BBM Strip 3 &amp; fisik mobil</p>
          </button>

          <button
            onClick={() => setActiveTab('pengembalian')}
            className="p-3 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-900">4. BAST Pengembalian</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Cek cuci 35k &amp; cover tertutup</p>
          </button>
        </div>
      </div>

      {/* Transparansi Kas & Saldo Armada Terkontrol */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                Transparansi Kas Kendaraan
              </span>
              <span className="text-[11px] text-slate-400">Terkontrol Publik</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Laporan Kas Pemasukan Infaq, Pengeluaran &amp; Saldo Riil
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Seluruh mutasi tercatat otomatis dan sinkron realtime melalui Firebase Firestore agar dapat dipantau bersama oleh seluruh sivitas yayasan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('keuangan-armada')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Coins className="w-4 h-4" />
            Buku Kas Lengkap &rarr;
          </button>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                Total Pemasukan Infaq
              </p>
              <p className="text-lg md:text-xl font-bold font-mono text-emerald-900 mt-1">
                Rp {(totalInfaqAmount ?? 0).toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {infaqRecords.length} kali pemakaian dinas / pribadi
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">
                Total Pengeluaran Operasional
              </p>
              <p className="text-lg md:text-xl font-bold font-mono text-rose-900 mt-1">
                Rp {(totalExpenseAmount ?? 0).toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-rose-700 mt-0.5">
                {expenses.length} mutasi BBM, servis &amp; cuci
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Saldo Kas Armada Tersedia
              </p>
              <p className="text-xl md:text-2xl font-black font-mono text-white mt-1">
                Rp {(cashBalance ?? 0).toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                PJ: {settings.coordinatorName || 'Moch Cholil, S.Pd.I'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Info Akses Buku Kas & Riwayat Khusus Koordinator */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs mt-2">
          <div className="flex items-center gap-2.5 text-slate-600">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Buku Kas &amp; Riwayat Khusus Koordinator</p>
              <p className="text-[11px] text-slate-500">
                Pencatatan nota pengeluaran, audit fisik kas, dan koreksi infaq tersimpan aman pada Menu Koordinator.
              </p>
            </div>
          </div>
          {isCoordinator ? (
            <button
              type="button"
              onClick={() => setActiveTab('keuangan-armada')}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Wallet className="w-3.5 h-3.5" />
              Buka Buku Kas &amp; Riwayat
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCoordinatorPinModalOpen(true)}
              className="px-3.5 py-2 border border-slate-300 hover:bg-white text-slate-700 font-semibold rounded-xl text-xs transition-colors shrink-0"
            >
              Login PIN Koordinator
            </button>
          )}
        </div>
      </div>

      {/* Status Armada Suzuki APV Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Armada Operasional Yayasan</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unit resmi Kendaraan Yayasan Daar el Dzikr
            </p>
          </div>
          <button
            onClick={() => setActiveTab('booking')}
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            Pesan Suzuki APV Sekarang <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col md:col-span-2 lg:col-span-3 bg-slate-50/40"
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="relative h-56 md:h-full bg-slate-100 overflow-hidden">
                  <img
                    src={v.imageUrl}
                    alt={v.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full shadow-xs ${
                        v.status === 'Tersedia'
                          ? 'bg-emerald-600 text-white'
                          : v.status === 'Digunakan'
                          ? 'bg-blue-600 text-white'
                          : v.status === 'Dibooking'
                          ? 'bg-amber-500 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 md:col-span-2 flex flex-col justify-between text-xs space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          Kendaraan Yayasan Resmi
                        </span>
                        <h4 className="font-bold text-lg text-slate-900 mt-1">{v.name}</h4>
                        <p className="font-mono text-emerald-800 font-bold text-sm tracking-wide">
                          {v.plateNumber}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab('booking')}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                      >
                        Form Booking Mobil
                      </button>
                    </div>

                    <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                      {v.notes}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-slate-200">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-400">Kapasitas</p>
                      <p className="font-bold text-slate-800 mt-0.5">{v.capacity} Penumpang</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-400">Bahan Bakar</p>
                      <p className="font-bold text-slate-800 mt-0.5">Pertalite/Max</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-400">Odometer Terakhir</p>
                      <p className="font-mono font-bold text-slate-800 mt-0.5">
                        {(v.odometerKm ?? 38450).toLocaleString('id-ID')} KM
                      </p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-400">Servis Berkala</p>
                      <p className="font-bold text-slate-800 mt-0.5">{v.lastServiceDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jadwal & Booking Terkini */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jadwal Berjalan & Mendatang */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Jadwal Perjalanan Aktif &amp; Terdekat</h3>
            <button
              onClick={() => setActiveTab('booking')}
              className="text-xs text-emerald-700 font-semibold hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {[...activeTrips, ...approvedUpcoming].length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Tidak ada perjalanan kendaraan yang sedang berjalan atau terjadwal hari ini.
              </p>
            ) : (
              [...activeTrips, ...approvedUpcoming].slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors text-xs space-y-2 bg-slate-50/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{b.borrowerName}</span>
                        <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                          Unit: {b.division}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {getVehicleName(b.vehicleId)} ({getVehiclePlate(b.vehicleId)})
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        b.status === 'Sedang Berjalan'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <p className="text-slate-600">
                    <strong className="text-slate-800">Tujuan:</strong> {b.destination}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-500">
                      {b.startDate} ({b.startTime}) s.d. {b.endDate} ({b.endTime})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPrintDoc({
                          type: 'surat-jalan',
                          data: b,
                        })
                      }
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      Cetak Surat Tugas
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pengelolaan Keuangan & Buku Kas Khusus Koordinator */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Buku Kas &amp; Riwayat Keuangan</h3>
                  <p className="text-[11px] text-slate-500">Khusus Pengawasan Koordinator Sarpras</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono font-medium flex items-center gap-1 border border-slate-200">
                <Lock className="w-3 h-3 text-slate-500" /> Terkunci
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5 text-slate-600">
              <p className="leading-relaxed">
                Sesuai regulasi transparansi Yayasan Daar el Dzikr, seluruh rincian transaksi <strong>buku kas</strong>, <strong>mutasi pengeluaran operasional</strong> (BBM, servis rutin, cuci armada), serta <strong>koreksi infaq</strong> hanya dapat diakses melalui <strong>Menu Koordinator</strong> dengan otorisasi kode PIN.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                <span className="text-slate-500">Penanggung Jawab Sarpras:</span>
                <span className="font-semibold text-slate-800">{settings.coordinatorName || 'Moch Cholil, S.Pd.I'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('infaq')}
              className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              + Infaq Peminjaman &rarr;
            </button>

            <button
              type="button"
              onClick={() => {
                if (isCoordinator) {
                  setActiveTab('settings');
                } else {
                  setCoordinatorPinModalOpen(true);
                }
              }}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-300" />
              Buka Buku Kas (Koordinator)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
