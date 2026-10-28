/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Printer, X, CheckCircle2, ShieldCheck } from 'lucide-react';

export const PrintModal: React.FC = () => {
  const { printDoc, setPrintDoc, settings, vehicles } = useApp();

  if (!printDoc) return null;

  const handlePrint = () => {
    window.print();
  };

  const getVehicle = (vehicleId: string) => {
    return vehicles.find((v) => v.id === vehicleId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto no-print">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Modal Controls Header */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
              Dokumen Resmi
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-xs text-slate-200 font-medium">
              {printDoc.type === 'surat-jalan' && 'Surat Izin Jalan & Penugasan'}
              {printDoc.type === 'bast-in' && 'Berita Acara Pengambilan (BAST IN)'}
              {printDoc.type === 'bast-return' && 'Berita Acara Pengembalian (BAST RETURN)'}
              {printDoc.type === 'kwitansi-infaq' && 'Kwitansi Tanda Terima Infaq'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Dokumen
            </button>
            <button
              type="button"
              onClick={() => setPrintDoc(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="p-8 md:p-12 overflow-y-auto bg-slate-50 flex-1 flex justify-center">
          <div className="w-full max-w-2xl bg-white p-8 border border-slate-200 shadow-sm rounded-lg print:border-none print:shadow-none print:p-0 text-slate-900 text-sm">
            {/* Kop Surat Resmi */}
            <div className="border-b-2 border-emerald-900 pb-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 shrink-0 border border-emerald-800/20 rounded-lg p-1 flex items-center justify-center bg-emerald-50/50">
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt="Logo Sekolah"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  ) : null}
                </div>
                <div className="flex-1 text-center pr-10">
                  <h2 className="text-xs tracking-wider uppercase font-semibold text-emerald-800">
                    {settings.foundationName}
                  </h2>
                  <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                    {settings.schoolName}
                  </h1>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {settings.address}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Kontak: {settings.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Document Content Switcher */}
            {printDoc.type === 'surat-jalan' && (
              <div className="space-y-5">
                <div className="text-center">
                  <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 underline underline-offset-4">
                    SURAT TUGAS &amp; IZIN JALAN KENDARAAN DINAS
                  </h3>
                  <p className="text-xs font-mono text-slate-600 mt-1">
                    Nomor: ST-KD/{printDoc.data.bookingCode}/SARPRAS
                  </p>
                </div>

                <p className="text-xs text-justify leading-relaxed">
                  Berdasarkan permohonan reservasi penggunaan armada dinas yang telah disetujui
                  oleh Koordinator Sarpras Sekolah Islam Terpadu Daar el Dzikr, dengan ini memberikan izin
                  operasional jalan kepada:
                </p>

                {/* Data Peminjam & Kendaraan */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Nama Pemohon</span>
                    <span className="col-span-2 font-semibold text-slate-900">
                      : {printDoc.data.borrowerName} ({printDoc.data.borrowerRole})
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Unit / Lembaga</span>
                    <span className="col-span-2 font-semibold text-slate-900">
                      : {printDoc.data.division}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">No. Kontak / WA</span>
                    <span className="col-span-2 font-mono text-slate-900">
                      : {printDoc.data.phone}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Kendaraan Dinas</span>
                    <span className="col-span-2 font-bold text-emerald-800">
                      : {getVehicle(printDoc.data.vehicleId)?.name} (Plat:{' '}
                      {getVehicle(printDoc.data.vehicleId)?.plateNumber})
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Tujuan Kegiatan</span>
                    <span className="col-span-2 text-slate-900">
                      : {printDoc.data.destination}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Keperluan</span>
                    <span className="col-span-2 text-slate-900">
                      : {printDoc.data.purpose} ({printDoc.data.purposeCategory})
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Jadwal Penggunaan</span>
                    <span className="col-span-2 font-semibold text-slate-900">
                      : {printDoc.data.startDate} ({printDoc.data.startTime}) s.d.{' '}
                      {printDoc.data.endDate} ({printDoc.data.endTime})
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Pengemudi Bertugas</span>
                    <span className="col-span-2 font-semibold text-slate-900">
                      : {printDoc.data.driverName || printDoc.data.driverType}
                    </span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-[11px] text-amber-900 space-y-1">
                  <span className="font-bold block">Peringatan SOP &amp; Adab Berkendara:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Dilarang keras merokok atau vape di dalam kabin mobil dinas.</li>
                    <li>Surat Izin Jalan ini wajib ditunjukkan kepada petugas pos keamanan gerbang sekolah.</li>
                    <li>Kembalikan kendaraan tepat waktu dalam kondisi bersih dengan tangki BBM sesuai semula.</li>
                  </ul>
                </div>

                {/* Tanda Tangan */}
                <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-center">
                  <div>
                    <p className="text-slate-500">Pemohon / Pengemudi</p>
                    <div className="h-16 flex items-end justify-center">
                      <span className="font-semibold text-slate-900 border-b border-slate-900 pb-0.5">
                        {printDoc.data.borrowerName}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500">Menyetujui, Koordinator Sarpras</p>
                    <div className="h-16 flex flex-col items-center justify-end">
                      <div className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-mono mb-1">
                        <ShieldCheck className="w-3 h-3" /> TERVERIFIKASI SISTEM
                      </div>
                      <span className="font-semibold text-slate-900 border-b border-slate-900 pb-0.5">
                        {settings.coordinatorName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {printDoc.type === 'bast-in' && printDoc.data.handoverIn && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 underline underline-offset-4">
                    BERITA ACARA SERAH TERIMA PENGAMBILAN KENDARAAN (BAST IN)
                  </h3>
                  <p className="text-xs font-mono text-slate-600 mt-1">
                    Ref Kode Booking: {printDoc.data.bookingCode}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 block">Tanggal &amp; Waktu Ambil:</span>
                      <span className="font-bold text-slate-900">
                        {printDoc.data.handoverIn.date} pukul {printDoc.data.handoverIn.time} WIB
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Unit Armada:</span>
                      <span className="font-bold text-emerald-800">
                        {getVehicle(printDoc.data.vehicleId)?.name} (
                        {getVehicle(printDoc.data.vehicleId)?.plateNumber})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Odometer Awal (KM):</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {printDoc.data.handoverIn.odometerKm.toLocaleString('id-ID')} KM
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Level BBM Saat Diambil:</span>
                      <span className="font-bold text-slate-900">
                        Tangki {printDoc.data.handoverIn.fuelLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checklist Fisik */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                    Hasil Inspeksi Fisik Awal:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Kebersihan Kabin &amp; Bodi: {printDoc.data.handoverIn.interiorClean ? 'Bersih' : 'Kotor'}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Kondisi Tekanan 4 Ban &amp; Serep: Baik</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Lampu Utama, Sein &amp; Klakson: Berfungsi Normal</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>STNK Asli &amp; Kunci Kontak: Lengkap diserahkan</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
                  <span className="font-semibold block text-slate-700">Catatan Minus/Goresan Awal:</span>
                  <p className="italic text-slate-600 mt-0.5">
                    {printDoc.data.handoverIn.initialDefectsNotes || 'Tidak ada catatan cacat awal (kondisi mulus).'}
                  </p>
                </div>

                {/* Tanda Tangan */}
                <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-center">
                  <div>
                    <p className="text-slate-500">Peminjam / Penerima Kunci</p>
                    <div className="h-16 flex items-end justify-center">
                      <span className="font-semibold text-slate-900 border-b border-slate-900 pb-0.5">
                        {printDoc.data.handoverIn.borrowerSignatureName || printDoc.data.borrowerName}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500">Petugas Pemeriksa Sarpras</p>
                    <div className="h-16 flex items-end justify-center">
                      <span className="font-semibold text-slate-900 border-b border-slate-900 pb-0.5">
                        {printDoc.data.handoverIn.inspectorName || settings.coordinatorName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {printDoc.type === 'bast-return' && printDoc.data.handoverReturn && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 underline underline-offset-4">
                    BERITA ACARA SERAH TERIMA PENGEMBALIAN KENDARAAN (BAST RETURN)
                  </h3>
                  <p className="text-xs font-mono text-slate-600 mt-1">
                    Ref Kode Booking: {printDoc.data.bookingCode}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 block">Tanggal &amp; Waktu Kembali:</span>
                      <span className="font-bold text-slate-900">
                        {printDoc.data.handoverReturn.date} pukul {printDoc.data.handoverReturn.time} WIB
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Total Jarak Tempuh:</span>
                      <span className="font-mono font-bold text-emerald-800 text-sm">
                        {printDoc.data.handoverReturn.distanceTraveledKm} KM
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Odometer Akhir:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {printDoc.data.handoverReturn.odometerKm.toLocaleString('id-ID')} KM
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Level BBM Kembali:</span>
                      <span className="font-bold text-slate-900">
                        {printDoc.data.handoverReturn.fuelLevel}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Status Kebersihan:</span>
                      <span className="font-bold text-slate-900">
                        {printDoc.data.handoverReturn.isWashed ? 'Sudah Dicuci Bersih' : 'Perlu Dicuci'}
                      </span>
                    </div>
                  </div>
                </div>

                {printDoc.data.handoverReturn.extraCleaningFee > 0 && (
                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg text-xs text-rose-800">
                    <span className="font-bold block">Biaya Tambahan Kebersihan:</span>
                    <p>
                      Kendaraan dikembalikan kotor sehingga dikenakan infaq cuci armada sebesar{' '}
                      <span className="font-mono font-bold">
                        Rp {printDoc.data.handoverReturn.extraCleaningFee.toLocaleString('id-ID')}
                      </span>{' '}
                      sesuai klausul SOP Bab V.
                    </p>
                  </div>
                )}

                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
                  <span className="font-semibold block text-slate-700">Hasil Pemeriksaan Pasca Perjalanan:</span>
                  <p className="italic text-slate-600 mt-0.5">
                    {printDoc.data.handoverReturn.newDefectsNotes || 'Kondisi kendaraan utuh dan prima tanpa kendala baru.'}
                  </p>
                </div>

                {/* Tanda Tangan */}
                <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-center">
                  <div>
                    <p className="text-slate-500">Peminjam yang Mengembalikan</p>
                    <div className="h-16 flex items-end justify-center">
                      <span className="font-semibold text-slate-900 border-b border-slate-900 pb-0.5">
                        {printDoc.data.handoverReturn.returneeSignatureName || printDoc.data.borrowerName}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500">Petugas Penerima Sarpras</p>
                    <div className="h-16 flex items-end justify-center">
                      <span className="font-semibold text-slate-900 border-b border-slate-900 pb-0.5">
                        {printDoc.data.handoverReturn.inspectorName || settings.coordinatorName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {printDoc.type === 'kwitansi-infaq' && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 underline underline-offset-4">
                    TANDA TERIMA RESMI INFAQ PEMELIHARAAN ARMADA
                  </h3>
                  <p className="text-xs font-mono text-slate-600 mt-1">
                    No. Kwitansi: {printDoc.data.receiptNo}
                  </p>
                </div>

                <div className="border border-slate-300 rounded-lg p-5 space-y-3 text-xs bg-slate-50/50">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Telah Diterima Dari</span>
                    <span className="col-span-2 font-bold text-slate-900 text-sm">
                      : {printDoc.data.contributorName} ({printDoc.data.division})
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Jumlah Infaq</span>
                    <span className="col-span-2 font-mono font-bold text-emerald-800 text-lg">
                      : Rp {printDoc.data.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Untuk Penggunaan</span>
                    <span className="col-span-2 text-slate-900">
                      : {printDoc.data.vehicleName} - {printDoc.data.purpose}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Metode Pembayaran</span>
                    <span className="col-span-2 font-semibold text-slate-900">
                      : {printDoc.data.paymentMethod}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Catatan Peruntukan</span>
                    <span className="col-span-2 italic text-slate-600">
                      : {printDoc.data.notes || 'Tabungan kas pemeliharaan & servis berkala armada Daar el Dzikr.'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center italic">
                  &quot;Jazakumullah khairan katsiran atas infaq pemeliharaan kendaraan dinas. Semoga menjadi amal jariyah yang penuh berkah.&quot;
                </p>

                {/* Tanda Tangan */}
                <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-center">
                  <div>
                    <p className="text-slate-500">Penyetor / Muqarrid</p>
                    <div className="h-16 flex items-end justify-center">
                      <span className="font-semibold text-slate-900 border-b border-slate-900 pb-0.5">
                        {printDoc.data.contributorName}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500">Penerima Kasir Sarpras</p>
                    <div className="h-16 flex items-end justify-center">
                      <span className="font-semibold text-slate-900 border-b border-slate-900 pb-0.5">
                        {printDoc.data.receivedBy || settings.coordinatorName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
