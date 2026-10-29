/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpenCheck,
  Printer,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Edit3,
  FileText,
  Download,
  ExternalLink,
  Upload,
} from 'lucide-react';

export const SopView: React.FC = () => {
  const {
    settings,
    sopClauses,
    isCoordinator,
    setCoordinatorPinModalOpen,
    setActiveTab,
  } = useApp();

  const [viewMode, setViewMode] = useState<'text' | 'pdf'>('text');
  const [activeChapter, setActiveChapter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChapters = sopClauses.filter((c) => {
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
            Standar Operasional Prosedur (SOP) Penggunaan Mobil Yayasan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Yayasan Dakwah Islam Daar El Dzikir &bull; Ditetapkan di Bulu, 27 Oktober 2026
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('text')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'text'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Klausul Teks
            </button>
            <button
              type="button"
              onClick={() => setViewMode('pdf')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'pdf'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              Dokumen PDF Asli
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isCoordinator) {
                setActiveTab('settings');
              } else {
                setCoordinatorPinModalOpen(true);
              }
            }}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            Edit / Upload PDF (Koordinator)
          </button>

          <button
            type="button"
            onClick={handlePrintSop}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Cetak SOP
          </button>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print text-xs">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-950">Unit Kerja Terdaftar</h4>
            <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
              PAUD, SD, SMP, MA, Pesantren, Yayasan, dan Pribadi. Prioritas unit SDU untuk kepentingan dinas.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <HeartHandshake className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-950">Infaq Pemakaian Pribadi</h4>
            <p className="text-blue-800 text-[11px] mt-0.5 leading-relaxed">
              12 Jam: Rp 50.000 &bull; 24 Jam: Rp 100.000 berlaku kelipatan untuk biaya perawatan dan kas armada.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-950">Cuci 35k &amp; Cover Mobil Tertutup</h4>
            <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
              BBM wajib Strip 3 (Full), pengganti cuci Rp 35.000 jika kotor, serta wajib menutup kembali cover mobil.
            </p>
          </div>
        </div>
      </div>

      {/* PDF View Mode */}
      {viewMode === 'pdf' ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                Dokumen Asli: {settings.sopPdfName || 'STANDAR OPERASIONAL PROSEDUR MOBIL (1).pdf'}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={
                  settings.sopPdfUrl ||
                  '/assets/aistudio/STANDAR_OPERASIONAL_PROSEDUR_MOBIL__1__bbf471cb.pdf'
                }
                download={settings.sopPdfName || 'SOP_MOBIL_YAYASAN.pdf'}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Unduh PDF Resmi
              </a>
              <a
                href={
                  settings.sopPdfUrl ||
                  '/assets/aistudio/STANDAR_OPERASIONAL_PROSEDUR_MOBIL__1__bbf471cb.pdf'
                }
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                Layar Penuh <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="h-[700px] w-full rounded-xl overflow-hidden border border-slate-300 bg-slate-100">
            <iframe
              src={
                settings.sopPdfUrl ||
                '/assets/aistudio/STANDAR_OPERASIONAL_PROSEDUR_MOBIL__1__bbf471cb.pdf'
              }
              title="Dokumen SOP PDF"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      ) : (
        /* Text Clauses View */
        <>
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
                Semua Bagian (A-G)
              </button>
              {sopClauses.map((c) => (
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
                STANDAR OPERASIONAL PROSEDUR (SOP)
              </h1>
              <h2 className="text-base md:text-lg font-bold text-emerald-950 mt-0.5">
                PEMINJAMAN DAN PENGGUNAAN MOBIL YAYASAN
              </h2>
              <p className="text-xs font-medium text-slate-600 mt-1">
                Berlaku untuk Seluruh Unit Kerja Yayasan Dakwah Islam Daar El Dzikir
              </p>
            </div>

            {/* Chapters Content */}
            <div className="space-y-8">
              {filteredChapters.map((chap) => (
                <div key={chap.chapter} className="space-y-3">
                  <div className="border-b border-slate-200 pb-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest">
                      {chap.chapter}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{chap.title}</h3>
                  </div>

                  <div className="space-y-3">
                    {chap.points.map((pt) => (
                      <div key={pt.no} className="text-xs space-y-1 pl-2">
                        <p className="font-bold text-slate-900 flex items-baseline gap-2">
                          <span className="font-mono text-emerald-800 min-w-8">{pt.no}.</span>
                          <span>{pt.title}</span>
                        </p>
                        <p className="text-slate-700 leading-relaxed pl-10">{pt.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Document Signatures Exactly matching PDF */}
            <div className="pt-10 border-t border-slate-200 grid grid-cols-2 text-center text-xs text-slate-700">
              <div>
                <p>Mengetahui,</p>
                <p className="font-bold text-slate-900 mt-1">
                  Mudir Yayasan Dakwah Islam Daar El Dzikir
                </p>
                <div className="h-20 flex flex-col items-center justify-end font-bold text-slate-900">
                  <span className="underline font-bold">Muhamad Nuryadi, S.Pd., M.Si</span>
                  <span className="font-mono text-[11px] text-slate-500 font-normal">
                    NIY : 2004 0 8 001
                  </span>
                </div>
              </div>
              <div>
                <p>Ditetapkan di : Bulu</p>
                <p className="font-medium text-slate-600">Tanggal : 27 Oktober 2026</p>
                <p className="font-bold text-slate-900 mt-1">PJ Yayasan</p>
                <div className="h-16 flex flex-col items-center justify-end font-bold text-slate-900">
                  <span className="underline font-bold">Moch Cholil, S.Pd.I</span>
                  <span className="font-mono text-[11px] text-slate-500 font-normal">
                    NIY . 2011 09 62
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
