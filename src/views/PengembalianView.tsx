/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HandoverReturn, FuelStripLevel } from '../types';
import {
  RotateCcw,
  CheckCircle2,
  Gauge,
  Fuel,
  Printer,
  Sparkles,
  AlertTriangle,
  Car,
  Coins,
  ShieldCheck,
  CheckSquare,
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
  const activeVehicle = vehicles.find((v) => v.id === activeBooking?.vehicleId) || vehicles[0];
  const startOdo = activeBooking?.handoverIn?.odometerKm || activeVehicle?.odometerKm || 38450;

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 5);

  const [formData, setFormData] = useState({
    date: dateStr,
    time: timeStr,
    odometerKm: startOdo + 85,
    fuelLevel: 'Strip 3 (Full / Penuh)' as FuelStripLevel,
    interiorClean: true,
    exteriorClean: true,
    isWashed: true,
    carCoverClosed: true,
    newDefectsNotes: '',
    returneeSignatureName: activeBooking?.borrowerName || '',
    lateMinutes: 0,
    extraCleaningFee: 0,
    settlementNotes: 'Pengembalian selesai dalam kondisi baik, bensin strip 3 full, dan cover mobil tertutup rapi.',
  });

  const distanceTraveled = Math.max(0, Number(formData.odometerKm) - startOdo);

  const handleSelectBooking = (id: string) => {
    setSelectedBookingId(id);
    const b = bookings.find((item) => item.id === id);
    const v = vehicles.find((item) => item.id === b?.vehicleId) || vehicles[0];
    const initialKm = b?.handoverIn?.odometerKm || v?.odometerKm || 38450;
    setFormData((prev) => ({
      ...prev,
      odometerKm: initialKm + 60,
      returneeSignatureName: b?.borrowerName || '',
    }));
  };

  const handleCleanlinessToggle = (isClean: boolean) => {
    const penalty = isClean ? 0 : (settings.washingPenaltyAmount || 35000);
    setFormData((prev) => ({
      ...prev,
      isWashed: isClean,
      exteriorClean: isClean,
      extraCleaningFee: penalty,
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

  const totalPayable =
    (activeBooking?.estimatedInfaq || 0) + formData.extraCleaningFee;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-blue-700" />
            Berita Acara Pengembalian Kendaraan Yayasan (BAST RETURN)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemeriksaan selisih KM, evaluasi BBM Strip 3, denda cuci Rp 35.000, &amp; checklist cover mobil tertutup
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-xl">
          {activeTrips.length} Sedang Beroperasi
        </span>
      </div>

      {activeTrips.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <p className="font-bold text-slate-800 text-sm">Tidak ada kendaraan yang sedang dalam perjalanan.</p>
          <p className="max-w-md mx-auto text-slate-500">
            Suzuki APV saat ini telah kembali dan terparkir dengan cover tertutup di garasi sarpras yayasan.
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
              {activeTrips.map((b) => (
                <option key={b.id} value={b.id}>
                  [{b.bookingCode}] {b.borrowerName} (Unit: {b.division}) &mdash; Suzuki APV (B 1928 SDZ)
                </option>
              ))}
            </select>

            {activeBooking && (
              <div className="mt-3 p-4 bg-blue-50/70 border border-blue-200 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-blue-800 block">Unit Kendaraan</span>
                  <p className="font-bold text-slate-900">Suzuki APV Arena GX Luxury</p>
                  <p className="font-mono text-blue-900 text-[11px]">B 1928 SDZ</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-blue-800 block">Peminjam / Unit</span>
                  <p className="font-bold text-slate-900">{activeBooking.borrowerName}</p>
                  <p className="text-slate-600 text-[11px]">{activeBooking.division} Daar el Dzikr</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-blue-800 block">KM Awal Berangkat</span>
                  <p className="font-bold font-mono text-slate-900 text-sm">
                    {(startOdo ?? 0).toLocaleString('id-ID')} KM
                  </p>
                  <p className="text-[11px] text-slate-500">BBM Awal: {activeBooking.handoverIn?.fuelLevel || 'Strip 3'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-blue-800 block">Kategori Kepentingan</span>
                  <p className="font-bold text-slate-900">{activeBooking.purposeCategory}</p>
                  {activeBooking.estimatedInfaq ? (
                    <p className="text-emerald-800 font-bold font-mono text-[11px]">
                      Infaq: Rp {(activeBooking.estimatedInfaq ?? 0).toLocaleString('id-ID')}
                    </p>
                  ) : (
                    <p className="text-slate-400 text-[11px]">Kedinasan Yayasan</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Waktu Kembali, Odometer Akhir & BBM 3 Strip */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block font-bold text-slate-800 mb-3 uppercase tracking-wider text-[11px]">
              2. Tanggal, Jam Kembali Aktual, Odometer &amp; Level Bensin (3 Strip)
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
                      fuelLevel: e.target.value as FuelStripLevel,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-900"
                >
                  <option value="Strip 3 (Full / Penuh)">Strip 3 (Full / Penuh) - Sesuai Semula</option>
                  <option value="Strip 2 (Sedang)">Strip 2 (Sedang)</option>
                  <option value="Strip 1 (E / Rendah)">Strip 1 (E / Rendah)</option>
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

          {/* Step 3: Klausul Kebersihan (Denda Cuci 35k) & Cover Mobil Tertutup */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              3. Evaluasi Kebersihan (Cuci 35k) &amp; Pemasangan Cover Mobil
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
                  <span className="font-bold">Kondisi Bersih (Sudah Dicuci Steam)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Kabin bersih, bodi luar dicuci rapi. Bebas biaya tambahan cuci steam.
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
                  <span className="font-bold">Kondisi Kotor (Pengganti Cuci Rp 35.000)</span>
                </div>
                <p className="text-[11px] text-rose-700">
                  Dikenakan biaya pengganti cuci: <strong className="font-mono">Rp {(settings.washingPenaltyAmount || 35000).toLocaleString('id-ID')} (35k)</strong> untuk ongkos cuci steam sarpras.
                </p>
              </div>
            </div>

            {/* MANDATORY CHECKLIST: COVER MOBIL TERTUTUP */}
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.carCoverClosed}
                  onChange={(e) =>
                    setFormData({ ...formData, carCoverClosed: e.target.checked })
                  }
                  className="w-5 h-5 text-emerald-700 rounded focus:ring-emerald-500 border-slate-300"
                />
                <div>
                  <span className="font-bold text-slate-900 text-xs">
                    Cover mobil dalam keadaan tertutup (terpasang rapi di garasi yayasan) *
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Sesuai SOP Bab III Pasal 3.2, peminjam wajib memasang cover / sarung mobil Suzuki APV sebelum meninggalkan garasi.
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Catatan Temuan / Kerusakan Baru Pasca Perjalanan (Jika Ada)
              </label>
              <input
                type="text"
                placeholder="Contoh: Bodi aman tidak ada lecet, cover mobil terpasang rapi, kunci dan STNK lengkap diserahkan."
                value={formData.newDefectsNotes}
                onChange={(e) => setFormData({ ...formData, newDefectsNotes: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* Step 4: Rekapitulasi Biaya & Tanda Tangan */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            {totalPayable > 0 && (
              <div className="p-4 bg-emerald-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-amber-300 text-sm">
                    Total Kewajiban Pembayaran (Infaq &amp; Pengganti Cuci)
                  </p>
                  <p className="text-emerald-200 text-[11px] mt-0.5">
                    {activeBooking?.estimatedInfaq ? `Infaq Pribadi: Rp ${(activeBooking.estimatedInfaq ?? 0).toLocaleString('id-ID')}` : 'Kedinasan Bebas Infaq'}
                    {formData.extraCleaningFee > 0 ? ` + Pengganti Cuci: Rp ${(formData.extraCleaningFee ?? 0).toLocaleString('id-ID')} (35k)` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-300">Total Dibayarkan:</span>
                  <p className="font-mono text-xl font-bold text-amber-300">
                    Rp {(totalPayable ?? 0).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap Peminjam yang Menyerahkan Kembali *
              </label>
              <input
                type="text"
                required
                value={formData.returneeSignatureName}
                onChange={(e) =>
                  setFormData({ ...formData, returneeSignatureName: e.target.value })
                }
                className="w-full max-w-md px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs flex items-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Selesaikan BAST Pengembalian &amp; Cetak Berkas
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
          {completedReturns.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800">{b.bookingCode}</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-bold text-slate-900">{b.borrowerName}</span>
                  <span className="text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                    Unit: {b.division}
                  </span>
                  <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px]">
                    Selesai Dikembalikan
                  </span>
                </div>

                <p className="text-slate-600 mt-1">
                  Dikembalikan: <strong className="font-mono">{b.handoverReturn?.date} {b.handoverReturn?.time}</strong> · Jarak Tempuh:{' '}
                  <strong className="font-mono font-bold text-emerald-800">{b.handoverReturn?.distanceTraveledKm} KM</strong> · Level BBM: {b.handoverReturn?.fuelLevel} · Cuci: {b.handoverReturn?.isWashed ? 'Bersih' : 'Kotor (35k)'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span className="text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                    Cover Mobil: {b.handoverReturn?.carCoverClosed ? 'Tertutup Rapi' : 'Belum Ditutup'}
                  </span>
                  <span>·</span>
                  <span>Catatan: {b.handoverReturn?.newDefectsNotes || 'Kondisi mulus tanpa cacat baru.'}</span>
                </div>
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
          ))}
        </div>
      </div>
    </div>
  );
};
