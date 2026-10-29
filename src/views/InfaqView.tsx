/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InfaqRecord, UnitKerja } from '../types';
import {
  HeartHandshake,
  Plus,
  Printer,
  Calculator,
  Search,
  Building,
  CheckCircle2,
  Clock,
  Car,
  CreditCard,
  Edit3,
  Phone,
  Copy,
  Check,
} from 'lucide-react';

export const InfaqView: React.FC = () => {
  const {
    infaqRecords,
    addInfaqRecord,
    setPrintDoc,
    settings,
    isCoordinator,
    setCoordinatorPinModalOpen,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  // Calculator State (12h 50rb, 24h 100rb)
  const [calcHours, setCalcHours] = useState(12);

  const calculateSimulatorInfaq = (hours: number) => {
    const rate12 = settings.infaq12Hours || 50000;
    const rate24 = settings.infaq24Hours || 100000;
    if (hours <= 12) return rate12;
    if (hours <= 24) return rate24;
    const days = Math.floor(hours / 24);
    const remainder = hours % 24;
    return days * rate24 + (remainder > 0 ? (remainder <= 12 ? rate12 : rate24) : 0);
  };

  // New Infaq Form State
  const [formData, setFormData] = useState({
    contributorName: '',
    division: 'Pribadi' as UnitKerja,
    vehicleName: 'Suzuki APV Arena GX Luxury (B 1928 SDZ)',
    purpose: 'Infaq pemakaian pribadi 12 Jam',
    distanceKm: 45,
    durationHours: 12,
    amount: settings.infaq12Hours || 50000,
    paymentMethod: 'Transfer Bank Yayasan' as InfaqRecord['paymentMethod'],
    notes: 'Infaq pemeliharaan armada Suzuki APV Yayasan.',
    receivedBy: settings.coordinatorName,
    date: new Date().toISOString().slice(0, 10),
  });

  const totalInfaq = (infaqRecords || []).reduce((acc, curr) => acc + (Number(curr?.amount) || 0), 0);

  const filteredRecords = infaqRecords.filter((r) => {
    return (
      r.contributorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.division.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(settings.bankAccountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleSubmitInfaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contributorName || formData.amount <= 0) {
      alert('Lengkapi nama dan nominal infaq.');
      return;
    }

    const newRecord = addInfaqRecord({
      ...formData,
      amount: Number(formData.amount),
      distanceKm: Number(formData.distanceKm),
      durationHours: Number(formData.durationHours),
    });

    setModalOpen(false);

    setPrintDoc({
      type: 'kwitansi-infaq',
      data: newRecord,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-700" />
            Buku Kas Infaq Pemakaian Pribadi Kendaraan Yayasan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kompensasi resmi: 12 Jam (Rp 50.000) &amp; 24 Jam (Rp 100.000) untuk tabungan servis &amp; oli Suzuki APV
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (isCoordinator) {
                setActiveTab('edit-rekening');
              } else {
                setCoordinatorPinModalOpen(true);
              }
            }}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            Edit Data Rekening
          </button>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Catat Tanda Terima Infaq
          </button>
        </div>
      </div>

      {/* Rekening Info Card Banner */}
      <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-800/80 px-2.5 py-0.5 rounded">
              Rekening Resmi Penampungan Infaq Armada
            </span>
            <h3 className="font-bold text-base text-white">{settings.bankName}</h3>
            <div className="flex items-center gap-3 pt-1">
              <span className="font-mono text-2xl font-bold tracking-wider text-amber-300">
                {settings.bankAccountNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedBank ? 'Tersalin' : 'Salin No. Rekening'}
              </button>
            </div>
            <p className="text-xs text-emerald-200 mt-1">
              a.n. <strong>{settings.bankAccountHolder}</strong>
            </p>
          </div>

          <div className="bg-emerald-800/60 p-4 rounded-xl border border-emerald-700/60 text-xs space-y-1.5 shrink-0">
            <p className="font-bold text-emerald-200">Konfirmasi Bukti Transfer:</p>
            <p className="flex items-center gap-1.5 text-white font-mono font-bold">
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              {settings.bankConfirmationPhone}
            </p>
            <p className="text-[11px] text-emerald-300">
              Koordinator: {settings.coordinatorName}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Total Infaq Terkumpul</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-emerald-800">Rp</span>
            <span className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
              {(totalInfaq ?? 0).toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Dari {infaqRecords.length} tanda terima sah tercatat
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Ketentuan Tarif Infaq Resmi</span>
          <div className="text-xs font-bold text-slate-800 space-y-1">
            <div className="flex justify-between">
              <span>Durasi s.d 12 Jam:</span>
              <span className="font-mono text-emerald-800 font-bold">
                Rp {(settings?.infaq12Hours ?? 50000).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Durasi s.d 24 Jam:</span>
              <span className="font-mono text-emerald-800 font-bold">
                Rp {(settings?.infaq24Hours ?? 100000).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Pengganti Cuci Armada Kotor</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-amber-800">Rp</span>
            <span className="text-2xl font-bold font-mono text-amber-800 tabular-nums">
              {(settings.washingPenaltyAmount || 35000).toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Jika dikembalikan dalam kondisi kotor / belum steam
          </p>
        </div>
      </div>

      {/* Interactive Simulator / Kalkulator Infaq 12 Jam / 24 Jam */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Calculator className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Simulasi Anjuran Infaq Pribadi (12 Jam: 50rb / 24 Jam: 100rb)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pilih / Masukkan Durasi Jam</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setCalcHours(12)}
                className={`flex-1 py-1.5 rounded-lg font-bold border transition-colors ${
                  calcHours === 12
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                12 Jam (50rb)
              </button>
              <button
                type="button"
                onClick={() => setCalcHours(24)}
                className={`flex-1 py-1.5 rounded-lg font-bold border transition-colors ${
                  calcHours === 24
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                24 Jam (100rb)
              </button>
            </div>
            <input
              type="number"
              min={1}
              max={168}
              value={calcHours}
              onChange={(e) => setCalcHours(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
              placeholder="Jumlah jam..."
            />
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl md:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-emerald-800">
                Total Anjuran Infaq Kompensasi Pemakaian
              </span>
              <span className="font-mono text-xs font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
                {calcHours} Jam Pemakaian
              </span>
            </div>
            <p className="text-2xl font-bold font-mono text-emerald-950 mt-1">
              Rp {(calculateSimulatorInfaq(calcHours) ?? 0).toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-emerald-800 mt-1">
              {calcHours <= 12
                ? 'Termasuk kategori setengah hari (s.d 12 Jam).'
                : calcHours <= 24
                ? 'Termasuk kategori 1 hari penuh (s.d 24 Jam).'
                : `Termasuk kategori lebih dari 1 hari (${Math.floor(calcHours / 24)} hari penuh).`}
            </p>
          </div>
        </div>
      </div>

      {/* Infaq Records Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Buku Kas &amp; Riwayat Penerimaan Infaq</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar tanda terima infaq resmi kas kendaraan Yayasan Daar el Dzikr
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau nomor kwitansi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50">
                <th className="py-2.5 px-3">No. Kwitansi</th>
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Penyetor / Guru</th>
                <th className="py-2.5 px-3">Unit &amp; Agenda</th>
                <th className="py-2.5 px-3">Metode Bayar</th>
                <th className="py-2.5 px-3 text-right">Nominal Infaq</th>
                <th className="py-2.5 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono text-emerald-800 font-semibold whitespace-nowrap">
                    {r.receiptNo}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono whitespace-nowrap">
                    {r.date}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900 leading-snug">{r.contributorName}</p>
                    <p className="text-[11px] text-slate-500">{r.division}</p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-medium text-slate-800">{r.vehicleName}</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">{r.purpose}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {r.paymentMethod}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800 text-sm whitespace-nowrap">
                    Rp {(r.amount ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() =>
                        setPrintDoc({
                          type: 'kwitansi-infaq',
                          data: r,
                        })
                      }
                      className="px-2.5 py-1 text-slate-600 hover:text-emerald-700 border border-slate-200 rounded-lg hover:bg-white text-[11px] font-semibold flex items-center gap-1 mx-auto transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Kwitansi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Catat Infaq Manual */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-emerald-800 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Catat Penerimaan Infaq Baru</h3>
                <p className="text-[11px] text-emerald-200 mt-0.5">
                  Penerbitan kwitansi sah kas kendaraan yayasan
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white/80 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitInfaq} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Penyetor / Peminjam *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contributorName}
                    onChange={(e) =>
                      setFormData({ ...formData, contributorName: e.target.value })
                    }
                    placeholder="Contoh: Ust. Ahmad Fauzan, S.Pd"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Kerja</label>
                  <select
                    value={formData.division}
                    onChange={(e) =>
                      setFormData({ ...formData, division: e.target.value as UnitKerja })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="Pribadi">Pribadi (Guru / Karyawan)</option>
                    <option value="PAUD">PAUD Daar el Dzikr</option>
                    <option value="SD">SD Daar el Dzikr</option>
                    <option value="SMP">SMP Daar el Dzikr</option>
                    <option value="MA">MA Daar el Dzikr</option>
                    <option value="Pesantren">Pondok Pesantren</option>
                    <option value="Yayasan">Yayasan Daar el Dzikr</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Durasi Jam</label>
                  <select
                    value={formData.durationHours}
                    onChange={(e) => {
                      const h = Number(e.target.value);
                      const amt =
                        h <= 12
                          ? settings.infaq12Hours || 50000
                          : settings.infaq24Hours || 100000;
                      setFormData({
                        ...formData,
                        durationHours: h,
                        amount: amt,
                        purpose: `Infaq pemakaian pribadi ${h} Jam`,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value={12}>12 Jam (Rp 50.000)</option>
                    <option value={24}>24 Jam (Rp 100.000)</option>
                    <option value={48}>48 Jam / 2 Hari (Rp 200.000)</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Keperluan / Agenda</label>
                  <input
                    type="text"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nominal Infaq (Rp) *
                  </label>
                  <input
                    type="number"
                    step={10000}
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Metode Setoran</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value as InfaqRecord['paymentMethod'],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="Tunai di Kasir Sarpras">Tunai di Kasir Sarpras</option>
                    <option value="Transfer Bank Yayasan">Transfer Bank Yayasan (BSI)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan &amp; Terbitkan Kwitansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
