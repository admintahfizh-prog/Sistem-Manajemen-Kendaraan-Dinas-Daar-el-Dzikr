/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import {
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  Lock,
  Calendar,
  User,
  Car,
  Clock,
  Printer,
  ChevronRight,
  FileCheck,
} from 'lucide-react';

export const CoordinatorAccView: React.FC = () => {
  const {
    bookings,
    vehicles,
    approveBooking,
    rejectBooking,
    isCoordinator,
    setCoordinatorPinModalOpen,
    verifyCoordinatorPin,
    settings,
    setPrintDoc,
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Approval modal state
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<Booking | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [coordinatorNotes, setCoordinatorNotes] = useState('');
  const [assignedDriver, setAssignedDriver] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingBookings = bookings.filter((b) => b.status === 'Menunggu ACC');
  const pastActionedBookings = bookings.filter(
    (b) => b.status === 'Disetujui' || b.status === 'Ditolak'
  );

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyCoordinatorPin(pinInput)) {
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleOpenApproveModal = (b: Booking) => {
    setSelectedBookingForAction(b);
    setActionType('approve');
    setCoordinatorNotes(
      b.purposeCategory === 'Kedinasan Sekolah'
        ? 'Disetujui untuk penugasan resmi sekolah. Harap membawa surat tugas ini.'
        : 'Disetujui untuk pemakaian perorangan. Infaq pemeliharaan dibayarkan saat pengembalian.'
    );
    const v = vehicles.find((item) => item.id === b.vehicleId);
    setAssignedDriver(v?.assignedDriver || 'Pak Bambang (Driver Utama)');
  };

  const handleOpenRejectModal = (b: Booking) => {
    setSelectedBookingForAction(b);
    setActionType('reject');
    setRejectionReason('Armada sedang dialokasikan untuk prioritas kegiatan kedinasan santri Daar el Dzikr.');
  };

  const handleConfirmAction = () => {
    if (!selectedBookingForAction) return;

    if (actionType === 'approve') {
      approveBooking(
        selectedBookingForAction.id,
        coordinatorNotes,
        assignedDriver
      );
    } else if (actionType === 'reject') {
      rejectBooking(selectedBookingForAction.id, rejectionReason);
    }

    setSelectedBookingForAction(null);
    setActionType(null);
  };

  if (!isCoordinator) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Akses Khusus Koordinator Sarpras
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
          Halaman ini khusus untuk Koordinator Armada / Bagian Sarana &amp; Prasarana Sekolah Islam Daar el Dzikr
          guna meninjau, menyetujui (ACC), atau menolak permohonan kendaraan dinas.
        </p>

        <form onSubmit={handleInlineLogin} className="mt-6 max-w-xs mx-auto space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-left">
              Masukkan PIN Otorisasi
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="••••"
              className="w-full text-center tracking-[0.5em] text-2xl font-mono py-2.5 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            {pinError && (
              <p className="text-[11px] text-rose-600 mt-1.5 text-left">
                PIN tidak sesuai. Gunakan PIN default: 1234
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Buka Panel ACC Koordinator
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-[11px] text-slate-400">
          Petunjuk: PIN default bawaan demonstrasi adalah <strong className="text-slate-700">1234</strong>.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-800 border border-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">Panel Otorisasi &amp; ACC Koordinator</h2>
              <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-700">
                Akses Khusus
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              Koordinator Aktif: <strong className="text-white">{settings.coordinatorName}</strong> ·
              Hak persetujuan pemakaian armada dinas sekolah
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs">
          <span className="bg-emerald-950/70 text-emerald-200 px-3 py-1.5 rounded-xl border border-emerald-800/80 font-mono">
            {pendingBookings.length} Permohonan Pending
          </span>
        </div>
      </div>

      {/* Pending Bookings List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Permohonan Menunggu Persetujuan (Pending ACC)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tinjau kesesuaian tujuan, skala prioritas santri/lembaga, dan alokasi driver
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200">
            {pendingBookings.length} Permohonan
          </span>
        </div>

        {pendingBookings.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <FileCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600">Alhamdulillah, tidak ada antrean permohonan pending.</p>
            <p className="text-[11px] mt-0.5">Semua permohonan booking telah direspons atau belum ada pengajuan baru.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingBookings.map((b) => {
              const v = vehicles.find((item) => item.id === b.vehicleId);

              return (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl border border-amber-200 bg-amber-50/20 hover:bg-amber-50/40 transition-colors text-xs space-y-4"
                >
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200 text-xs">
                        {b.bookingCode}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{b.borrowerName}</span>
                      <span className="text-slate-500 text-[11px]">({b.division})</span>
                    </div>

                    <span className="text-[11px] font-semibold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                      Kategori: {b.purposeCategory}
                    </span>
                  </div>

                  {/* Detail Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Armada Diminta
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <Car className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            {v?.name || 'Kendaraan'}
                          </p>
                          <p className="font-mono text-[11px] text-emerald-800">{v?.plateNumber}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Jadwal Reservasi
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {b.startDate} ({b.startTime})
                          </p>
                          <p className="text-[11px] text-slate-500">
                            s.d. {b.endDate} ({b.endTime})
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Tujuan &amp; Agenda
                      </span>
                      <p className="font-medium text-slate-900 mt-1 line-clamp-1">
                        {b.destination}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{b.purpose}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Driver &amp; Muatan
                      </span>
                      <p className="font-medium text-slate-900 mt-1">{b.driverType}</p>
                      <p className="text-[11px] text-slate-500">
                        Penumpang: {b.passengerCount} orang
                      </p>
                      {b.estimatedInfaq ? (
                        <p className="text-[11px] font-mono text-emerald-800 font-bold mt-0.5">
                          Infaq: Rp {b.estimatedInfaq.toLocaleString('id-ID')}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-3 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      No. Kontak: <strong className="font-mono">{b.phone}</strong> · Diajukan:{' '}
                      {b.createdAt}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenRejectModal(b)}
                        className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                        Tolak
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenApproveModal(b)}
                        className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        Setujui (ACC Booking)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* History of Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Riwayat Keputusan Otorisasi Koordinator
        </h3>

        <div className="space-y-3">
          {pastActionedBookings.slice(0, 5).map((b) => {
            const v = vehicles.find((item) => item.id === b.vehicleId);
            return (
              <div
                key={b.id}
                className="p-3.5 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800">{b.bookingCode}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-bold text-slate-900">{b.borrowerName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'Disetujui'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {v?.name} · {b.destination} ({b.startDate})
                  </p>
                  {b.coordinatorNotes && (
                    <p className="text-emerald-800 text-[11px] italic mt-0.5">
                      Catatan: &quot;{b.coordinatorNotes}&quot;
                    </p>
                  )}
                  {b.rejectionReason && (
                    <p className="text-rose-700 text-[11px] italic mt-0.5">
                      Alasan Tolak: &quot;{b.rejectionReason}&quot;
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {b.status === 'Disetujui' && (
                    <button
                      type="button"
                      onClick={() =>
                        setPrintDoc({
                          type: 'surat-jalan',
                          data: b,
                        })
                      }
                      className="px-3 py-1 bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Surat Jalan
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Approval or Rejection Modal */}
      {selectedBookingForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div
              className={`p-5 text-white flex items-center justify-between ${
                actionType === 'approve' ? 'bg-emerald-800' : 'bg-rose-800'
              }`}
            >
              <h3 className="font-bold text-sm">
                {actionType === 'approve'
                  ? 'Konfirmasi Persetujuan (ACC Booking)'
                  : 'Konfirmasi Penolakan Permohonan'}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedBookingForAction(null)}
                className="text-white/80 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">
                  {selectedBookingForAction.borrowerName} ({selectedBookingForAction.division})
                </p>
                <p className="text-slate-600">
                  Keperluan: {selectedBookingForAction.purpose} &rarr;{' '}
                  {selectedBookingForAction.destination}
                </p>
                <p className="text-slate-500 font-mono text-[11px]">
                  Jadwal: {selectedBookingForAction.startDate} ({selectedBookingForAction.startTime}) -{' '}
                  {selectedBookingForAction.endDate} ({selectedBookingForAction.endTime})
                </p>
              </div>

              {actionType === 'approve' ? (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tetapkan Sopir Bertugas
                    </label>
                    <input
                      type="text"
                      value={assignedDriver}
                      onChange={(e) => setAssignedDriver(e.target.value)}
                      placeholder="Contoh: Pak Bambang (Sopir Sarpras)"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Catatan Koordinator untuk Surat Tugas *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={coordinatorNotes}
                      onChange={(e) => setCoordinatorNotes(e.target.value)}
                      placeholder="Masukkan catatan otorisasi jalan..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alasan Penolakan Booking *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Contoh: Jadwal bertabrakan dengan kegiatan santri pondok..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForAction(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className={`px-5 py-2.5 text-white rounded-xl font-semibold shadow-xs ${
                    actionType === 'approve'
                      ? 'bg-emerald-700 hover:bg-emerald-800'
                      : 'bg-rose-700 hover:bg-rose-800'
                  }`}
                >
                  {actionType === 'approve' ? 'Terbitkan ACC Resmi' : 'Konfirmasi Tolak'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
