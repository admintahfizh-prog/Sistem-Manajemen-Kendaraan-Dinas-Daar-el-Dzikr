/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, PurposeCategory } from '../types';
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  MapPin,
  Car,
  AlertCircle,
  CheckCircle2,
  Printer,
  FileText,
  HeartHandshake,
  ShieldAlert,
  Search,
} from 'lucide-react';

export const BookingView: React.FC = () => {
  const {
    vehicles,
    bookings,
    addBooking,
    cancelBooking,
    setPrintDoc,
    settings,
    setActiveTab,
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessNotice, setShowSuccessNotice] = useState<string | null>(null);

  // Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    vehicleId: vehicles[0]?.id || '',
    borrowerName: '',
    borrowerRole: 'Guru' as Booking['borrowerRole'],
    division: 'SMP Daar el Dzikr' as Booking['division'],
    phone: '',
    destination: '',
    purpose: '',
    purposeCategory: 'Kedinasan Sekolah' as PurposeCategory,
    startDate: tomorrowStr,
    startTime: '08:00',
    endDate: tomorrowStr,
    endTime: '17:00',
    passengerCount: 4,
    driverType: 'Sopir Sekolah' as Booking['driverType'],
    driverName: '',
    estimatedInfaq: 0,
  });

  // Calculate estimated infaq if personal use
  const calculateInfaq = (category: PurposeCategory, start: string, end: string) => {
    if (category !== 'Perorangan / Pribadi Guru') return 0;
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.max(0, d2.getTime() - d1.getTime());
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
    return diffDays * settings.defaultInfaqPerDay;
  };

  // Conflict Detection Logic
  const checkScheduleConflict = (
    vehId: string,
    sDate: string,
    sTime: string,
    eDate: string,
    eTime: string
  ): { hasConflict: boolean; conflictingBooking?: Booking } => {
    const newStart = new Date(`${sDate}T${sTime}`).getTime();
    const newEnd = new Date(`${eDate}T${eTime}`).getTime();

    const conflict = bookings.find((b) => {
      if (b.vehicleId !== vehId) return false;
      if (b.status === 'Ditolak' || b.status === 'Dibatalkan' || b.status === 'Selesai') return false;

      const existStart = new Date(`${b.startDate}T${b.startTime}`).getTime();
      const existEnd = new Date(`${b.endDate}T${b.endTime}`).getTime();

      // Overlap condition
      return newStart < existEnd && newEnd > existStart;
    });

    return {
      hasConflict: !!conflict,
      conflictingBooking: conflict,
    };
  };

  const currentConflict = checkScheduleConflict(
    formData.vehicleId,
    formData.startDate,
    formData.startTime,
    formData.endDate,
    formData.endTime
  );

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.borrowerName || !formData.destination || !formData.purpose) {
      alert('Mohon lengkapi data pemohon, tujuan, dan keperluan.');
      return;
    }

    if (currentConflict.hasConflict) {
      if (
        !confirm(
          `Perhatian: Jadwal ini bertabrakan dengan booking ${currentConflict.conflictingBooking?.bookingCode} (${currentConflict.conflictingBooking?.borrowerName}). Tetap kirim permohonan ke Koordinator untuk dipertimbangkan?`
        )
      ) {
        return;
      }
    }

    const calculatedInfaq = calculateInfaq(
      formData.purposeCategory,
      formData.startDate,
      formData.endDate
    );

    const newBooking = addBooking({
      ...formData,
      estimatedInfaq: calculatedInfaq,
    });

    setShowSuccessNotice(newBooking.bookingCode);

    // Reset form partially
    setFormData((prev) => ({
      ...prev,
      destination: '',
      purpose: '',
    }));
  };

  const filteredBookings = bookings.filter((b) => {
    const matchFilter = activeTabFilter === 'Semua' || b.status === activeTabFilter;
    const matchSearch =
      b.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Success Notification Alert */}
      {showSuccessNotice && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900 shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">
                Permohonan Booking Berhasil Diajukan! (Kode: {showSuccessNotice})
              </p>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                Permohonan telah masuk ke antrean ACC Koordinator Sarpras. Anda dapat memantau statusnya di bawah.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccessNotice(null)}
            className="text-xs font-semibold text-emerald-800 hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Booking Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-emerald-700" />
              Formulir Reservasi Kendaraan Dinas (Hari &amp; Jam)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sesuai klausul SOP Bab I &amp; II Sekolah Daar el Dzikr
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Wajib Otorisasi ACC
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Section 1: Pemohon */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              1. Identitas Pemohon &amp; Lembaga
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pemohon *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ust. Ahmad, S.Pd"
                  value={formData.borrowerName}
                  onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status / Jabatan</label>
                <select
                  value={formData.borrowerRole}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      borrowerRole: e.target.value as Booking['borrowerRole'],
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                >
                  <option value="Guru">Guru / Pengajar</option>
                  <option value="Staf">Staf Operasional</option>
                  <option value="Pimpinan Yayasan">Pimpinan Yayasan</option>
                  <option value="Santri / Panitia">Santri / Panitia Kegiatan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit Kerja / Divisi</label>
                <select
                  value={formData.division}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      division: e.target.value as Booking['division'],
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                >
                  <option value="SD Daar el Dzikr">SD Daar el Dzikr</option>
                  <option value="SMP Daar el Dzikr">SMP Daar el Dzikr</option>
                  <option value="SMA Daar el Dzikr">SMA Daar el Dzikr</option>
                  <option value="Pondok Pesantren">Pondok Pesantren</option>
                  <option value="Yayasan Daar el Dzikr">Yayasan Daar el Dzikr</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 0812-3456-7890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pemilihan Unit & Jadwal */}
          <div className="pt-3 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-slate-500" />
              2. Pilihan Armada Kendaraan &amp; Jadwal (Hari &amp; Jam)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Unit Dropdown */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Unit Kendaraan Dinas *
                </label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-medium text-slate-900"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.plateNumber}) - {v.status}
                    </option>
                  ))}
                </select>

                {selectedVehicle && (
                  <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                    <img
                      src={selectedVehicle.imageUrl}
                      alt={selectedVehicle.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="text-[11px] min-w-0">
                      <p className="font-bold text-slate-900 truncate">{selectedVehicle.name}</p>
                      <p className="text-slate-500">
                        Kapasitas: {selectedVehicle.capacity} seat · {selectedVehicle.fuelType}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tanggal & Jam Mulai */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tgl Mulai *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Mulai *</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Tanggal & Jam Selesai */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tgl Selesai *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Selesai *</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Conflict Warning */}
            {currentConflict.hasConflict && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold">Peringatan Bentrok Jadwal:</span> Unit{' '}
                  <strong>{selectedVehicle?.name}</strong> telah memiliki jadwal booking pada rentang
                  waktu tersebut (Booking:{' '}
                  <span className="font-mono font-bold">
                    {currentConflict.conflictingBooking?.bookingCode}
                  </span>{' '}
                  oleh {currentConflict.conflictingBooking?.borrowerName}). Koordinator sarpras
                  mungkin akan meminta pengalihan ke unit lain atau penyesuaian jam.
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Keperluan & Klausul Infaq */}
          <div className="pt-3 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              3. Rincian Kegiatan &amp; Kategori Kepentingan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kategori Penggunaan *
                </label>
                <select
                  value={formData.purposeCategory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      purposeCategory: e.target.value as PurposeCategory,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-medium"
                >
                  <option value="Kedinasan Sekolah">Kedinasan Sekolah (Gratis / Operasional)</option>
                  <option value="Antar Jemput Santri / Lomba">Antar Jemput Santri / Lomba</option>
                  <option value="Kegiatan Yayasan">Kegiatan Yayasan</option>
                  <option value="Perorangan / Pribadi Guru">
                    Perorangan / Pribadi Guru (Dikenakan Infaq)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lokasi / Kota Tujuan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gedung Guru Kemenag Kota / Bandung"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jumlah Penumpang (Orang)
                </label>
                <input
                  type="number"
                  min={1}
                  max={selectedVehicle?.capacity || 20}
                  value={formData.passengerCount}
                  onChange={(e) =>
                    setFormData({ ...formData, passengerCount: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Deskripsi Keperluan / Agenda *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mengantar tim lomba cerdas cermat santri Daar el Dzikr"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilihan Sopir</label>
                <select
                  value={formData.driverType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      driverType: e.target.value as Booking['driverType'],
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                >
                  <option value="Sopir Sekolah">Gunakan Sopir Sarpras Sekolah</option>
                  <option value="Bawa Sendiri (SIM A/B1 Sah)">
                    Bawa Sendiri (Memiliki SIM Sah &amp; Mahir)
                  </option>
                </select>
              </div>
            </div>

            {/* Infaq Estimate Box for Personal use */}
            {formData.purposeCategory === 'Perorangan / Pribadi Guru' && (
              <div className="mt-4 p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <HeartHandshake className="w-4 h-4 text-emerald-700" />
                  Klausul Pemakaian Perorangan (Infaq Pemeliharaan Armada)
                </div>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  Sesuai SOP Bab IV, pemakaian untuk kepentingan pribadi guru/keluarga dikenakan anjuran infaq
                  sebesar{' '}
                  <span className="font-mono font-bold">
                    Rp {settings.defaultInfaqPerDay.toLocaleString('id-ID')} / hari
                  </span>{' '}
                  untuk tabungan ganti oli &amp; perawatan armada dinas.
                </p>
                <div className="pt-2 flex items-baseline gap-2">
                  <span className="text-slate-600">Estimasi Infaq yang Dianjurkan:</span>
                  <span className="text-sm font-bold font-mono text-emerald-900">
                    Rp{' '}
                    {calculateInfaq(
                      formData.purposeCategory,
                      formData.startDate,
                      formData.endDate
                    ).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-xs flex items-center gap-2 text-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Ajukan Permohonan Booking
            </button>
          </div>
        </form>
      </div>

      {/* Bookings List Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Daftar Rekap Booking Kendaraan</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau jadwal, status verifikasi ACC, dan tiket perjalanan
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pemohon / kode booking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs mb-4">
          {['Semua', 'Menunggu ACC', 'Disetujui', 'Sedang Berjalan', 'Selesai'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveTabFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTabFilter === f
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Bookings Table / List */}
        <div className="space-y-3">
          {filteredBookings.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">
              Belum ada riwayat booking pada kategori ini.
            </p>
          ) : (
            filteredBookings.map((b) => {
              const v = vehicles.find((item) => item.id === b.vehicleId);
              return (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-white text-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-slate-800 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {b.bookingCode}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="font-bold text-slate-900">{b.borrowerName}</span>
                      <span className="text-slate-500 text-[11px]">({b.division})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          b.status === 'Disetujui'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : b.status === 'Menunggu ACC'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : b.status === 'Sedang Berjalan'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : b.status === 'Selesai'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>

                  {/* Booking details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-slate-600">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Unit Kendaraan
                      </span>
                      <p className="font-bold text-slate-900 mt-0.5">
                        {v?.name || 'Kendaraan'} ({v?.plateNumber})
                      </p>
                      <p className="text-[11px] text-slate-500">{v?.type}</p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Jadwal Penggunaan
                      </span>
                      <p className="font-medium text-slate-900 mt-0.5">
                        {b.startDate} ({b.startTime}) s.d.
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {b.endDate} ({b.endTime})
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Tujuan &amp; Keperluan
                      </span>
                      <p className="font-medium text-slate-900 mt-0.5 truncate">{b.destination}</p>
                      <p className="text-[11px] text-slate-500 truncate">{b.purpose}</p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Sopir &amp; Infaq
                      </span>
                      <p className="font-medium text-slate-900 mt-0.5">{b.driverType}</p>
                      {b.estimatedInfaq ? (
                        <p className="text-[11px] font-mono text-emerald-700 font-semibold">
                          Infaq: Rp {b.estimatedInfaq.toLocaleString('id-ID')}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400">Kedinasan Resmi</p>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="text-slate-400">
                      Diajukan pada: {b.createdAt}
                      {b.coordinatorNotes && (
                        <span className="ml-2 text-emerald-800 font-medium">
                          Catatan Koordinator: &quot;{b.coordinatorNotes}&quot;
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status === 'Disetujui' && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setPrintDoc({
                                type: 'surat-jalan',
                                data: b,
                              })
                            }
                            className="px-3 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Cetak Surat Tugas Jalan
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveTab('pengambilan')}
                            className="px-3 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-semibold transition-colors"
                          >
                            Ke Form Pengambilan &rarr;
                          </button>
                        </>
                      )}

                      {b.status === 'Sedang Berjalan' && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('pengembalian')}
                          className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                        >
                          Check-in Pengembalian &rarr;
                        </button>
                      )}

                      {b.status === 'Menunggu ACC' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Batalkan permohonan booking ini?')) {
                              cancelBooking(b.id);
                            }
                          }}
                          className="text-rose-600 hover:underline font-semibold"
                        >
                          Batalkan Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
