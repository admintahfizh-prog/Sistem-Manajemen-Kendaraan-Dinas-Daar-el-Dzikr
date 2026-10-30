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
  ChevronDown,
  ChevronUp,
  ArrowRight,
  FileText,
  Edit3,
  CreditCard,
} from 'lucide-react';

export const PetunjukPenggunaanView: React.FC = () => {
  const { setActiveTab, setCoordinatorPinModalOpen, isCoordinator, settings } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const steps = [
    {
      step: '01',
      title: 'Pengajuan Booking (Hari & Jam)',
      role: 'PAUD, SD, SMP, MA, Pesantren, Yayasan, Pribadi',
      desc: 'Pemohon memilih unit kerja yang sesuai, mengisikan tanggal & jam berangkat serta selesai, kota tujuan, dan deskripsi agenda peminjaman Suzuki APV.',
      tabTarget: 'booking',
      actionText: 'Buka Form Booking',
      icon: CalendarDays,
    },
    {
      step: '02',
      title: 'Otorisasi & Persetujuan ACC Koordinator',
      role: 'Koordinator Sarpras (Akun Khusus PIN)',
      desc: 'Koordinator sarpras masuk menggunakan PIN otorisasi rahasia, memeriksa jadwal, memastikan prioritas santri/yayasan, dan memberikan ACC resmi yang menerbitkan Surat Tugas Izin Jalan.',
      tabTarget: 'acc-coordinator',
      actionText: 'Buka Panel ACC',
      icon: ShieldCheck,
    },
    {
      step: '03',
      title: 'Serah Terima Pengambilan (BAST IN)',
      role: 'Peminjam Kendaraan Yayasan',
      desc: 'Saat penyerahan kunci, peminjam memeriksa Odometer awal, mencatat level bensin dengan patokan 3 Strip (standar Strip 3 Full), dan menandatangani Berita Acara Pengambilan.',
      tabTarget: 'pengambilan',
      actionText: 'Buka Form BAST IN',
      icon: KeyRound,
    },
    {
      step: '04',
      title: 'Pelaksanaan Perjalanan & Kepatuhan SOP',
      role: 'Peminjam / Seluruh Penumpang',
      desc: 'Menjalankan perjalanan dengan adab santun islami, dilarang merokok/vape di dalam kabin, menjaga nama baik almamater Yayasan Daar el Dzikr, dan mengemudi tertib lalu lintas.',
      tabTarget: 'sop',
      actionText: 'Lihat Klausul SOP',
      icon: FileText,
    },
    {
      step: '05',
      title: 'Serah Terima Pengembalian (BAST RETURN)',
      role: 'Peminjam + Kas Sarpras',
      desc: 'Setelah perjalanan, mobil diparkir di garasi yayasan. Peminjam memastikan bensin kembali Strip 3 Full, memasang Cover Mobil Tertutup Rapi, dan membayar kompensasi cuci 35k jika mobil kotor.',
      tabTarget: 'pengembalian',
      actionText: 'Buka Form BAST Return',
      icon: RotateCcw,
    },
  ];

  const faqs = [
    {
      q: 'Bagaimana cara masuk sebagai Koordinator Sarpras untuk melakukan ACC dan mengedit aturan?',
      a: 'Klik tombol "Masuk Koordinator" di header atau buka menu "Pengaturan (Koordinator)" di sidebar, lalu masukkan PIN otorisasi koordinator yang berwenang. Setelah masuk, Koordinator dapat meng-ACC booking, mengedit klausul SOP, mengedit nomor rekening & tarif infaq, serta mengunggah logo yayasan.',
    },
    {
      q: 'Berapakah ketentuan anjuran infaq pemeliharaan untuk peminjaman pribadi?',
      a: 'Sesuai SOP Bab IV, peminjaman kategori Pribadi dikenakan kompensasi kas kendaraan yayasan: Durasi sampai dengan 12 Jam sebesar Rp 50.000 (50rb), dan Durasi sampai dengan 24 Jam (1 Hari) sebesar Rp 100.000 (100rb).',
    },
    {
      q: 'Bagaimana ketentuan indikator bensin 3 strip pada Suzuki APV?',
      a: 'Indikator bensin Suzuki APV dipatok dalam 3 strip: Strip 1 (Rendah), Strip 2 (Sedang), dan Strip 3 (Full/Penuh). Mobil diserahkan dalam keadaan Strip 3 (Full) dan peminjam wajib mengembalikannya dalam posisi Strip 3 (Full).',
    },
    {
      q: 'Kapan biaya pengganti cuci Rp 35.000 (35k) dikenakan?',
      a: 'Apabila kendaraan dikembalikan dalam keadaan kotor/berdebu tebal/belum dicuci steam, peminjam dikenakan biaya pengganti cuci sebesar Rp 35.000 (35k) pada form BAST Pengembalian.',
    },
    {
      q: 'Mengapa checklist Cover Mobil Tertutup wajib dicentang saat pengembalian?',
      a: 'Sesuai SOP Bab III Pasal 3.2, untuk menjaga kebersihan bodi mobil Suzuki APV dari debu garasi dan cuaca, peminjam wajib memasang sarung/cover mobil dalam keadaan tertutup rapi sebelum meninggalkan garasi.',
    },
    {
      q: 'Bagaimana cara koordinator mengubah klausul SOP atau nomor rekening bank?',
      a: 'Koordinator dapat membuka menu "Edit Klausul SOP" dan "Edit Data Rekening" di sidebar. Setiap perubahan akan langsung tersimpan di sistem dan tampil secara live di Dashboard depan.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            Petunjuk Penggunaan Kendaraan Yayasan Secara Terintegrasi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Panduan alur operasional armada Suzuki APV Yayasan Wakaf Pendidikan Daar el Dzikr
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('booking')}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
        >
          <CalendarDays className="w-4 h-4" />
          Mulai Reservasi Booking
        </button>
      </div>

      {/* Integrated Flow Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Alur Terintegrasi Siklus Peminjaman Armada Yayasan (5 Tahapan)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Setiap tahapan saling terhubung secara otomatis dari formulir booking hingga cetak Surat Tugas dan Kwitansi Infaq
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((st) => {
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
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-emerald-600 hover:text-emerald-700 text-slate-700 rounded-xl font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-600" />
                  {st.actionText} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coordinator Management Shortcuts */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-amber-300">
              Menu Khusus Koordinator Sarpras (Akses Cepat)
            </h3>
            <p className="text-xs text-emerald-200 mt-0.5">
              Kelola klausul SOP dan rekening bank yayasan kapan saja
            </p>
          </div>
          <span className="text-[11px] bg-emerald-800 text-emerald-200 font-mono px-3 py-1 rounded-full border border-emerald-700 w-fit">
            PIN Default: 1234
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-emerald-800/60 p-4 rounded-xl border border-emerald-700/60 flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-white flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-amber-300" />
                Edit Klausul &amp; Bab SOP
              </p>
              <p className="text-emerald-200 text-[11px] mt-1">
                Tambah atau revisi isi pasal SOP, poin ketentuan, dan skala prioritas lembaga.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isCoordinator) {
                  setActiveTab('edit-klausul');
                } else {
                  setCoordinatorPinModalOpen(true);
                }
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shrink-0 transition-colors"
            >
              Buka Editor
            </button>
          </div>

          <div className="bg-emerald-800/60 p-4 rounded-xl border border-emerald-700/60 flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-white flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-300" />
                Edit Rekening &amp; Infaq
              </p>
              <p className="text-emerald-200 text-[11px] mt-1">
                Atur rekening bank tujuan, nomor WA konfirmasi, serta nominal 12h/24h dan cuci 35k.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isCoordinator) {
                  setActiveTab('edit-rekening');
                } else {
                  setCoordinatorPinModalOpen(true);
                }
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shrink-0 transition-colors"
            >
              Buka Rekening
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Pertanyaan Umum (FAQ) &amp; Solusi</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Hal-hal yang sering ditanyakan seputar teknis penggunaan Kendaraan Yayasan
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden text-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                      ?
                    </span>
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/50 text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
