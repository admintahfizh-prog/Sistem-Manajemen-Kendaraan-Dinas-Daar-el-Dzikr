/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ImageUp,
  Upload,
  RefreshCw,
  CheckCircle2,
  Lock,
  Building,
  Phone,
  Shield,
  Coins,
  Sparkles,
} from 'lucide-react';

export const LogoUploadView: React.FC = () => {
  const {
    settings,
    updateLogo,
    updateSchoolSettings,
    isCoordinator,
    setCoordinatorPinModalOpen,
    resetToDefaultData,
  } = useApp();

  const [notification, setNotification] = useState<string | null>(null);

  // Settings form state
  const [formData, setFormData] = useState({
    schoolName: settings.schoolName,
    subTitle: settings.subTitle,
    foundationName: settings.foundationName,
    address: settings.address,
    phone: settings.phone,
    coordinatorName: settings.coordinatorName,
    coordinatorPhone: settings.coordinatorPhone,
    coordinatorPin: settings.coordinatorPin,
    defaultInfaqPerDay: settings.defaultInfaqPerDay,
    defaultInfaqPerKm: settings.defaultInfaqPerKm,
    washingPenaltyAmount: settings.washingPenaltyAmount,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, atau WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateLogo(result);
        setNotification('Logo sekolah berhasil diperbarui!');
        setTimeout(() => setNotification(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetToDefaultLogo = () => {
    updateLogo('/src/assets/images/logo_daar_el_dzikr_1793160265235.jpg');
    setNotification('Logo dikembalikan ke lambang resmi Daar el Dzikr.');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings({
      ...formData,
      defaultInfaqPerDay: Number(formData.defaultInfaqPerDay),
      defaultInfaqPerKm: Number(formData.defaultInfaqPerKm),
      washingPenaltyAmount: Number(formData.washingPenaltyAmount),
    });
    setNotification('Pengaturan profil lembaga & sarpras berhasil disimpan!');
    setTimeout(() => setNotification(null), 4000);
  };

  if (!isCoordinator) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-900 text-sm">
          Akses Khusus Koordinator Sarpras
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Pengunggahan logo sekolah dan konfigurasi identitas sarpras memerlukan autentikasi PIN Koordinator.
        </p>
        <button
          type="button"
          onClick={() => setCoordinatorPinModalOpen(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs"
        >
          Masukkan PIN Koordinator
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ImageUp className="w-5 h-5 text-emerald-700" />
            Upload Logo Sekolah &amp; Konfigurasi Sarpras
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dikelola langsung oleh Koordinator Sarpras untuk kop surat, tiket jalan, dan identitas sistem
          </p>
        </div>

        <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
          Mode Koordinator Aktif
        </span>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs font-semibold text-emerald-900 flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {notification}
        </div>
      )}

      {/* Upload Logo Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">1. Unggah Logo Resmi Sekolah</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Logo ini akan langsung tampil di sidebar, kop surat resmi jalan, BAST serah terima, dan kwitansi infaq
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Current Logo Preview */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <div className="w-28 h-28 rounded-2xl bg-white border border-slate-200 p-2 shadow-sm flex items-center justify-center overflow-hidden mb-3">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Logo Sekolah"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-xs text-slate-400">Belum ada logo</span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-800">Logo Aktif Saat Ini</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Sekolah Islam Terpadu Daar el Dzikr
            </p>
          </div>

          {/* Upload Drop Area */}
          <div className="md:col-span-2 space-y-4">
            <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-emerald-50/30 transition-colors">
              <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-900">
                Pilih atau Tarik File Logo Baru
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 mb-4">
                Format didukung: PNG, JPG, JPEG, WEBP atau SVG (Disarankan resolusi &ge; 400x400 px)
              </p>

              <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                <ImageUp className="w-4 h-4" />
                Jelajahi File Gambar
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">
                Ingin kembali ke lambang emblem bawaan?
              </span>
              <button
                type="button"
                onClick={handleResetToDefaultLogo}
                className="text-emerald-700 font-semibold hover:underline flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Pulihkan Logo Bawaan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile & Parameter Configuration Form */}
      <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 text-xs">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">
            2. Identitas Lembaga &amp; Parameter Infaq Sarpras
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Informasi ini otomatis tertera pada kop surat dan kwitansi resmi yang dicetak
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Nama Yayasan</label>
            <input
              type="text"
              required
              value={formData.foundationName}
              onChange={(e) => setFormData({ ...formData, foundationName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Sekolah</label>
            <input
              type="text"
              required
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Sub Judul Lembaga</label>
            <input
              type="text"
              value={formData.subTitle}
              onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Alamat Kampus Sekolah</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon Kantor / WA</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama &amp; Gelar Koordinator Sarpras
            </label>
            <input
              type="text"
              value={formData.coordinatorName}
              onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
            />
          </div>

          {/* Infaq Parameters */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tarif Anjuran Infaq Per Hari (Rp)
            </label>
            <input
              type="number"
              step={10000}
              value={formData.defaultInfaqPerDay}
              onChange={(e) =>
                setFormData({ ...formData, defaultInfaqPerDay: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Denda Infaq Cuci Mobil Kotor (Rp)
            </label>
            <input
              type="number"
              step={5000}
              value={formData.washingPenaltyAmount}
              onChange={(e) =>
                setFormData({ ...formData, washingPenaltyAmount: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
            />
          </div>

          {/* Security PIN Change */}
          <div className="col-span-1 md:col-span-2 pt-2 border-t border-slate-100">
            <div className="max-w-xs">
              <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5 text-[11px]">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Ubah PIN Akses Khusus Koordinator
              </label>
              <input
                type="text"
                maxLength={6}
                value={formData.coordinatorPin}
                onChange={(e) => setFormData({ ...formData, coordinatorPin: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono tracking-widest text-sm"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                PIN ini dipakai saat masuk akun khusus koordinator sarpras.
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              if (confirm('Pulihkan seluruh data demo ke kondisi awal?')) {
                resetToDefaultData();
                setNotification('Seluruh data aplikasi dipulihkan ke setelan default.');
              }
            }}
            className="text-xs text-rose-600 hover:underline"
          >
            Reset Seluruh Data Demo
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-xs transition-colors"
          >
            Simpan Perubahan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
};
