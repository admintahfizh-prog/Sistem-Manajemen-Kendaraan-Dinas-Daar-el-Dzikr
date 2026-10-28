/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HandoverReturn } from '../types';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  Gauge,
  Fuel,
  Printer,
  Sparkles,
  AlertTriangle,
  Car,
} from 'lucide-react';

export const PengembalianView: React.FC = () => {
  const {
    bookings,
    vehicles,
    submitHandoverReturn,
    setPrintDoc,
    settings,
    setActiveTab,
  } = useApp();

  // Bookings currently active / in trip
  const activeTrips = bookings.filter((b) => b.status === 'Sedang Berjalan' && !b.handoverReturn);
  const completedReturns = bookings.filter((b) => !!b.handoverReturn);

  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    activeTrips[0]?.id || ''
  );

  const activeBooking = bookings.find((b) => b.id === selectedBookingId);
  const activeVehicle = vehicles.find((v) => v.id === activeBooking?.vehicleId);
  const startOdo = activeBooking?.handoverIn?.odometerKm || activeVehicle?.odometerKm || 20000;

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 5);

  const [formData, setFormData] = useState({
    date: dateStr,
    time: timeStr,
    odometerKm: startOdo + 85,
    fuelLevel: 'Full' as HandoverReturn['fuelLevel'],
    interiorClean: true,
    exteriorClean: true,
    isWashed: true,
    newDefectsNotes: '',
    inspectorName: settings.coordinatorName,
    returneeSignatureName: activeBooking?.borrowerName || '',
    lateMinutes: 0,
    extraCleaningFee: 0,
    settlementNotes: 'Pengembalian selesai dalam kondisi baik sesuai klausul SOP.',
  });

  const distanceTraveled = Math.max(0, Number(formData.odometerKm) - startOdo);

  const handleSelectBooking = (id: string) => {
    setSelectedBookingId(id);
    const b = bookings.find((item) => item.id === id);
    const v = vehicles.find((item) => item.id === b?.vehicleId);
    const initialKm = b?.handoverIn?.odometerKm || v?.odometerKm || 20000;
    setFormData((prev) => ({
      ...prev,
      odometerKm: initialKm + 50,
      returneeSignatureName: b?.borrowerName || '',
    }));
  };

  const handleCleanlinessToggle = (isClean: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isWashed: isClean,
      exteriorClean: isClean,
      extraCleaningFee: isClean ? 0 : settings.washingPenaltyAmount,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) {
      alert('Pilih kendaraan yang sedang digunakan untuk dikembalikan.');
      return;
    }

    if (Number(formData.odometerKm) < startOdo) {
      alert(`Odometer akhir (${formData.odometerKm} KM) tidak boleh lebih kecil dari KM awal (${startOdo} KM).`);
      return;
    }

    submitHandoverReturn(selectedBookingId, {
      ...formData,
      odometerKm: Number(formData.odometerKm),
      distanceTraveledKm: distanceTraveled,
    });

    const target = bookings.find((b) => b.id === selectedBookingId);
    if (target) {
      setPrintDoc({
        type: 'bast-return',
        data: {
          ...target,
          handoverReturn: {
            ...formData,
            id: 'temp',
            bookingId: target.id,
            distanceTraveledKm: distanceTraveled,
          },
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-blue-700" />
            Berita Acara Pengembalian Kendaraan (Check-in Serah Kembali)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemeriksaan selisih jarak tempuh (KM), evaluasi BBM, kebersihan, dan penyelesaian administrasi
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-xl">
          {activeTrips.length} Sedang Beroperasi
        </span>
      </div>

      {activeTrips.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <p className="font-bold text-slate-800 text-sm">Tidak ada kendaraan dinas yang sedang dalam perjalanan.</p>
          <p className="max-w-md mx-auto text-slate-500">
            Semua kendaraan dinas saat ini telah kembali dan terparkir di garasi sarpras sekolah.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('booking')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold transition-colors shadow-xs"
          >
            Buat Reservasi Baru &rarr;
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-6 text-xs">
          {/* Step 1: Select Active Trip */}
          <div>
            <label className="block font-bold text-slate-800 mb-2 uppercase tracking-wider text-[11px]">
              1. Pilih Kendaraan Dinas yang Dikembalikan *
            </label>
            <select
              value={selectedBookingId}
              onChange={(e) => handleSelectBooking(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 text-xs"
            >
              {activeTrips.map((b) => {
                const v = vehicles.find((item) => item.id === b.vehicleId);
                return (
                  <option key={b.id} value={b.id}>
                    [{b.bookingCode}] {b.borrowerName} ({b.division}) &mdash; {v?.name} ({v?.plateNumber})
                  </option>
                );
              })}
            </select>

            {activeBooking && activeVehicle && (
              <div className="mt-3 p-4 bg-blue-50/70 border border-blue-200 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-blue-800 block">Unit Kendaraan</span>
                  <p className="font-bold text-slate-900">{activeVehicle.name}</p>
                  <p className="font-mono text-blue-900 text-[11px]">{activeVehicle.plateNumber}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-blue-800 block">Pengemudi / Pemohon</span>
                  <p className="font-bold text-slate-900">{activeBooking.borrowerName}</p>
                  <p className="text-slate-600 text-[11px]">{activeBooking.division}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-blue-800 block">KM Awal Berangkat</span>
                  <p className="font-bold font-mono text-slate-900 text-sm">
                    {startOdo.toLocaleString('id-ID')} KM
                  </p>
                  <p className="text-[11px] text-slate-500">BBM Awal: {activeBooking.handoverIn?.fuelLevel || 'Full'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-blue-800 block">Kategori Kepentingan</span>
                  <p className="font-bold text-slate-900">{activeBooking.purposeCategory}</p>
                  {activeBooking.estimatedInfaq ? (
                    <p className="text-emerald-800 font-bold font-mono text-[11px]">
                      Infaq: Rp {activeBooking.estimatedInfaq.toLocaleString('id-ID')}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Waktu Kembali & Odometer Akhir */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block font-bold text-slate-800 mb-3 uppercase tracking-wider text-[11px]">
              2. Tanggal, Jam Kembali Aktual &amp; Odometer Akhir
            </label>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal Kembali Aktual *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jam Kembali Aktual *</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Odometer Akhir (KM) *</label>
                <input
                  type="number"
                  required
                  min={startOdo}
                  value={formData.odometerKm}
                  onChange={(e) => setFormData({ ...formData, odometerKm: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Level BBM Saat Kembali *</label>
                <select
                  value={formData.fuelLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fuelLevel: e.target.value as HandoverReturn['fuelLevel'],
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="Full">Full (Sesuai Semula)</option>
                  <option value="3/4">3/4 Tangki</option>
                  <option value="1/2">1/2 Tangki (Kurang)</option>
                  <option value="1/4">1/4 Tangki (Kritis)</option>
                </select>
              </div>
            </div>

            {/* Calculated Distance banner */}
            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <span className="text-slate-600">Total Jarak Tempuh Perjalanan (Selisih KM):</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {distanceTraveled} KM
              </span>
            </div>
          </div>

          {/* Step 3: Klausul Kebersihan & Cuci Mobil */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block font-bold text-slate-800 mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              3. Evaluasi Kebersihan Sesuai Klausul SOP Bab V (&quot;Bawa Bersih, Pulang Bersih&quot;)
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => handleCleanlinessToggle(true)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.isWashed
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className={`w-4 h-4 ${formData.isWashed ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="font-bold">Kondisi Bersih (Sudah Dicuci &amp; Bebas Sampah)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Kabin rapi, bodi luar bersih. Tidak ada biaya tambahan kebersihan yang dikenakan.
                </p>
              </div>

              <div
                onClick={() => handleCleanlinessToggle(false)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  !formData.isWashed
                    ? 'border-rose-600 bg-rose-50/50 text-rose-950 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className={`w-4 h-4 ${!formData.isWashed ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span className="font-bold">Kondisi Kotor (Belum Dicuci)</span>
                </div>
                <p className="text-[11px] text-rose-700">
                  Dikenakan biaya cuci steam sekolah: <strong className="font-mono">Rp {settings.washingPenaltyAmount.toLocaleString('id-ID')}</strong> (SOP Bab V Pasal 5.2).
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-semibold text-slate-700 mb-1">
                Catatan Temuan / Kerusakan Baru Pasca Perjalanan
              </label>
              <input
                type="text"
                placeholder="Contoh: Kondisi mesin prima, tidak ada lecet baru; kunci dan STNK lengkap."
                value={formData.newDefectsNotes}
                onChange={(e) => setFormData({ ...formData, newDefectsNotes: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* Step 4: Tanda Tangan */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Peminjam / Pengemudi yang Mengembalikan *
              </label>
              <input
                type="text"
                required
                value={formData.returneeSignatureName}
                onChange={(e) =>
                  setFormData({ ...formData, returneeSignatureName: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Petugas Penerima Sarpras *
              </label>
              <input
                type="text"
                required
                value={formData.inspectorName}
                onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold shadow-xs flex items-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Selesaikan BAST Pengembalian &amp; Cetak Tanda Terima
            </button>
          </div>
        </form>
      )}

      {/* History of Completed Returns */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Riwayat Berita Acara Pengembalian (BAST RETURN)
        </h3>

        <div className="space-y-3">
          {completedReturns.map((b) => {
            const v = vehicles.find((item) => item.id === b.vehicleId);
            return (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800">{b.bookingCode}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-bold text-slate-900">{b.borrowerName}</span>
                    <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px]">
                      Selesai Dikembalikan
                    </span>
                  </div>

                  <p className="text-slate-600 mt-1">
                    Dikembalikan: <strong className="font-mono">{b.handoverReturn?.date} {b.handoverReturn?.time}</strong> · Jarak Tempuh:{' '}
                    <strong className="font-mono font-bold text-emerald-800">{b.handoverReturn?.distanceTraveledKm} KM</strong> · Kebersihan: {b.handoverReturn?.isWashed ? 'Bersih' : 'Kotor'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Inspektur: {b.handoverReturn?.inspectorName} · Catatan: {b.handoverReturn?.newDefectsNotes || 'Kondisi mulus tanpa cacat baru.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setPrintDoc({
                      type: 'bast-return',
                      data: b,
                    })
                  }
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-blue-700 rounded-xl font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak BAST Return
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
