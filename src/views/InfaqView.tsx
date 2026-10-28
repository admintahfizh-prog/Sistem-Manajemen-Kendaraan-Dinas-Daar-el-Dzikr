/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InfaqRecord } from '../types';
import {
  HeartHandshake,
  Plus,
  Printer,
  Calculator,
  Search,
  Wallet,
  Building,
  CheckCircle2,
  Clock,
  Car,
} from 'lucide-react';

export const InfaqView: React.FC = () => {
  const { infaqRecords, addInfaqRecord, setPrintDoc, settings, vehicles } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Calculator State
  const [calcDays, setCalcDays] = useState(1);
  const [calcKm, setCalcKm] = useState(100);

  const recommendedByDay = calcDays * settings.defaultInfaqPerDay;
  const recommendedByKm = calcKm * settings.defaultInfaqPerKm;

  // New Infaq Form State
  const [formData, setFormData] = useState({
    contributorName: '',
    division: 'SMP Daar el Dzikr',
    vehicleName: vehicles[0]?.name || 'Toyota Innova Zenix V',
    purpose: 'Keperluan pribadi keluarga guru',
    distanceKm: 120,
    durationDays: 1,
    amount: settings.defaultInfaqPerDay,
    paymentMethod: 'Tunai di Kasir Sarpras' as InfaqRecord['paymentMethod'],
    notes: 'Infaq sukarela pemeliharaan armada sekolah.',
    receivedBy: settings.coordinatorName,
    date: new Date().toISOString().slice(0, 10),
  });

  const totalInfaq = infaqRecords.reduce((acc, curr) => acc + curr.amount, 0);

  const filteredRecords = infaqRecords.filter((r) => {
    return (
      r.contributorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.division.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
      durationDays: Number(formData.durationDays),
    });

    setModalOpen(false);

    // Open receipt modal
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
            Rekapitulasi Infaq Pemakaian Perorangan &amp; Kas Pemeliharaan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kompensasi sukarela dari guru dan staf untuk tabungan servis, ganti oli, ban &amp; operasional armada
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Catat Infaq Masuk
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Total Infaq Terkumpul</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-emerald-800">Rp</span>
            <span className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
              {totalInfaq.toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Dari {infaqRecords.length} tanda terima sah tercatat
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Pemanfaatan Dana Kas</span>
          <p className="text-xs font-bold text-slate-800">100% Untuk Armada Sekolah</p>
          <p className="text-[11px] text-slate-500 mt-2">
            Servis berkala bengkel resmi, ganti pelumas mesin, dan kebersihan kabin
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Rekening Penampungan Sarpras</span>
          <p className="text-xs font-bold font-mono text-emerald-900">BSI: 712-345-6789</p>
          <p className="text-[11px] text-slate-500 mt-2">
            a.n. Yayasan Wakaf Pendidikan Daar el Dzikr
          </p>
        </div>
      </div>

      {/* Interactive Simulator / Kalkulator Infaq */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Calculator className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Kalkulator Simulasi Anjuran Infaq Perorangan (SOP Bab IV)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Durasi Hari Pemakaian</label>
            <input
              type="number"
              min={1}
              max={14}
              value={calcDays}
              onChange={(e) => setCalcDays(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Estimasi Jarak Tempuh (KM)</label>
            <input
              type="number"
              min={10}
              step={10}
              value={calcKm}
              onChange={(e) => setCalcKm(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
            />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-[10px] uppercase font-semibold text-emerald-800 block">
              Opsi A: Patokan Harian
            </span>
            <p className="text-sm font-bold font-mono text-emerald-900 mt-0.5">
              Rp {recommendedByDay.toLocaleString('id-ID')}
            </p>
            <span className="text-[10px] text-emerald-700">
              ({calcDays} Hari &times; Rp {settings.defaultInfaqPerDay.toLocaleString('id-ID')})
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] uppercase font-semibold text-slate-700 block">
              Opsi B: Patokan Jarak (KM)
            </span>
            <p className="text-sm font-bold font-mono text-slate-900 mt-0.5">
              Rp {recommendedByKm.toLocaleString('id-ID')}
            </p>
            <span className="text-[10px] text-slate-500">
              ({calcKm} KM &times; Rp {settings.defaultInfaqPerKm.toLocaleString('id-ID')})
            </span>
          </div>
        </div>
      </div>

      {/* Infaq Records Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Buku Kas &amp; Rekapitulasi Infaq</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar tanda terima infaq resmi yang masuk ke kas sarpras Daar el Dzikr
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
                <th className="py-2.5 px-3">Kendaraan &amp; Agenda</th>
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
                    Rp {r.amount.toLocaleString('id-ID')}
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
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-emerald-700 rounded-lg font-semibold inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Printer className="w-3 h-3" />
                      Kwitansi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Infaq Entry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Catat Penerimaan Infaq Armada Baru</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitInfaq} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Penyetor / Guru *
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
                  <label className="block font-semibold text-slate-700 mb-1">Unit Sekolah</label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="SD Daar el Dzikr">SD Daar el Dzikr</option>
                    <option value="SMP Daar el Dzikr">SMP Daar el Dzikr</option>
                    <option value="SMA Daar el Dzikr">SMA Daar el Dzikr</option>
                    <option value="Pondok Pesantren">Pondok Pesantren</option>
                    <option value="Yayasan Daar el Dzikr">Yayasan Daar el Dzikr</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Armada</label>
                  <select
                    value={formData.vehicleName}
                    onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name} ({v.plateNumber})
                      </option>
                    ))}
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
                    <option value="Transfer Bank Syariah Indonesia (BSI)">
                      Transfer BSI Yayasan
                    </option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Catatan</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Contoh: Infaq sukarela pemeliharaan kendaraan."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
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
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-xs"
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
