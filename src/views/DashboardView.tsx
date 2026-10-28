/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
  Users,
  Volume2,
  Bot,
  Sparkles,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    vehicles,
    bookings,
    infaqRecords,
    setActiveTab,
    setCoordinatorPinModalOpen,
    isCoordinator,
    setPrintDoc,
    testAiNotificationVoice,
    voiceEnabled,
    setVoiceEnabled,
    soundEnabled,
    setSoundEnabled,
  } = useApp();

  const totalArmada = vehicles.length;
  const availableArmada = vehicles.filter((v) => v.status === 'Tersedia').length;
  const inUseArmada = vehicles.filter((v) => v.status === 'Digunakan').length;
  const inServiceArmada = vehicles.filter((v) => v.status === 'Dalam Servis').length;

  const pendingBookings = bookings.filter((b) => b.status === 'Menunggu ACC');
  const activeTrips = bookings.filter((b) => b.status === 'Sedang Berjalan');
  const approvedUpcoming = bookings.filter((b) => b.status === 'Disetujui');

  const totalInfaqAmount = infaqRecords.reduce((acc, curr) => acc + curr.amount, 0);

  const getVehicleName = (vehicleId: string) => {
    return vehicles.find((v) => v.id === vehicleId)?.name || 'Kendaraan';
  };

  const getVehiclePlate = (vehicleId: string) => {
    return vehicles.find((v) => v.id === vehicleId)?.plateNumber || '-';
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
                Segera periksa dan setujui jadwal untuk penerbitan surat tugas jalan.
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
              Memberikan pengumuman suara otomatis ke koordinator untuk Permohonan Booking Baru, Kesiapan Pengambilan, &amp; Pengembalian Armada.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={testAiNotificationVoice}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold transition-colors flex items-center gap-1.5 shadow-xs text-xs"
            title="Klik untuk mendengarkan lonceng dan ucapan suara AI secara langsung"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Uji Suara AI Notifikasi
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Armada */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Armada</span>
            <Truck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalArmada}
            </span>
            <span className="text-xs text-slate-500">Unit Kendaraan</span>
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
            <span className="text-slate-500">Butuh verifikasi</span>
            <button
              onClick={() => setActiveTab('acc-coordinator')}
              className="text-emerald-700 font-semibold hover:underline"
            >
              Lihat Detail &rarr;
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
              Check-in &rarr;
            </button>
          </div>
        </div>

        {/* Total Infaq Terkumpul */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Infaq Perorangan</span>
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-semibold text-emerald-800">Rp</span>
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-800">
              {totalInfaqAmount.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">{infaqRecords.length} Tanda Terima</span>
            <button
              onClick={() => setActiveTab('infaq')}
              className="text-emerald-700 font-semibold hover:underline"
            >
              Buka Buku Kas &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Akses Cepat Alur Penggunaan Kendaraan
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => setActiveTab('booking')}
            className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-900">1. Booking Baru</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Pesan jadwal hari &amp; jam</p>
          </button>

          <button
            onClick={() => setActiveTab('acc-coordinator')}
            className="p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-900">2. ACC Koordinator</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Verifikasi &amp; terbitkan surat</p>
          </button>

          <button
            onClick={() => setActiveTab('pengambilan')}
            className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <KeyRound className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-900">3. BAST Ambil (IN)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Cek kondisi &amp; catat KM awal</p>
          </button>

          <button
            onClick={() => setActiveTab('pengembalian')}
            className="p-3 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-900">4. BAST Kembali</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Cek fisik &amp; hitung infaq</p>
          </button>
        </div>
      </div>

      {/* Status Armada Visual Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Status Kesiapan Armada Hari Ini</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kondisi real-time kendaraan dinas Sekolah Daar el Dzikr
            </p>
          </div>
          <button
            onClick={() => setActiveTab('armada')}
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            Semua Unit ({vehicles.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow flex flex-col"
            >
              <div className="relative h-36 bg-slate-100 overflow-hidden">
                <img
                  src={v.imageUrl}
                  alt={v.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs ${
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

              <div className="p-3.5 flex-1 flex flex-col justify-between text-xs space-y-2">
                <div>
                  <h4 className="font-bold text-slate-900 leading-snug">{v.name}</h4>
                  <p className="font-mono text-emerald-800 font-semibold text-[11px]">
                    {v.plateNumber}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{v.capacity} Seat</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{v.fuelType.split('/')[0]}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono tabular-nums">
                      {v.odometerKm.toLocaleString('id-ID')} KM
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Servis: {v.lastServiceDate}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('booking')}
                    className="text-[11px] font-semibold text-emerald-700 hover:underline"
                  >
                    Booking Unit
                  </button>
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
                        <span className="text-[11px] text-slate-500">({b.division})</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                        {getVehicleName(b.vehicleId)} · {getVehiclePlate(b.vehicleId)}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'Sedang Berjalan'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <p className="text-slate-600 line-clamp-1">
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
                      Cetak Surat Jalan
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rekap Infaq Perorangan Terakhir */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rekap Infaq Pemakaian Pribadi</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kompensasi pemeliharaan dari guru/karyawan
              </p>
            </div>
            <button
              onClick={() => setActiveTab('infaq')}
              className="text-xs text-emerald-700 font-semibold hover:underline"
            >
              Buku Infaq &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {infaqRecords.slice(0, 4).map((inf) => (
              <div
                key={inf.id}
                className="p-3.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3 bg-slate-50/50"
              >
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{inf.contributorName}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {inf.vehicleName} · {inf.purpose}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{inf.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-emerald-800 font-mono text-sm">
                    Rp {inf.amount.toLocaleString('id-ID')}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setPrintDoc({
                        type: 'kwitansi-infaq',
                        data: inf,
                      })
                    }
                    className="text-[11px] text-slate-500 hover:text-emerald-700 underline mt-0.5 block"
                  >
                    Kwitansi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
