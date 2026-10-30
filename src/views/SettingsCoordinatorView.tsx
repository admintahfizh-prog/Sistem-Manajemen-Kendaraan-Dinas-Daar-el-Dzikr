/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Vehicle, FuelType, VehicleStatus, SopChapter } from '../types';
import {
  Shield,
  ShieldCheck,
  Lock,
  CreditCard,
  FileText,
  Truck,
  ImageUp,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Download,
  ExternalLink,
  Coins,
  Building2,
  Phone,
  Eye,
  KeyRound,
  RotateCcw,
  Sparkles,
  Car,
  UserCheck,
  Wallet,
} from 'lucide-react';
import { KeuanganArmadaView } from './KeuanganArmadaView';

export const SettingsCoordinatorView: React.FC = () => {
  const {
    activeTab,
    isCoordinator,
    setCoordinatorPinModalOpen,
    verifyCoordinatorPin,
    logoutCoordinator,
    settings,
    updateSchoolSettings,
    updateLogo,
    bookings,
    approveBooking,
    rejectBooking,
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    sopClauses,
    updateSopClauses,
    resetSopClauses,
    setActiveTab,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'acc' | 'pj' | 'keuangan' | 'rekening' | 'sop' | 'armada' | 'logo'
  >(
    activeTab === 'keuangan-armada'
      ? 'keuangan'
      : activeTab === 'armada'
      ? 'armada'
      : activeTab === 'edit-klausul'
      ? 'sop'
      : activeTab === 'edit-rekening'
      ? 'rekening'
      : activeTab === 'logo-sekolah'
      ? 'logo'
      : 'acc'
  );

  React.useEffect(() => {
    if (activeTab === 'keuangan-armada') setActiveSubTab('keuangan');
    else if (activeTab === 'acc-coordinator') setActiveSubTab('acc');
    else if (activeTab === 'armada') setActiveSubTab('armada');
    else if (activeTab === 'edit-klausul') setActiveSubTab('sop');
    else if (activeTab === 'edit-rekening') setActiveSubTab('rekening');
    else if (activeTab === 'logo-sekolah') setActiveSubTab('logo');
  }, [activeTab]);

  // Local PIN input if opened without coordinator status
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Success alert message
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // --- PENANGGUNG JAWAB STATE ---
  const [pjForm, setPjForm] = useState({
    coordinatorName: settings.coordinatorName || 'Moch Cholil, S.Pd.I',
    coordinatorTitle: settings.coordinatorTitle || 'PJ Yayasan / Koordinator Sarpras',
    coordinatorPhone: settings.coordinatorPhone || '0812-9876-5432',
    coordinatorPin: settings.coordinatorPin || '8899',
  });

  // Sync pjForm whenever settings change from Firestore
  React.useEffect(() => {
    setPjForm({
      coordinatorName: settings.coordinatorName || 'Moch Cholil, S.Pd.I',
      coordinatorTitle: settings.coordinatorTitle || 'PJ Yayasan / Koordinator Sarpras',
      coordinatorPhone: settings.coordinatorPhone || '0812-9876-5432',
      coordinatorPin: settings.coordinatorPin || '8899',
    });
  }, [settings.coordinatorName, settings.coordinatorTitle, settings.coordinatorPhone, settings.coordinatorPin]);

  const handleSavePj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pjForm.coordinatorName.trim()) {
      alert('Nama Penanggung Jawab tidak boleh kosong.');
      return;
    }
    updateSchoolSettings({
      coordinatorName: pjForm.coordinatorName.trim(),
      coordinatorTitle: pjForm.coordinatorTitle.trim(),
      coordinatorPhone: pjForm.coordinatorPhone.trim(),
      coordinatorPin: pjForm.coordinatorPin.trim() || '8899',
    });
    showSuccess('Data Penanggung Jawab & PIN Koordinator berhasil disimpan ke Firebase!');
  };

  // --- REKENING & TARIF STATE ---
  const [rekeningForm, setRekeningForm] = useState({
    bankName: settings.bankName || 'Bank Syariah Indonesia (BSI)',
    bankAccountNumber: settings.bankAccountNumber || '712-345-6789',
    bankAccountHolder:
      settings.bankAccountHolder ||
      'Yayasan Dakwah Islam Daar El Dzikir (Kas Kendaraan)',
    bankConfirmationPhone: settings.bankConfirmationPhone || '0812-9876-5432',
    bankNotes:
      settings.bankNotes ||
      'Silakan cantumkan nama peminjam pada berita transfer, lalu kirim bukti transfer ke WA Koordinator Sarpras.',
    infaq12Hours: settings.infaq12Hours || 50000,
    infaq24Hours: settings.infaq24Hours || 100000,
    washingPenaltyAmount: settings.washingPenaltyAmount || 35000,
    coordinatorName: settings.coordinatorName || '',
    coordinatorPhone: settings.coordinatorPhone || '',
  });

  const handleSaveRekening = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings({
      bankName: rekeningForm.bankName,
      bankAccountNumber: rekeningForm.bankAccountNumber,
      bankAccountHolder: rekeningForm.bankAccountHolder,
      bankConfirmationPhone: rekeningForm.bankConfirmationPhone,
      bankNotes: rekeningForm.bankNotes,
      infaq12Hours: Number(rekeningForm.infaq12Hours),
      infaq24Hours: Number(rekeningForm.infaq24Hours),
      washingPenaltyAmount: Number(rekeningForm.washingPenaltyAmount),
      coordinatorName: rekeningForm.coordinatorName,
      coordinatorPhone: rekeningForm.coordinatorPhone,
    });
    showSuccess('Data Rekening, Tarif Infaq & Biaya Cuci berhasil disimpan!');
  };

  // --- LOGO & PROFIL STATE ---
  const [profileForm, setProfileForm] = useState({
    schoolName: settings.schoolName || 'Kendaraan Yayasan',
    foundationName:
      settings.foundationName || 'Yayasan Dakwah Islam Daar El Dzikir',
    address: settings.address || '',
    newPin: '',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updateObj: Partial<typeof settings> = {
      schoolName: profileForm.schoolName,
      foundationName: profileForm.foundationName,
      address: profileForm.address,
    };
    if (profileForm.newPin && profileForm.newPin.length >= 4) {
      updateObj.coordinatorPin = profileForm.newPin;
    }
    updateSchoolSettings(updateObj);
    showSuccess('Profil Yayasan dan PIN berhasil disimpan!');
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateLogo(result);
        showSuccess('Logo yayasan berhasil diperbarui!');
      }
    };
    reader.readAsDataURL(file);
  };

  // --- SOP PDF STATE ---
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Mohon pilih file berekstensi .pdf');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateSchoolSettings({
          sopPdfUrl: dataUrl,
          sopPdfName: file.name,
        });
        showSuccess(`File PDF SOP (${file.name}) berhasil diunggah!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPdf = () => {
    updateSchoolSettings({
      sopPdfUrl:
        '/assets/aistudio/STANDAR_OPERASIONAL_PROSEDUR_MOBIL__1__bbf471cb.pdf',
      sopPdfName: 'STANDAR OPERASIONAL PROSEDUR MOBIL (1).pdf',
    });
    showSuccess('Dokumen PDF SOP dikembalikan ke file asli Daar El Dzikir.');
  };

  // --- ARMADA MODAL & VEHICLE ACTIONS ---
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [vehicleDeleteConfirm, setVehicleDeleteConfirm] =
    useState<Vehicle | null>(null);

  const [vehicleForm, setVehicleForm] = useState<{
    name: string;
    plateNumber: string;
    type: string;
    capacity: number;
    fuelType: FuelType;
    odometerKm: number;
    status: VehicleStatus;
    imageUrl: string;
    lastServiceDate: string;
    nextServiceKm: number;
    notes: string;
  }>({
    name: 'Suzuki APV Arena GX Luxury',
    plateNumber: 'B 1928 SDZ',
    type: 'Suzuki APV Yayasan',
    capacity: 8,
    fuelType: 'Pertalite / Pertamax',
    odometerKm: 38450,
    status: 'Tersedia',
    imageUrl: '/assets/images/fleet_suzuki_apv_1793252858721.jpg',
    lastServiceDate: new Date().toISOString().slice(0, 10),
    nextServiceKm: 42000,
    notes: 'Mobil resmi Kendaraan Yayasan Daar El Dzikir.',
  });

  const handleOpenAddVehicle = () => {
    setEditingVehicleId(null);
    setVehicleForm({
      name: 'Suzuki APV Arena GX Luxury',
      plateNumber: 'B 1928 SDZ',
      type: 'Suzuki APV Yayasan',
      capacity: 8,
      fuelType: 'Pertalite / Pertamax',
      odometerKm: 38450,
      status: 'Tersedia',
      imageUrl: '/assets/images/fleet_suzuki_apv_1793252858721.jpg',
      lastServiceDate: new Date().toISOString().slice(0, 10),
      nextServiceKm: 42000,
      notes: 'Mobil resmi Kendaraan Yayasan Daar El Dzikir.',
    });
    setVehicleModalOpen(true);
  };

  const handleOpenEditVehicle = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setVehicleForm({
      name: v.name,
      plateNumber: v.plateNumber,
      type: v.type,
      capacity: v.capacity,
      fuelType: v.fuelType,
      odometerKm: v.odometerKm,
      status: v.status,
      imageUrl: v.imageUrl || '/assets/images/fleet_suzuki_apv_1793252858721.jpg',
      lastServiceDate: v.lastServiceDate,
      nextServiceKm: v.nextServiceKm,
      notes: v.notes || '',
    });
    setVehicleModalOpen(true);
  };

  const handleVehicleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setVehicleForm((prev) => ({ ...prev, imageUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.name || !vehicleForm.plateNumber) return;

    if (editingVehicleId) {
      updateVehicle(editingVehicleId, vehicleForm);
      showSuccess(`Armada ${vehicleForm.name} berhasil diperbarui!`);
    } else {
      addVehicle(vehicleForm);
      showSuccess(`Armada baru ${vehicleForm.name} berhasil ditambahkan!`);
    }
    setVehicleModalOpen(false);
  };

  const handleConfirmDeleteVehicle = () => {
    if (!vehicleDeleteConfirm) return;
    deleteVehicle(vehicleDeleteConfirm.id);
    showSuccess(`Armada ${vehicleDeleteConfirm.name} telah dihapus.`);
    setVehicleDeleteConfirm(null);
  };

  // --- ACC ACTIONS ---
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState('');
  const [accNotes, setAccNotes] = useState<{ [id: string]: string }>({});

  const pendingBookings = bookings.filter((b) => b.status === 'Menunggu ACC');
  const pastBookings = bookings.filter((b) => b.status !== 'Menunggu ACC');

  // If coordinator is NOT verified, show PIN entry card
  if (!isCoordinator) {
    return (
      <div className="max-w-md mx-auto my-8 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-emerald-900 text-white p-6 text-center">
          <div className="w-14 h-14 bg-emerald-800/80 rounded-2xl border border-emerald-700 mx-auto flex items-center justify-center mb-3">
            <Lock className="w-7 h-7 text-emerald-300" />
          </div>
          <h2 className="text-lg font-bold">Menu Khusus Koordinator Sarpras</h2>
          <p className="text-xs text-emerald-200 mt-1">
            Halaman pengaturan terpadu (ACC Booking, Rekening Infaq, Cuci 35k, Upload PDF SOP, dan Kelola Armada).
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const ok = verifyCoordinatorPin(inputPin);
            if (!ok) setPinError(true);
            else setPinError(false);
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Masukkan Kode PIN Koordinator
            </label>
            <input
              type="password"
              maxLength={6}
              value={inputPin}
              onChange={(e) => {
                setInputPin(e.target.value);
                setPinError(false);
              }}
              placeholder="••••"
              autoFocus
              className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
            />
            {pinError && (
              <p className="text-xs text-rose-600 flex items-center gap-1.5 mt-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                PIN salah. Gunakan PIN default: <strong className="font-mono">8899</strong>.
              </p>
            )}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
            <div className="font-semibold flex items-center gap-1.5 mb-1 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Kode Default Koordinator
            </div>
            <p className="text-emerald-700">
              Gunakan kode koordinator: <span className="font-mono font-bold text-emerald-950">8899</span>.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
          >
            Buka Pengaturan Koordinator
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Shield className="w-5 h-5 text-emerald-700" />
            </span>
            <div>
              <h1 className="text-base font-bold text-slate-900">
                Pusat Pengaturan &amp; Otorisasi Koordinator Sarpras
              </h1>
              <p className="text-xs text-slate-500">
                Yayasan Dakwah Islam Daar El Dzikir &bull; Penanggung Jawab: {settings.coordinatorName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={logoutCoordinator}
            className="px-3.5 py-1.5 border border-slate-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            Kunci / Keluar
          </button>
        </div>
      </div>

      {/* Success Notification Bar */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveSubTab('acc')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'acc'
              ? 'bg-white text-emerald-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>ACC Booking</span>
          {pendingBookings.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {pendingBookings.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('pj')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'pj'
              ? 'bg-white text-emerald-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-700" />
          <span>Edit Penanggung Jawab</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('keuangan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'keuangan'
              ? 'bg-white text-emerald-950 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wallet className="w-4 h-4 text-emerald-700" />
          <span>Buku Kas &amp; Riwayat</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('rekening')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'rekening'
              ? 'bg-white text-emerald-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-700" />
          <span>Rekening, Infaq &amp; Cuci 35k</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('sop')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'sop'
              ? 'bg-white text-emerald-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-700" />
          <span>Dokumen SOP &amp; Upload PDF</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('armada')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'armada'
              ? 'bg-white text-emerald-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-700" />
          <span>Kelola Armada APV</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('logo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'logo'
              ? 'bg-white text-emerald-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageUp className="w-4 h-4 text-emerald-700" />
          <span>Logo &amp; Profil Lembaga</span>
        </button>
      </div>

      {/* --- SUBTAB: EDIT NAMA PENANGGUNG JAWAB --- */}
      {activeSubTab === 'pj' && (
        <form onSubmit={handleSavePj} className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Data Penanggung Jawab &amp; Koordinator Sarpras
                </h2>
                <p className="text-xs text-slate-500">
                  Nama ini digunakan sebagai penandatangan resmi Surat Tugas Jalan, BAST Serah Terima, Kuitansi Infaq, dan narahubung darurat.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap Penanggung Jawab *
                </label>
                <input
                  type="text"
                  required
                  value={pjForm.coordinatorName}
                  onChange={(e) => setPjForm({ ...pjForm, coordinatorName: e.target.value })}
                  placeholder="Contoh: Moch Cholil, S.Pd.I"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Cantumkan gelar lengkap untuk keperluan administrasi resmi.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Jabatan / Gelar Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={pjForm.coordinatorTitle}
                  onChange={(e) => setPjForm({ ...pjForm, coordinatorTitle: e.target.value })}
                  placeholder="Contoh: PJ Yayasan / Koordinator Sarpras"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Jabatan struktural di lingkungan Yayasan Daar el Dzikr.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Nomor HP / WhatsApp Resmi Penanggung Jawab *
                </label>
                <input
                  type="text"
                  required
                  value={pjForm.coordinatorPhone}
                  onChange={(e) => setPjForm({ ...pjForm, coordinatorPhone: e.target.value })}
                  placeholder="Contoh: 0812-9876-5432"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Nomor aktif untuk konfirmasi ACC, pengambilan kunci, &amp; kirim bukti transfer infaq.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Kode PIN Akses Koordinator (4-6 Angka)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={pjForm.coordinatorPin}
                  onChange={(e) => setPjForm({ ...pjForm, coordinatorPin: e.target.value })}
                  placeholder="Default: 8899"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono tracking-widest text-center focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-50"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  PIN saat ini: <strong className="font-mono text-emerald-800">{settings.coordinatorPin || '8899'}</strong> (Digunakan untuk ACC &amp; akses halaman ini).
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Otomatis Tersinkronisasi ke Firebase</p>
                <p className="text-emerald-700 text-[11px] mt-0.5">
                  Setelah disimpan, nama penanggung jawab baru akan langsung aktif dan muncul pada header aplikasi, dasbor pengguna umum, lembar BAST serah terima, kuitansi kas infaq, serta nomor konfirmasi WA tanpa perlu membersihkan cache browser.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Simpan Data Penanggung Jawab
              </button>
            </div>
          </div>
        </form>
      )}

      {/* --- SUBTAB 1: ACC BOOKING --- */}
      {activeSubTab === 'acc' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Permohonan Menunggu ACC ({pendingBookings.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Setiap peminjaman unit resmi Suzuki APV wajib disetujui koordinator sebelum kunci dapat diambil.
            </p>

            {pendingBookings.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="font-bold text-slate-800 text-sm">Semua permohonan telah diproses</p>
                <p className="text-slate-400">Tidak ada pengajuan booking baru yang menunggu ACC saat ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {pendingBookings.map((b) => {
                  const veh = vehicles.find((v) => v.id === b.vehicleId) || vehicles[0];
                  return (
                    <div
                      key={b.id}
                      className="border-2 border-amber-300 bg-amber-50/40 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs bg-amber-200 text-amber-900 px-2.5 py-1 rounded-lg">
                            {b.bookingCode}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            Unit: <strong className="text-slate-900">{b.division}</strong>
                          </span>
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{b.borrowerName}</h3>
                          <p className="text-xs text-slate-600 mt-0.5">{b.purpose}</p>
                          <p className="text-[11px] text-slate-500">
                            Tujuan: <strong className="text-slate-800">{b.destination}</strong>
                          </p>
                        </div>

                        <div className="bg-white/80 border border-amber-200 rounded-xl p-3 text-xs space-y-1">
                          <div className="flex justify-between text-slate-600">
                            <span>Jadwal Pinjam:</span>
                            <span className="font-bold text-slate-900">
                              {b.startDate} ({b.startTime} - {b.endTime})
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Kategori:</span>
                            <span className="font-semibold text-emerald-800">
                              {b.purposeCategory}
                            </span>
                          </div>
                          {b.estimatedInfaq && b.estimatedInfaq > 0 && (
                            <div className="flex justify-between text-slate-600">
                              <span>Estimasi Infaq:</span>
                              <span className="font-mono font-bold text-blue-900">
                                Rp {b.estimatedInfaq.toLocaleString('id-ID')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Coordinator Notes Input */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Catatan ACC Koordinator:
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Disetujui, harap ambil kunci di pos sarpras..."
                            value={accNotes[b.id] ?? ''}
                            onChange={(e) =>
                              setAccNotes({ ...accNotes, [b.id]: e.target.value })
                            }
                            className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
                        <button
                          type="button"
                          onClick={() => {
                            approveBooking(
                              b.id,
                              accNotes[b.id] || 'Disetujui oleh Koordinator Sarpras.'
                            );
                            showSuccess(`Booking ${b.bookingCode} berhasil di-ACC!`);
                          }}
                          className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Setujui (ACC)
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectingBookingId(b.id)}
                          className="px-3.5 py-2 border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Rejection Modal */}
          {rejectingBookingId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-sm text-rose-700">
                  Alasan Penolakan Permohonan
                </h3>
                <p className="text-slate-600">
                  Tuliskan alasan penolakan agar peminjam memahami pertimbangan koordinasi armada.
                </p>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Contoh: Unit diprioritaskan untuk kegiatan dinas SDU..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRejectingBookingId(null);
                      setRejectionReason('');
                    }}
                    className="px-3 py-1.5 text-slate-600"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (rejectingBookingId) {
                        rejectBooking(
                          rejectingBookingId,
                          rejectionReason || 'Jadwal bentrok atau diprioritaskan dinas yayasan.'
                        );
                        showSuccess('Permohonan booking telah ditolak.');
                        setRejectingBookingId(null);
                        setRejectionReason('');
                      }
                    }}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
                  >
                    Kirim Penolakan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Past Bookings table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Riwayat Otorisasi Booking ({pastBookings.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Kode Booking</th>
                    <th className="py-2.5 px-3">Peminjam</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Catatan Koordinator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {pastBookings.slice(0, 8).map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {b.bookingCode}
                      </td>
                      <td className="py-2.5 px-3 font-medium">{b.borrowerName}</td>
                      <td className="py-2.5 px-3">{b.division}</td>
                      <td className="py-2.5 px-3">{b.startDate}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'Disetujui' || b.status === 'Sedang Berjalan'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'Selesai'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {b.coordinatorNotes || b.rejectionReason || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB: BUKU KAS & RIWAYAT KEUANGAN --- */}
      {activeSubTab === 'keuangan' && (
        <div className="pt-2">
          <KeuanganArmadaView embeddedInSettings={true} />
        </div>
      )}

      {/* --- SUBTAB 2: REKENING, INFAQ & CUCI 35K --- */}
      {activeSubTab === 'rekening' && (
        <form onSubmit={handleSaveRekening} className="space-y-6">
          {/* Section 1: Data Rekening Bank */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                Rekening Bank Resmi Kas Kendaraan Yayasan
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Bank
                </label>
                <input
                  type="text"
                  required
                  value={rekeningForm.bankName}
                  onChange={(e) =>
                    setRekeningForm({ ...rekeningForm, bankName: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  required
                  value={rekeningForm.bankAccountNumber}
                  onChange={(e) =>
                    setRekeningForm({
                      ...rekeningForm,
                      bankAccountNumber: e.target.value,
                    })
                  }
                  className="w-full font-mono font-bold text-slate-900 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Atas Nama Pemilik Rekening
                </label>
                <input
                  type="text"
                  required
                  value={rekeningForm.bankAccountHolder}
                  onChange={(e) =>
                    setRekeningForm({
                      ...rekeningForm,
                      bankAccountHolder: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp Konfirmasi Transfer
                </label>
                <input
                  type="text"
                  required
                  value={rekeningForm.bankConfirmationPhone}
                  onChange={(e) =>
                    setRekeningForm({
                      ...rekeningForm,
                      bankConfirmationPhone: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Petunjuk Transfer untuk Peminjam
                </label>
                <textarea
                  rows={2}
                  value={rekeningForm.bankNotes}
                  onChange={(e) =>
                    setRekeningForm({ ...rekeningForm, bankNotes: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl p-3 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Tarif Infaq & Cuci 35k */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Coins className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                Tarif Infaq Pribadi &amp; Pengganti Cuci Mobil (SOP Resmi)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-emerald-950">
                    Infaq 12 Jam (Setengah Hari)
                  </label>
                  <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    50rb
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Peminjaman perorangan durasi &le; 12 jam.
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    step="5000"
                    required
                    value={rekeningForm.infaq12Hours}
                    onChange={(e) =>
                      setRekeningForm({
                        ...rekeningForm,
                        infaq12Hours: Number(e.target.value),
                      })
                    }
                    className="w-full pl-10 pr-3 py-2 font-mono font-bold bg-white border border-emerald-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-blue-950">
                    Infaq 24 Jam (1 Hari Penuh)
                  </label>
                  <span className="text-[10px] bg-blue-200 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    100rb
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Peminjaman perorangan durasi 1 hari (24 jam).
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    step="10000"
                    required
                    value={rekeningForm.infaq24Hours}
                    onChange={(e) =>
                      setRekeningForm({
                        ...rekeningForm,
                        infaq24Hours: Number(e.target.value),
                      })
                    }
                    className="w-full pl-10 pr-3 py-2 font-mono font-bold bg-white border border-blue-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50/60 border border-amber-300 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-950">
                    Pengganti Cuci Mobil
                  </label>
                  <span className="text-[10px] bg-amber-300 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                    35k
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Dikenakan jika mobil kembali dalam kondisi kotor.
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    step="5000"
                    required
                    value={rekeningForm.washingPenaltyAmount}
                    onChange={(e) =>
                      setRekeningForm({
                        ...rekeningForm,
                        washingPenaltyAmount: Number(e.target.value),
                      })
                    }
                    className="w-full pl-10 pr-3 py-2 font-mono font-bold bg-white border border-amber-400 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan Rekening &amp; Tarif
            </button>
          </div>
        </form>
      )}

      {/* --- SUBTAB 3: DOKUMEN SOP & UPLOAD PDF --- */}
      {activeSubTab === 'sop' && (
        <div className="space-y-6">
          {/* PDF Upload & Management Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                Dokumen Resmi Standar Operasional Prosedur (SOP)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ditetapkan di: Bulu, 27 Oktober 2026 &bull; Mudir: Muhamad Nuryadi, S.Pd., M.Si &bull; PJ: Moch Cholil, S.Pd.I
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <label className="cursor-pointer px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors">
                <Upload className="w-4 h-4" />
                Upload File PDF SOP Baru
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleResetPdf}
                className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Reset ke PDF Asli
              </button>

              <a
                href={
                  settings.sopPdfUrl ||
                  '/assets/aistudio/STANDAR_OPERASIONAL_PROSEDUR_MOBIL__1__bbf471cb.pdf'
                }
                download={settings.sopPdfName || 'SOP_KENDARAAN_YAYASAN.pdf'}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Unduh PDF
              </a>
            </div>
          </div>

          {/* Embedded PDF Viewer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                Pratinjau Dokumen PDF: <strong className="text-emerald-900">{settings.sopPdfName || 'STANDAR OPERASIONAL PROSEDUR MOBIL (1).pdf'}</strong>
              </span>
              <a
                href={
                  settings.sopPdfUrl ||
                  '/assets/aistudio/STANDAR_OPERASIONAL_PROSEDUR_MOBIL__1__bbf471cb.pdf'
                }
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:underline flex items-center gap-1"
              >
                Buka Layar Penuh <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="h-[520px] w-full rounded-xl overflow-hidden border border-slate-300 bg-slate-100">
              <iframe
                src={
                  settings.sopPdfUrl ||
                  '/assets/aistudio/STANDAR_OPERASIONAL_PROSEDUR_MOBIL__1__bbf471cb.pdf'
                }
                title="SOP Dokumen PDF"
                className="w-full h-full border-none"
              />
            </div>
          </div>

          {/* SOP Clauses Quick Overview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Rangkuman Klausul SOP Terintegrasi di Sistem
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('sop')}
                className="text-emerald-700 text-xs font-bold hover:underline"
              >
                Lihat Tampilan SOP Publik &rarr;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {sopClauses.map((ch) => (
                <div
                  key={ch.chapter}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                >
                  <div className="font-bold text-emerald-950 flex items-center gap-2">
                    <span className="font-mono text-emerald-800">{ch.chapter}</span>
                    <span>&bull; {ch.title}</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {ch.points.map((p) => (
                      <li key={p.no}>
                        <strong>{p.title}:</strong> {p.content}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 4: KELOLA ARMADA APV --- */}
      {activeSubTab === 'armada' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-700" />
                Manajemen Armada Kendaraan Yayasan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Edit rincian armada, upload foto mobil, dan hapus unit armada operasional.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddVehicle}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              Tambah Unit Armada Baru
            </button>
          </div>

          {/* Vehicle List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
              >
                {/* Photo Thumbnail */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={v.imageUrl || '/assets/images/fleet_suzuki_apv_1793252858721.jpg'}
                    alt={v.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        '/assets/images/fleet_suzuki_apv_1793252858721.jpg';
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs ${
                        v.status === 'Tersedia'
                          ? 'bg-emerald-600 text-white'
                          : v.status === 'Digunakan'
                          ? 'bg-blue-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-0.5 rounded text-[11px] font-mono">
                    {v.plateNumber}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                      {v.type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{v.name}</h3>
                    <p className="text-slate-500 text-[11px] mt-1">{v.notes}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 text-[11px] text-slate-600">
                    <div>
                      Odometer: <strong className="font-mono text-slate-900">{(v.odometerKm ?? 38450).toLocaleString('id-ID')} KM</strong>
                    </div>
                    <div>
                      Kapasitas: <strong className="text-slate-900">{v.capacity} Seat</strong>
                    </div>
                    <div className="col-span-2">
                      Bahan Bakar: <strong className="text-slate-900">{v.fuelType}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditVehicle(v)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                        Edit Unit
                      </button>
                      <button
                        type="button"
                        onClick={() => setVehicleDeleteConfirm(v)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Hapus Mobil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('armada')}
                      className="text-emerald-700 hover:underline text-[11px] font-semibold"
                    >
                      Buka Armada &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delete Confirmation In-App Modal */}
          {vehicleDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">
                    Konfirmasi Hapus Armada
                  </h3>
                  <p className="text-slate-600">
                    Apakah Anda yakin ingin menghapus unit armada{' '}
                    <strong className="text-slate-900 font-bold">
                      {vehicleDeleteConfirm.name} ({vehicleDeleteConfirm.plateNumber})
                    </strong>
                    ?
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setVehicleDeleteConfirm(null)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDeleteVehicle}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
                  >
                    Ya, Hapus Unit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add / Edit Vehicle Modal */}
          {vehicleModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
              <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="bg-emerald-900 p-5 text-white flex items-center justify-between shrink-0">
                  <h3 className="font-bold text-sm">
                    {editingVehicleId ? 'Edit Data Armada APV' : 'Tambah Unit Armada Baru'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setVehicleModalOpen(false)}
                    className="text-white/80 hover:text-white text-lg font-bold"
                  >
                    &times;
                  </button>
                </div>

                <form
                  onSubmit={handleSaveVehicle}
                  className="p-6 space-y-4 text-xs overflow-y-auto"
                >
                  {/* Photo Upload & Preview */}
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700">
                      Foto Kendaraan (Upload Gambar Mobil)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-300 shrink-0">
                        <img
                          src={vehicleForm.imageUrl || '/assets/images/fleet_suzuki_apv_1793252858721.jpg'}
                          alt="Pratinjau Mobil"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 font-semibold text-xs">
                          <Upload className="w-3.5 h-3.5 text-slate-600" />
                          Pilih Foto dari Perangkat
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleVehicleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Format JPG/PNG. Atau gunakan foto default resmi Suzuki APV Arena.
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setVehicleForm({
                              ...vehicleForm,
                              imageUrl: '/assets/images/fleet_suzuki_apv_1793252858721.jpg',
                            })
                          }
                          className="text-[11px] text-emerald-700 font-semibold hover:underline block"
                        >
                          Gunakan Foto Suzuki APV Arena Resmi
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nama Unit Kendaraan *
                      </label>
                      <input
                        type="text"
                        required
                        value={vehicleForm.name}
                        onChange={(e) =>
                          setVehicleForm({ ...vehicleForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nomor Plat Polisi *
                      </label>
                      <input
                        type="text"
                        required
                        value={vehicleForm.plateNumber}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            plateNumber: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono uppercase font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Status Kendaraan
                      </label>
                      <select
                        value={vehicleForm.status}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            status: e.target.value as VehicleStatus,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      >
                        <option value="Tersedia">Tersedia</option>
                        <option value="Digunakan">Digunakan</option>
                        <option value="Dalam Servis">Dalam Servis</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Kapasitas Kursi (Seat)
                      </label>
                      <input
                        type="number"
                        value={vehicleForm.capacity}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            capacity: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Jenis Bahan Bakar
                      </label>
                      <select
                        value={vehicleForm.fuelType}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            fuelType: e.target.value as FuelType,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      >
                        <option value="Pertalite / Pertamax">Pertalite / Pertamax</option>
                        <option value="Solar / Dexlite">Solar / Dexlite</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Odometer Saat Ini (KM)
                      </label>
                      <input
                        type="number"
                        value={vehicleForm.odometerKm}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            odometerKm: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Tanggal Servis Terakhir
                      </label>
                      <input
                        type="date"
                        value={vehicleForm.lastServiceDate}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            lastServiceDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Catatan Kendaraan
                      </label>
                      <textarea
                        rows={2}
                        value={vehicleForm.notes}
                        onChange={(e) =>
                          setVehicleForm({ ...vehicleForm, notes: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setVehicleModalOpen(false)}
                      className="px-4 py-2 text-slate-600"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold"
                    >
                      Simpan Data Armada
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SUBTAB 5: LOGO & PROFIL LEMBAGA --- */}
      {activeSubTab === 'logo' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <ImageUp className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                Logo Resmi Yayasan / Sekolah
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-28 h-28 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 p-2">
                <img
                  src={settings.logoUrl}
                  alt="Logo Yayasan"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      '/assets/images/logo_daar_el_dzikr_1793160265235.jpg';
                  }}
                />
              </div>

              <div className="space-y-2 text-xs">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-xs transition-colors">
                  <Upload className="w-4 h-4" />
                  Unggah Logo Baru
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-500">
                  Logo akan ditampilkan secara otomatis pada Kop Surat Perintah Jalan, BAST Serah Terima, Kwitansi Infaq, dan Navbar aplikasi.
                </p>
              </div>
            </div>
          </div>

          {/* Profil & Ubah PIN */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                Nama Yayasan &amp; Pengaturan PIN Koordinator
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Aplikasi
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.schoolName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, schoolName: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Yayasan / Badan Penyelenggara
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.foundationName}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      foundationName: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 font-bold text-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Kompleks Yayasan
                </label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, address: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ganti PIN Koordinator (Opsional)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="Isi jika ingin mengganti PIN (default: 8899)"
                  value={profileForm.newPin}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, newPin: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 font-mono tracking-widest text-center"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  PIN saat ini: <strong className="font-mono">{settings.coordinatorPin || '8899'}</strong>
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs"
              >
                Simpan Profil &amp; PIN
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
