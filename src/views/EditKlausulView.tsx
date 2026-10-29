/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SopChapter, SopPoint } from '../types';
import {
  FileText,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Edit3,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const EditKlausulView: React.FC = () => {
  const {
    isCoordinator,
    setCoordinatorPinModalOpen,
    sopClauses,
    updateSopClauses,
    resetSopClauses,
    setActiveTab,
  } = useApp();

  // Local draft state for editing
  const [chapters, setChapters] = useState<SopChapter[]>(() =>
    JSON.parse(JSON.stringify(sopClauses))
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isCoordinator) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-lg mx-auto my-12 shadow-xs">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Akses Khusus Koordinator Sarpras</h2>
        <p className="text-xs text-slate-600 mt-2 mb-6">
          Pengubahan klausul SOP penggunaan Kendaraan Yayasan Daar el Dzikr hanya dapat dilakukan oleh Koordinator yang memiliki PIN otorisasi.
        </p>
        <button
          type="button"
          onClick={() => setCoordinatorPinModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs transition-colors shadow-xs"
        >
          Masukkan PIN Koordinator
        </button>
      </div>
    );
  }

  const handleChapterTitleChange = (cIndex: number, newTitle: string) => {
    setChapters((prev) => {
      const copy = [...prev];
      copy[cIndex] = { ...copy[cIndex], title: newTitle };
      return copy;
    });
    setSavedSuccess(false);
  };

  const handlePointChange = (
    cIndex: number,
    pIndex: number,
    field: keyof SopPoint,
    value: string
  ) => {
    setChapters((prev) => {
      const copy = [...prev];
      const pts = [...copy[cIndex].points];
      pts[pIndex] = { ...pts[pIndex], [field]: value };
      copy[cIndex] = { ...copy[cIndex], points: pts };
      return copy;
    });
    setSavedSuccess(false);
  };

  const handleAddPoint = (cIndex: number) => {
    setChapters((prev) => {
      const copy = [...prev];
      const pts = [...copy[cIndex].points];
      const nextNo = `${cIndex + 1}.${pts.length + 1}`;
      pts.push({
        no: nextNo,
        title: 'Klausul Ketentuan Baru',
        content: 'Tuliskan deskripsi aturan detail di sini...',
      });
      copy[cIndex] = { ...copy[cIndex], points: pts };
      return copy;
    });
    setSavedSuccess(false);
  };

  const handleDeletePoint = (cIndex: number, pIndex: number) => {
    if (!window.confirm('Hapus poin klausul ini?')) return;
    setChapters((prev) => {
      const copy = [...prev];
      const pts = copy[cIndex].points.filter((_, idx) => idx !== pIndex);
      copy[cIndex] = { ...copy[cIndex], points: pts };
      return copy;
    });
    setSavedSuccess(false);
  };

  const handleAddChapter = () => {
    const romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    const nextRoman = romawi[chapters.length] || `BAB ${chapters.length + 1}`;
    const newChapter: SopChapter = {
      chapter: `BAB ${nextRoman}`,
      title: 'Bab Ketentuan Baru',
      points: [
        {
          no: `${chapters.length + 1}.1`,
          title: 'Ketentuan Perdana',
          content: 'Tuliskan rincian klausul di sini...',
        },
      ],
    };
    setChapters((prev) => [...prev, newChapter]);
    setSavedSuccess(false);
  };

  const handleDeleteChapter = (cIndex: number) => {
    if (!window.confirm(`Hapus seluruh ${chapters[cIndex].chapter}?`)) return;
    setChapters((prev) => prev.filter((_, idx) => idx !== cIndex));
    setSavedSuccess(false);
  };

  const handleSave = () => {
    updateSopClauses(chapters);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan semua klausul SOP ke standar awal yayasan?')) {
      resetSopClauses();
      // Reload draft from latest
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Edit3 className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Edit Klausul &amp; SOP Kendaraan Yayasan
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sebagai Koordinator, Anda dapat mengubah isi pasal, menambah poin baru, atau merevisi aturan operasional. Perubahan langsung tampil di Dashboard depan dan menu SOP.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset Default
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-3 text-xs text-emerald-800 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Klausul SOP berhasil disimpan dan diperbarui di seluruh aplikasi!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-xs"
          >
            Cek di Dashboard <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Chapters Editor */}
      <div className="space-y-6">
        {chapters.map((chap, cIdx) => (
          <div
            key={cIdx}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4"
          >
            {/* Chapter Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-1">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs rounded-lg shrink-0">
                  {chap.chapter}
                </span>
                <input
                  type="text"
                  value={chap.title}
                  onChange={(e) => handleChapterTitleChange(cIdx, e.target.value)}
                  className="font-bold text-sm text-slate-900 border border-transparent hover:border-slate-300 focus:border-emerald-600 focus:bg-white rounded-lg px-2.5 py-1 w-full transition-all"
                  placeholder="Judul Bab / Ketentuan..."
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleAddPoint(cIdx)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Poin
                </button>
                {chapters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteChapter(cIdx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus Bab Ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Points List */}
            <div className="space-y-3">
              {chap.points.map((pt, pIdx) => (
                <div
                  key={pIdx}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs relative group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={pt.no}
                        onChange={(e) =>
                          handlePointChange(cIdx, pIdx, 'no', e.target.value)
                        }
                        className="w-16 font-mono font-bold text-emerald-800 bg-white border border-slate-200 rounded-md px-2 py-1 text-center"
                        placeholder="1.1"
                      />
                      <input
                        type="text"
                        value={pt.title}
                        onChange={(e) =>
                          handlePointChange(cIdx, pIdx, 'title', e.target.value)
                        }
                        className="flex-1 font-bold text-slate-900 bg-white border border-slate-200 rounded-md px-2.5 py-1"
                        placeholder="Judul Klausul..."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeletePoint(cIdx, pIdx)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-colors"
                      title="Hapus Klausul"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={pt.content}
                    onChange={(e) =>
                      handlePointChange(cIdx, pIdx, 'content', e.target.value)
                    }
                    className="w-full bg-white border border-slate-200 rounded-md p-2.5 text-slate-700 text-xs leading-relaxed focus:border-emerald-600 focus:outline-none"
                    placeholder="Tuliskan isi klausul SOP secara lengkap di sini..."
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Chapter Button */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={handleAddChapter}
          className="px-4 py-2.5 border-2 border-dashed border-slate-300 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all w-full justify-center"
        >
          <Layers className="w-4 h-4" />
          Tambah Bab SOP Baru
        </button>
      </div>

      {/* Bottom Save Bar */}
      <div className="sticky bottom-4 bg-white border border-slate-300 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <FileText className="w-4 h-4 text-emerald-700" />
          <span>Total {chapters.length} Bab &amp; {chapters.reduce((acc, c) => acc + c.points.length, 0)} Klausul Terkonfigurasi</span>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-colors shadow-xs flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Simpan Semua Klausul SOP
        </button>
      </div>
    </div>
  );
};
