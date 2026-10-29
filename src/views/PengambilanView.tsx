/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HandoverIn, FuelStripLevel } from '../types';
import {
  KeyRound,
  CheckCircle2,
  Gauge,
  Fuel,
  Printer,
  Car,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

export const PengambilanView: React.FC = () => {
  const {
    bookings,
    vehicles,
    submitHandoverIn,
    setPrintDoc,
    setActiveTab,
  } = useApp();

  // Bookings that are approved and ready to be picked up
  const readyBookings = bookings.filter((b) => b.status === 'Disetujui' && !b.handoverIn);
  const checkedOutBookings = bookings.filter((b) => !!b.handoverIn);

  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    readyBookings[0]?.id || ''
  );

  const activeBooking = bookings.find((b) => b.id === selectedBookingId);
  const activeVehicle = vehicles.find((v) => v.id === activeBooking?.vehicleId) || vehicles[0];

  // Form State
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 5);

  const [formData, setFormData] = useState({
    date: dateStr,
    time: timeStr,
    odometerKm: activeVehicle?.odometerKm || 38450,
    fuelLevel: 'Strip 3 (Full / Penuh)' as FuelStripLevel,
    interiorClean: true,
    exteriorClean: true,
    tiresCondition: true,
    lightsAndHorn: true,
    brakesAndEngine: true,
    acWorking: true,
    toolsAndSpareTire: true,
    stnkAndKeys: true,
    initialDefectsNotes: '',
    borrowerSignatureName: activeBooking?.borrowerName || '',
  });

  const handleSelectBooking = (id: string) => {
    setSelectedBookingId(id);
    const b = bookings.find((item) => item.id === id);
    const v = vehicles.find((item) => item.id === b?.vehicleId);
    if (v) {
      setFormData((prev) => ({
        ...prev,
        odometerKm: v.odometerKm,
        borrowerSignatureName: b?.borrowerName || '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) {
      alert('Pilih jadwal booking yang siap diambil.');
      return;
    }

    submitHandoverIn(selectedBookingId, {
      ...formData,
      odometerKm: Number(formData.odometerKm),
    });

    const target = bookings.find((b) => b.id === selectedBookingId);
    if (target) {
      setPrintDoc({
        type: 'bast-in',
        data: {
          ...target,
          handoverIn: {
            ...formData,
            id: 'temp',
            bookingId: target.id,
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
            <KeyRound className="w-5 h-5 text-emerald-700" />
            Berita Acara Pengambilan Kendaraan Yayasan (BAST IN)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemeriksaan kondisi fisik Suzuki APV, Odometer KM awal, dan level Bensin (Indikator 3 Strip)
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl">
          {readyBookings.length} Siap Diambil
        </span>
      </div>

      {readyBookings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <p className="font-bold text-slate-800 text-sm">Tidak ada booking yang siap diambil saat ini.</p>
          <p className="max-w-md mx-auto text-slate-500">
            Pastikan permohonan booking telah disetujui (ACC) oleh Koordinator Sarpras pada menu ACC Koordinator.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('acc-coordinator')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold transition-colors shadow-xs"
          >
            Cek Menu ACC Koordinator &rarr;
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-6 text-xs">
          {/* Step 1: Select Approved Booking */}
          <div>
            <label className="block font-bold text-slate-800 mb-2 uppercase tracking-wider text-[11px]">
              1. Pilih Permohonan Booking yang Telah Di-ACC *
            </label>
            <select
              value={selectedBookingId}
              onChange={(e) => handleSelectBooking(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 text-xs"
            >
              {readyBookings.map((b) => (
                <option key={b.id} value={b.id}>
                  [{b.bookingCode}] {b.borrowerName} (Unit: {b.division}) &mdash; Suzuki APV ({b.startDate} {b.startTime})
                </option>
              ))}
            </select>

            {activeBooking && (
              <div className="mt-3 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-emerald-800 block">Armada Yayasan</span>
                  <p className="font-bold text-slate-900">Suzuki APV Arena GX Luxury</p>
                  <p className="font-mono text-emerald-900 text-[11px]">B 1928 SDZ</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-emerald-800 block">Peminjam &amp; Unit Kerja</span>
                  <p className="font-bold text-slate-900">{activeBooking.borrowerName}</p>
                  <p className="text-emerald-800 font-semibold text-[11px]">{activeBooking.division} Daar el Dzikr</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-emerald-800 block">Tujuan &amp; Agenda</span>
                  <p className="font-semibold text-slate-900 truncate">{activeBooking.destination}</p>
                  <p className="text-slate-600 text-[11px] truncate">{activeBooking.purpose}</p>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Waktu & Indikator Awal (3 Strip BBM) */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block font-bold text-slate-800 mb-3 uppercase tracking-wider text-[11px]">
              2. Tanggal, Jam Aktual &amp; Indikator BBM 3 Strip
            </label>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal Ambil Aktual *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jam Ambil Aktual *</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Odometer Awal (KM) *</label>
                <input
                  type="number"
                  required
                  value={formData.odometerKm}
                  onChange={(e) => setFormData({ ...formData, odometerKm: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Level Bensin (Sistem 3 Strip) *
                </label>
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
                  <option value="Strip 3 (Full / Penuh)">Strip 3 (Full / Penuh) - Standar Serah</option>
                  <option value="Strip 2 (Sedang)">Strip 2 (Sedang)</option>
                  <option value="Strip 1 (E / Rendah)">Strip 1 (E / Rendah)</option>
                </select>
              </div>
            </div>

            {/* Visual 3-Strip Meter */}
            <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700">
                <Fuel className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold">Indikator Bensin 3 Strip:</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-lg font-mono font-bold text-xs ${
                    formData.fuelLevel === 'Strip 1 (E / Rendah)'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  [ 1 ] Rendah
                </div>
                <div
                  className={`px-3 py-1 rounded-lg font-mono font-bold text-xs ${
                    formData.fuelLevel === 'Strip 2 (Sedang)'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  [ 2 ] Sedang
                </div>
                <div
                  className={`px-3 py-1 rounded-lg font-mono font-bold text-xs ${
                    formData.fuelLevel === 'Strip 3 (Full / Penuh)'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  [ 3 ] Full Penuh
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Checklist Kondisi Fisik */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block font-bold text-slate-800 mb-3 uppercase tracking-wider text-[11px]">
              3. Checklist Kondisi Fisik &amp; Kelengkapan Kendaraan
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: 'interiorClean', label: 'Kebersihan Kabin & Jok (Bebas sampah & wangi)' },
                { key: 'exteriorClean', label: 'Kebersihan Bodi Luar & Kaca Spion' },
                { key: 'tiresCondition', label: 'Kondisi 4 Roda & Tekanan Angin Normal' },
                { key: 'lightsAndHorn', label: 'Lampu Utama, Rem, Sein, & Klakson Berfungsi Normal' },
                { key: 'brakesAndEngine', label: 'Sistem Rem & Suara Mesin Normal' },
                { key: 'acWorking', label: 'AC Dingin & Hembusan Blower Normal' },
                { key: 'toolsAndSpareTire', label: 'Dongkrak, Kunci Roda, & Ban Serep Tersedia' },
                { key: 'stnkAndKeys', label: 'STNK Asli & Kunci Kontak Resmi Diterima' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData[item.key as keyof typeof formData] as boolean}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [item.key]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
                  />
                  <span className="font-medium text-slate-800">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 4: Catatan Cacat Awal */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan Kondisi Khusus / Goresan Bodi Awal (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Bodi mulus bersih, cover sarung mobil tersimpan rapi di bagasi belakang."
              value={formData.initialDefectsNotes}
              onChange={(e) => setFormData({ ...formData, initialDefectsNotes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>

          {/* Step 5: Tanda Tangan Penerima Kunci */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Lengkap Penerima Kunci / Peminjam *
            </label>
            <input
              type="text"
              required
              value={formData.borrowerSignatureName}
              onChange={(e) =>
                setFormData({ ...formData, borrowerSignatureName: e.target.value })
              }
              className="w-full max-w-md px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs flex items-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Selesaikan BAST Pengambilan (IN) &amp; Cetak Berkas
            </button>
          </div>
        </form>
      )}

      {/* History of Completed Handover IN */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Riwayat Berita Acara Pengambilan (BAST IN)
        </h3>

        <div className="space-y-3">
          {checkedOutBookings.map((b) => (
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
                    {b.division}
                  </span>
                </div>

                <p className="text-slate-600 mt-1">
                  Diambil: <strong className="font-mono">{b.handoverIn?.date} {b.handoverIn?.time}</strong> · Odometer Awal:{' '}
                  <strong className="font-mono">{(b.handoverIn?.odometerKm ?? 38450).toLocaleString('id-ID')} KM</strong> · Level BBM: <strong>{b.handoverIn?.fuelLevel}</strong>
                </p>
                <p className="text-[11px] text-slate-500">
                  Penerima Kunci: {b.handoverIn?.borrowerSignatureName} · Catatan: {b.handoverIn?.initialDefectsNotes || 'Kondisi prima mulus.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPrintDoc({
                    type: 'bast-in',
                    data: b,
                  })
                }
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-emerald-700 rounded-xl font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak BAST IN
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
