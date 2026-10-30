/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, PurposeCategory, UnitKerja } from '../types';
import {
  CalendarDays,
  User,
  Phone,
  MapPin,
  Car,
  AlertCircle,
  CheckCircle2,
  Printer,
  HeartHandshake,
  Search,
  Building,
  CreditCard,
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

  // Tomorrow as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  // Target Suzuki APV
  const apvVehicle = vehicles.find((v) => v.id === 'vh-apv') || vehicles[0];

  const [formData, setFormData] = useState({
    vehicleId: apvVehicle?.id || 'vh-apv',
    borrowerName: '',
    division: 'Pesantren' as UnitKerja,
    phone: '',
    destination: '',
    purpose: '',
    purposeCategory: 'Kedinasan Yayasan' as PurposeCategory,
    startDate: tomorrowStr,
    startTime: '08:00',
    endDate: tomorrowStr,
    endTime: '17:00',
  });

  // Calculate duration in hours
  const calculateDurationHours = (
    sDate: string,
    sTime: string,
    eDate: string,
    eTime: string
  ): number => {
    const t1 = new Date(`${sDate}T${sTime}`).getTime();
    const t2 = new Date(`${eDate}T${eTime}`).getTime();
    if (isNaN(t1) || isNaN(t2) || t2 <= t1) return 1;
    return Math.max(1, Math.ceil((t2 - t1) / (1000 * 60 * 60)));
  };

  // Infaq Calculation: 12 jam 50rb, 24 jam 100rb
  const calculateInfaq = (
    division: UnitKerja,
    category: PurposeCategory,
    sDate: string,
    sTime: string,
    eDate: string,
    eTime: string
  ): number => {
    if (division === 'Pribadi' || category === 'Keperluan Pribadi / Keluarga') {
      const hours = calculateDurationHours(sDate, sTime, eDate, eTime);
      const rate12 = settings.infaq12Hours || 50000;
      const rate24 = settings.infaq24Hours || 100000;

      if (hours <= 12) return rate12;
      if (hours <= 24) return rate24;

      const fullDays = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      const remainderCost =
        remainingHours === 0 ? 0 : remainingHours <= 12 ? rate12 : rate24;

      return fullDays * rate24 + remainderCost;
    }
    return 0;
  };

  const durationHours = calculateDurationHours(
    formData.startDate,
    formData.startTime,
    formData.endDate,
    formData.endTime
  );

  const estimatedInfaq = calculateInfaq(
    formData.division,
    formData.purposeCategory,
    formData.startDate,
    formData.startTime,
    formData.endDate,
    formData.endTime
  );

  // Conflict Detection
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
      if (b.status === 'Ditolak' || b.status === 'Dibatalkan' || b.status === 'Selesai')
        return false;

      const existStart = new Date(`${b.startDate}T${b.startTime}`).getTime();
      const existEnd = new Date(`${b.endDate}T${b.endTime}`).getTime();

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

    const newBooking = addBooking({
      ...formData,
      durationHours,
      estimatedInfaq,
    });

    setShowSuccessNotice(newBooking.bookingCode);

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
      b.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.division.toLowerCase().includes(searchQuery.toLowerCase());
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
                Permohonan telah masuk ke antrean ACC Koordinator Sarpras. Notifikasi suara otomatis dikirimkan ke koordinator.
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-5 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-emerald-700" />
              Formulir Reservasi Kendaraan Yayasan (Hari &amp; Jam)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Armada Tunggal Operasional: Suzuki APV Arena GX Luxury (B 1928 SDZ)
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
            Wajib Otorisasi ACC Koordinator
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Section 1: Identitas Pemohon & Unit Kerja */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              1. Identitas Pemohon &amp; Unit Kerja
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pemohon *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ust. Ahmad Fauzan, S.Pd.I"
                  value={formData.borrowerName}
                  onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Unit Kerja Yayasan *
                </label>
                <select
                  value={formData.division}
                  onChange={(e) => {
                    const newDiv = e.target.value as UnitKerja;
                    const newCat =
                      newDiv === 'Pribadi'
                        ? 'Keperluan Pribadi / Keluarga'
                        : 'Kedinasan Yayasan';
                    setFormData({
                      ...formData,
                      division: newDiv,
                      purposeCategory: newCat,
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-semibold text-slate-900"
                >
                  <option value="PAUD">PAUD Daar el Dzikr</option>
                  <option value="SD">SD Daar el Dzikr</option>
                  <option value="SMP">SMP Daar el Dzikr</option>
                  <option value="MA">MA Daar el Dzikr</option>
                  <option value="Pesantren">Pondok Pesantren Daar el Dzikr</option>
                  <option value="Yayasan">Yayasan Daar el Dzikr</option>
                  <option value="Pribadi">Pribadi (Guru / Karyawan)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 0812-9876-5432"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Unit Mobil & Jadwal Jam */}
          <div className="pt-3 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-emerald-700" />
              2. Armada Kendaraan &amp; Jadwal Waktu
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Unit Card (Suzuki APV Only) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-3">
                <img
                  src={apvVehicle?.imageUrl || '/assets/images/fleet_suzuki_apv_1793252858721.jpg'}
                  alt="Suzuki APV Arena"
                  className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 text-xs">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Armada Yayasan
                  </span>
                  <p className="font-bold text-slate-900 mt-1 truncate">
                    {apvVehicle?.name || 'Suzuki APV Arena GX'}
                  </p>
                  <p className="font-mono text-emerald-800 font-bold text-[11px]">
                    {apvVehicle?.plateNumber || 'B 1928 SDZ'}
                  </p>
                </div>
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
                  <span className="font-bold">Peringatan Bentrok Jadwal:</span> Suzuki APV telah memiliki jadwal peminjaman pada rentang waktu tersebut (Booking:{' '}
                  <span className="font-mono font-bold">
                    {currentConflict.conflictingBooking?.bookingCode}
                  </span>{' '}
                  oleh {currentConflict.conflictingBooking?.borrowerName}). Koordinator akan mempertimbangkan skala prioritas santri/dinas.
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Keperluan & Infaq */}
          <div className="pt-3 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              3. Rincian Tujuan &amp; Keperluan
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
                  <option value="Kedinasan Yayasan">Kedinasan Yayasan / Sekolah (Bebas Infaq)</option>
                  <option value="Kegiatan Santri / Lembaga">Kegiatan Santri / Lembaga (Bebas Infaq)</option>
                  <option value="Keperluan Pribadi / Keluarga">
                    Keperluan Pribadi / Keluarga (Infaq 12h: 50rb, 24h: 100rb)
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
                  placeholder="Contoh: Gedung Guru Kemenag / Rumah Sakit / Bandung"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deskripsi Keperluan Agenda *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mengantar tim lomba tahfidz santri"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            {/* Infaq Estimate Box for Personal use */}
            {(formData.division === 'Pribadi' ||
              formData.purposeCategory === 'Keperluan Pribadi / Keluarga') && (
              <div className="mt-4 p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-950">
                    <HeartHandshake className="w-4 h-4 text-emerald-700" />
                    Klausul Infaq Pemakaian Pribadi Suzuki APV
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                    Durasi: {durationHours} Jam
                  </span>
                </div>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  Sesuai SOP Bab IV, peminjaman perorangan dikenakan kompensasi kas pemeliharaan kendaraan yayasan:
                  <strong className="ml-1">
                    Durasi s.d 12 Jam = Rp {(settings?.infaq12Hours ?? 50000).toLocaleString('id-ID')} (50rb)
                  </strong>{' '}
                  dan{' '}
                  <strong>
                    Durasi s.d 24 Jam = Rp {(settings?.infaq24Hours ?? 100000).toLocaleString('id-ID')} (100rb)
                  </strong>
                  .
                </p>

                <div className="pt-2 border-t border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-600 font-semibold">Estimasi Anjuran Infaq:</span>
                    <span className="text-base font-bold font-mono text-emerald-900">
                      Rp {(estimatedInfaq ?? 0).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      Transfer: <strong>{settings.bankName}</strong> ({settings.bankAccountNumber})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="w-full sm:w-auto justify-center px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs flex items-center gap-2 text-sm sm:text-xs transition-colors min-h-[46px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              Ajukan Permohonan Booking Kendaraan
            </button>
          </div>
        </form>
      </div>

      {/* Bookings List Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Daftar Rekap Booking Kendaraan Yayasan</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau jadwal, verifikasi persetujuan ACC Koordinator, dan cetak Surat Tugas Jalan
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pemohon / unit / kode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden min-h-[40px]"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs mb-4 no-scrollbar">
          {['Semua', 'Menunggu ACC', 'Disetujui', 'Sedang Berjalan', 'Selesai'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveTabFilter(f)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 min-h-[36px] ${
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
              Belum ada data peminjaman kendaraan pada kategori ini.
            </p>
          ) : (
            filteredBookings.map((b) => (
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
                    <span className="font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                      {b.division}
                    </span>
                  </div>

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

                {/* Booking details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-600">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Armada &amp; Tujuan
                    </span>
                    <p className="font-bold text-slate-900 mt-0.5">Suzuki APV Arena (B 1928 SDZ)</p>
                    <p className="text-[11px] text-slate-600 truncate">{b.destination}</p>
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
                      Keperluan &amp; Infaq
                    </span>
                    <p className="font-medium text-slate-900 mt-0.5 truncate">{b.purpose}</p>
                    {b.estimatedInfaq ? (
                      <p className="text-[11px] font-mono text-emerald-700 font-semibold">
                        Infaq: Rp {(b.estimatedInfaq ?? 0).toLocaleString('id-ID')}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400">Kedinasan Yayasan (Bebas Infaq)</p>
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
                          Cetak Surat Tugas
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('pengambilan')}
                          className="px-3 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-semibold transition-colors"
                        >
                          BAST Pengambilan &rarr;
                        </button>
                      </>
                    )}

                    {b.status === 'Sedang Berjalan' && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('pengembalian')}
                        className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                      >
                        BAST Pengembalian &rarr;
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};
