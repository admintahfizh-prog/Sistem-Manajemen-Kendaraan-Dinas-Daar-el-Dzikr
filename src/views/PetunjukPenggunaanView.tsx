/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  CalendarDays,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  FileText,
} from 'lucide-react';

export const PetunjukPenggunaanView: React.FC = () => {
  const { setActiveTab, setCoordinatorPinModalOpen, isCoordinator, settings } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const steps = [
    {
      step: '01',
      title: 'Pengajuan Booking (Hari & Jam)',
      role: 'Guru / Staf Pemohon',
      desc: 'Pemohon mengisi formulir booking dengan memilih unit armada yang tersedia, mengisi tanggal & jam keberangkatan serta kepulangan, tujuan perjalanan, dan kategori kepentingan.',
      tabTarget: 'booking',
      actionText: 'Buka Form Booking',
      icon: CalendarDays,
      accent: 'emerald',
    },
    {
      step: '02',
      title: 'Pemeriksaan & ACC Koordinator',
      role: 'Koordinator Sarpras (Akun Khusus)',
      desc: 'Koordinator sarpras masuk menggunakan PIN otorisasi khusus (default: 1234), memeriksa jadwal agar tidak bentrok, menunjuk sopir bertugas, dan memberikan persetujuan (ACC).',
      tabTarget: 'acc-coordinator',
      actionText: 'Buka Panel ACC',
      icon: ShieldCheck,
      accent: 'amber',
    },
    {
      step: '03',
      title: 'Serah Terima Pengambilan (BAST IN)',
      role: 'Peminjam + Petugas Sarpras',
      desc: 'Saat hendak berangkat, peminjam bersama petugas melakukan cek fisik bersama: mencatat KM Odometer awal, level BBM, AC, rem, ban, dan kelengkapan STNK asli & kunci kontak.',
      tabTarget: 'pengambilan',
      actionText: 'Buka Form Pengambilan',
      icon: KeyRound,
      accent: 'blue',
    },
    {
      step: '04',
      title: 'Pelaksanaan Perjalanan & Adab SOP',
      role: 'Pengemudi / Rombongan',
      desc: 'Menjalankan perjalanan dengan adab santun islami, dilarang merokok di kabin, menjaga nama baik almamater Daar el Dzikr, dan mengemudi sesuai rambu lalu lintas.',
      tabTarget: 'sop',
      actionText: 'Baca Klausul SOP',
      icon: FileText,
      accent: 'purple',
    },
    {
      step: '05',
      title: 'Serah Terima Pengembalian & Infaq',
      role: 'Peminjam + Petugas Sarpras',
      desc: 'Setelah perjalanan usai, mobil dikembalikan. Petugas memeriksa KM akhir (selisih jarak), memastikan BBM sesuai level awal, dan memeriksa kebersihan kabin. Jika pemakaian perorangan, diterbitkan kwitansi infaq.',
      tabTarget: 'pengembalian',
      actionText: 'Buka Form Pengembalian',
      icon: RotateCcw,
      accent: 'rose',
    },
  ];

  const faqs = [
    {
      q: 'Bagaimana cara masuk sebagai Koordinator Sarpras untuk melakukan ACC?',
      a: 'Klik tombol "Masuk Akun Koordinator" di pojok kiri bawah sidebar atau pada header atas, lalu masukkan PIN default (1234). Setelah masuk, Anda memiliki hak penuh untuk menyetujui, menolak, mengelola armada, dan mengunggah logo sekolah.',
    },
    {
      q: 'Apa yang terjadi jika tanggal dan jam booking bertabrakan dengan peminjam lain?',
      a: 'Sistem memiliki deteksi bentrok jadwal otomatis (conflict detector). Jika terjadi tumpang tindih waktu pada unit mobil yang sama, sistem akan memunculkan peringatan. Koordinator dapat mengalihkan permohonan ke unit armada lain yang masih longgar.',
    },
    {
      q: 'Berapakah anjuran infaq pemeliharaan untuk pemakaian perorangan/keluarga guru?',
      a: 'Sesuai SOP Bab IV, peminjaman untuk hajat pribadi keluarga guru dianjurkan menyalurkan infaq pemeliharaan sebesar Rp 175.000 / hari atau Rp 1.500 / KM. Dana 100% dialokasikan kembali ke kas sarpras untuk servis berkala, ganti ban, dan oli.',
    },
    {
      q: 'Bagaimana klausul kebersihan "Bawa Bersih, Pulang Bersih"?',
      a: 'Mobil harus dikembalikan dalam kondisi bersih bebas sampah. Apabila dikembalikan kotor berlumpur, sistem akan secara otomatis mengenakan biaya cuci steam sekolah sebesar Rp 50.000 pada Berita Acara Pengembalian.',
    },
    {
      q: 'Bagaimana cara mencetak Surat Tugas Izin Jalan dan Kwitansi Infaq?',
      a: 'Pada setiap booking yang telah disetujui atau serah terima yang selesai, terdapat tombol "Cetak Surat Tugas Jalan" atau "Kwitansi". Format telah siap cetak resmi dengan Kop Surat Yayasan Wakaf Pendidikan Daar el Dzikr.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            Petunjuk Penggunaan Sistem Secara Terintegrasi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Panduan lengkap alur kerja reservasi kendaraan dinas Sekolah Islam Daar el Dzikr
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('booking')}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
        >
          <CalendarDays className="w-4 h-4" />
          Mulai Booking Sekarang
        </button>
      </div>

      {/* Integrated Flow Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Alur Terintegrasi Siklus Peminjaman Armada (5 Tahapan)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Setiap tahapan saling terhubung secara otomatis dari formulir hingga cetak dokumen resmi
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-mono font-bold shrink-0 shadow-xs">
                    {st.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm">{st.title}</h4>
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded-full">
                        Pelaksana: {st.role}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed max-w-2xl">
                      {st.desc}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab(st.tabTarget as any)}
                  className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                >
                  {st.actionText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Comparison Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Guru / Staf */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <CalendarDays className="w-4 h-4" />
            </div>
            <span>Peran Guru &amp; Staf (Akun Reguler)</span>
          </div>
          <ul className="space-y-2 text-slate-600 pl-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Dapat mengajukan reservasi kendaraan dinas untuk hari &amp; jam tertentu.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Mencetak Surat Tugas / Izin Jalan setelah permohonan disetujui.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Melakukan serah terima kunci dan pengembalian bersama petugas piket sarpras.</span>
            </li>
          </ul>
        </div>

        {/* Koordinator Sarpras */}
        <div className="bg-emerald-950 text-white rounded-2xl p-5 shadow-xs space-y-3 border border-emerald-900">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>Peran Koordinator Sarpras (Akun Khusus)</span>
          </div>
          <ul className="space-y-2 text-emerald-100 pl-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Memeriksa tabrakan jadwal &amp; memberikan otorisasi (ACC) resmi.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Menambah atau merubah data unit armada mobil dan jadwal servis.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Mengunggah logo sekolah &amp; mengelola parameter tarif infaq sarpras.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Emergency & Contacts Bar */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs text-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold">
          <PhoneCall className="w-4 h-4 text-amber-700" />
          <span>Kontak Bantuan &amp; Keadaan Darurat di Jalan Raya</span>
        </div>
        <p className="text-amber-800 text-[11px] leading-relaxed">
          Jika mengalami kendala operasional (mogok, ban bocor, atau kecelakaan), segera hubungi tim sarpras siaga sekolah:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-white p-3 rounded-xl border border-amber-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Koordinator Sarpras</span>
            <p className="font-bold text-slate-900 mt-0.5">{settings.coordinatorName}</p>
            <p className="font-mono text-emerald-800 font-bold text-[11px]">{settings.coordinatorPhone}</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-amber-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Driver Utama Sekolah</span>
            <p className="font-bold text-slate-900 mt-0.5">Pak Bambang (Driver Siaga)</p>
            <p className="font-mono text-emerald-800 font-bold text-[11px]">0813-9988-7766</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-amber-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Pos Keamanan Gerbang Utama</span>
            <p className="font-bold text-slate-900 mt-0.5">Security Kampus Daar el Dzikr</p>
            <p className="font-mono text-emerald-800 font-bold text-[11px]">(021) 8899-2345 ext. 101</p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h3>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-xs py-1 hover:text-emerald-800"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-slate-600 text-[11px] mt-2 leading-relaxed pl-1 text-justify">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
