/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SOP_CLAUSES_DATA } from '../data/mockData';
import {
  BookOpenCheck,
  Printer,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  FileText,
} from 'lucide-react';

export const SopView: React.FC = () => {
  const { settings } = useApp();
  const [activeChapter, setActiveChapter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChapters = SOP_CLAUSES_DATA.filter((c) => {
    if (activeChapter !== 'ALL' && c.chapter !== activeChapter) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const matchTitle = c.title.toLowerCase().includes(query);
    const matchPoints = c.points.some(
      (p) =>
        p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query)
    );
    return matchTitle || matchPoints;
  });

  const handlePrintSop = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-emerald-700" />
            Standar Operasional Prosedur (SOP) &amp; Klausul Penggunaan Kendaraan Dinas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Keputusan Resmi Pimpinan Yayasan Wakaf Pendidikan &amp; Koordinator Sarpras Daar el Dzikr
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrintSop}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs shrink-0"
        >
          <Printer className="w-4 h-4" />
          Cetak Dokumen SOP Lengkap
        </button>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print text-xs">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-950">Prioritas Utama Santri</h4>
            <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
              Armada dinas memprioritaskan kegiatan akademik, lomba quran santri, dan dinas pendidikan.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <HeartHandshake className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-950">Fasilitas Khusus Guru</h4>
            <p className="text-blue-800 text-[11px] mt-0.5 leading-relaxed">
              Guru &amp; staf diperkenankan meminjam untuk hajat keluarga dengan anjuran infaq pemeliharaan.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-950">&quot;Bawa Bersih, Pulang Bersih&quot;</h4>
            <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
              BBM wajib dikembalikan sesuai level awal dan mobil wajib dalam kondisi bersih bebas sampah.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Chapter selector */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between no-print">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto text-xs">
          <button
            onClick={() => setActiveChapter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeChapter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Bab
          </button>
          {SOP_CLAUSES_DATA.map((c) => (
            <button
              key={c.chapter}
              onClick={() => setActiveChapter(c.chapter)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeChapter === c.chapter
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.chapter}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kata kunci klausul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Official Document View */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header Kop */}
        <div className="border-b-2 border-emerald-900 pb-5 text-center">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-emerald-800">
            {settings.foundationName}
          </h3>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            STANDAR OPERASIONAL PROSEDUR PENGGUNAAN KENDARAAN DINAS
          </h1>
          <p className="text-xs font-medium text-slate-600 mt-1">
            Nomor: SOP-SARPRAS/KD-DZK/2026/01 &mdash; Berlaku untuk Seluruh Civitas Akademika Daar el Dzikr
          </p>
        </div>

        {/* Chapters Content */}
        <div className="space-y-8">
          {filteredChapters.map((chap) => (
            <div key={chap.chapter} className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest">
                  {chap.chapter}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">{chap.title}</h2>
              </div>

              <div className="space-y-3.5 pl-1 md:pl-3">
                {chap.points.map((pt) => (
                  <div
                    key={pt.no}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 text-xs space-y-1 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-baseline gap-2 font-bold text-slate-900">
                      <span className="font-mono text-emerald-800">{pt.no}.</span>
                      <span>{pt.title}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed pl-5 text-justify">
                      {pt.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Signature Footer */}
        <div className="pt-8 border-t border-slate-200 text-xs grid grid-cols-2 gap-8 text-center">
          <div>
            <p className="text-slate-500">Mengetahui, Pimpinan Yayasan</p>
            <div className="h-20 flex items-end justify-center">
              <span className="font-bold text-slate-900 border-b border-slate-900 pb-0.5">
                K.H. Muhammad Ridwan, Lc., M.A.
              </span>
            </div>
          </div>
          <div>
            <p className="text-slate-500">Penanggung Jawab Sarpras</p>
            <div className="h-20 flex items-end justify-center">
              <span className="font-bold text-slate-900 border-b border-slate-900 pb-0.5">
                {settings.coordinatorName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
