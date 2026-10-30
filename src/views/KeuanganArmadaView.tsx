/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InfaqRecord, ExpenseRecord, ExpenseCategory } from '../types';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Edit2,
  Trash2,
  Search,
  Printer,
  Shield,
  Coins,
  Receipt,
  AlertTriangle,
  Building,
  UserCheck,
  Calendar,
  Fuel,
  Wrench,
  Sparkles,
  CreditCard,
  DollarSign,
  CheckCircle2,
  HelpCircle,
  FileText,
  Lock,
} from 'lucide-react';

interface KeuanganArmadaViewProps {
  embeddedInSettings?: boolean;
}

export const KeuanganArmadaView: React.FC<KeuanganArmadaViewProps> = ({ embeddedInSettings }) => {
  const {
    infaqRecords,
    expenses,
    updateInfaqRecord,
    deleteInfaqRecord,
    addExpenseRecord,
    updateExpenseRecord,
    deleteExpenseRecord,
    totalInfaqAmount,
    totalExpenseAmount,
    cashBalance,
    settings,
    isCoordinator,
    setCoordinatorPinModalOpen,
    verifyCoordinatorPin,
    setActiveTab,
    setPrintDoc,
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTabSub, setActiveTabSub] = useState<'semua' | 'pemasukan' | 'pengeluaran'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal State: Koreksi / Edit Infaq
  const [editInfaqModalOpen, setEditInfaqModalOpen] = useState(false);
  const [selectedInfaq, setSelectedInfaq] = useState<InfaqRecord | null>(null);
  const [infaqForm, setInfaqForm] = useState({
    contributorName: '',
    division: '',
    amount: 0,
    date: '',
    paymentMethod: 'Tunai di Kasir Sarpras' as InfaqRecord['paymentMethod'],
    purpose: '',
    notes: '',
    receivedBy: '',
  });

  // Modal State: Tambah / Edit Pengeluaran
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: 'BBM / Bensin' as ExpenseCategory,
    title: '',
    amount: 0,
    picName: settings.coordinatorName || 'Moch Cholil, S.Pd.I',
    paymentMethod: 'Tunai Kas Sarpras' as ExpenseRecord['paymentMethod'],
    notes: '',
    receiptNumber: '',
  });

  // Handle Open Edit Infaq
  const handleOpenEditInfaq = (record: InfaqRecord) => {
    setSelectedInfaq(record);
    setInfaqForm({
      contributorName: record.contributorName,
      division: record.division,
      amount: record.amount,
      date: record.date,
      paymentMethod: record.paymentMethod,
      purpose: record.purpose,
      notes: record.notes,
      receivedBy: record.receivedBy || settings.coordinatorName,
    });
    setEditInfaqModalOpen(true);
  };

  // Handle Save Edit Infaq
  const handleSaveInfaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInfaq) return;
    if (infaqForm.amount < 0) {
      alert('Nominal infaq tidak boleh bernilai negatif.');
      return;
    }

    updateInfaqRecord(selectedInfaq.id, {
      contributorName: infaqForm.contributorName,
      division: infaqForm.division,
      amount: Number(infaqForm.amount),
      date: infaqForm.date,
      paymentMethod: infaqForm.paymentMethod,
      purpose: infaqForm.purpose,
      notes: infaqForm.notes,
      receivedBy: infaqForm.receivedBy,
    });

    setEditInfaqModalOpen(false);
    setSelectedInfaq(null);
  };

  // Handle Delete Infaq
  const handleDeleteInfaq = (id: string, receiptNo: string) => {
    if (
      window.confirm(
        `Yakin ingin menghapus catatan infaq ${receiptNo}? Saldo kas akan berkurang dan disesuaikan secara realtime.`
      )
    ) {
      deleteInfaqRecord(id);
    }
  };

  // Handle Open Add / Edit Expense
  const handleOpenAddExpense = () => {
    setEditingExpenseId(null);
    setExpenseForm({
      date: new Date().toISOString().slice(0, 10),
      category: 'BBM / Bensin',
      title: '',
      amount: 0,
      picName: settings.coordinatorName || 'Moch Cholil, S.Pd.I',
      paymentMethod: 'Tunai Kas Sarpras',
      notes: '',
      receiptNumber: '',
    });
    setExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (exp: ExpenseRecord) => {
    setEditingExpenseId(exp.id);
    setExpenseForm({
      date: exp.date,
      category: exp.category,
      title: exp.title,
      amount: exp.amount,
      picName: exp.picName,
      paymentMethod: exp.paymentMethod,
      notes: exp.notes,
      receiptNumber: exp.receiptNumber || '',
    });
    setExpenseModalOpen(true);
  };

  // Handle Save Expense
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title.trim() || expenseForm.amount <= 0) {
      alert('Lengkapi uraian pengeluaran dan nominal biaya yang valid.');
      return;
    }

    if (editingExpenseId) {
      updateExpenseRecord(editingExpenseId, {
        date: expenseForm.date,
        category: expenseForm.category,
        title: expenseForm.title,
        amount: Number(expenseForm.amount),
        picName: expenseForm.picName,
        paymentMethod: expenseForm.paymentMethod,
        notes: expenseForm.notes,
        receiptNumber: expenseForm.receiptNumber,
      });
    } else {
      addExpenseRecord({
        date: expenseForm.date,
        category: expenseForm.category,
        title: expenseForm.title,
        amount: Number(expenseForm.amount),
        picName: expenseForm.picName,
        paymentMethod: expenseForm.paymentMethod,
        notes: expenseForm.notes,
        receiptNumber: expenseForm.receiptNumber,
      });
    }

    setExpenseModalOpen(false);
  };

  // Handle Delete Expense
  const handleDeleteExpense = (id: string, expenseNo: string) => {
    if (
      window.confirm(
        `Yakin ingin menghapus pengeluaran ${expenseNo}? Saldo kas akan bertambah kembali secara realtime.`
      )
    ) {
      deleteExpenseRecord(id);
    }
  };

  // Filtered Lists
  const filteredInfaq = (infaqRecords || []).filter((r) => {
    const matchesSearch =
      r.contributorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.division.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredExpenses = (expenses || []).filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.expenseNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.picName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Combined Timeline Transactions (Sorted newest first)
  const combinedTransactions = [
    ...(filteredInfaq || []).map((i) => ({
      id: i.id,
      docId: i.id,
      type: 'pemasukan' as const,
      code: i.receiptNo,
      date: i.date,
      title: `${i.contributorName} (${i.division}) - ${i.purpose}`,
      category: 'Infaq Pemakaian',
      amount: i.amount,
      pic: i.receivedBy || settings.coordinatorName,
      paymentMethod: i.paymentMethod,
      notes: i.notes,
      rawItem: i,
    })),
    ...(filteredExpenses || []).map((e) => ({
      id: e.id,
      docId: e.id,
      type: 'pengeluaran' as const,
      code: e.expenseNo,
      date: e.date,
      title: e.title,
      category: e.category,
      amount: e.amount,
      pic: e.picName,
      paymentMethod: e.paymentMethod,
      notes: e.notes,
      rawItem: e,
    })),
  ].sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));

  // Buku kas & riwayat mutasi HANYA tampil untuk Koordinator
  if (!isCoordinator) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden animate-fadeIn">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 text-center">
          <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl mx-auto flex items-center justify-center mb-3 text-emerald-400">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold">Buku Kas &amp; Riwayat Khusus Koordinator</h2>
          <p className="text-xs text-slate-300 mt-1">
            Buku kas keuangan, mutasi pengeluaran, dan riwayat transaksi armada hanya dapat diakses oleh Koordinator Sarpras.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const ok = verifyCoordinatorPin(pinInput);
            if (!ok) setPinError(true);
            else setPinError(false);
          }}
          className="p-6 space-y-4 text-xs"
        >
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Masukkan PIN Otorisasi Koordinator
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="Masukkan PIN (default: 8899)"
              className="w-full text-center text-lg font-mono tracking-widest px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              autoFocus
            />
            {pinError && (
              <p className="text-rose-600 text-[11px] font-semibold mt-1.5 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                PIN salah. Silakan coba lagi.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs transition-colors"
          >
            Buka Buku Kas &amp; Riwayat
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="w-full text-center text-slate-500 hover:text-slate-800 text-xs py-1"
          >
            &larr; Kembali ke Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-700" />
              Buku Kas Keuangan Armada
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
              Firebase Synced
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-2">
            Pemasukan, Pengeluaran &amp; Saldo Kas Armada
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl">
            Sistem pencatatan transparan pengelolaan kas operasional armada (Suzuki APV). Koordinator berwenang mengoreksi angka infaq yang keliru diinput dan mencatat pengeluaran riil agar saldo kas senantiasa sinkron dengan fisik uang tunai di kasir Sarpras.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
          {isCoordinator ? (
            <button
              type="button"
              onClick={handleOpenAddExpense}
              className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Catat Pengeluaran Kas
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCoordinatorPinModalOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              Masuk Mode Koordinator
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('infaq')}
            className="px-3.5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Coins className="w-4 h-4 text-emerald-600" />
            + Bayar Infaq Peminjaman
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Saldo Kas Berjalan (Big Highlight) */}
        <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-3 -bottom-3 opacity-10 pointer-events-none">
            <Wallet className="w-32 h-32" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-200 uppercase tracking-wider">
              Saldo Kas Tersedia
            </span>
            <span className="p-2 bg-white/10 rounded-xl text-emerald-300">
              <Coins className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-extrabold tracking-tight font-mono">
              Rp {cashBalance.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-emerald-100 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              Kas Riil Operasional Terkontrol
            </p>
          </div>
        </div>

        {/* Card 2: Total Pemasukan Infaq */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Pemasukan
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl md:text-2xl font-bold text-emerald-700 font-mono">
              Rp {totalInfaqAmount.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Dari {infaqRecords.length} transaksi infaq &amp; denda
            </p>
          </div>
        </div>

        {/* Card 3: Total Pengeluaran */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Pengeluaran
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl md:text-2xl font-bold text-rose-700 font-mono">
              Rp {totalExpenseAmount.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Dari {expenses.length} mutasi biaya BBM, servis &amp; cuci
            </p>
          </div>
        </div>

        {/* Card 4: Penanggung Jawab Kas */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Penanggung Jawab Kas
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="font-bold text-slate-900 text-sm truncate" title={settings.coordinatorName}>
              {settings.coordinatorName || 'Moch Cholil, S.Pd.I'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {settings.coordinatorTitle || 'PJ Yayasan / Koordinator Sarpras'}
            </p>
            {isCoordinator && (
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className="text-[11px] text-emerald-700 hover:underline font-semibold mt-1 inline-flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                Ubah Nama PJ di Pengaturan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        {/* Navigation Tabs & Search Controls */}
        <div className="p-4 md:p-5 border-b border-slate-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Sub-tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTabSub('semua')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTabSub === 'semua'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Mutasi ({combinedTransactions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTabSub('pemasukan')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTabSub === 'pemasukan'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Pemasukan Kas ({filteredInfaq.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTabSub('pengeluaran')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTabSub === 'pengeluaran'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-800 hover:bg-rose-50'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Pengeluaran ({filteredExpenses.length})
            </button>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kode, nama, keperluan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {activeTabSub === 'pengeluaran' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Semua Kategori</option>
                <option value="BBM / Bensin">BBM / Bensin</option>
                <option value="Servis & Ganti Oli">Servis &amp; Ganti Oli</option>
                <option value="Cuci Kendaraan">Cuci Kendaraan</option>
                <option value="Tambal Ban & Angin">Tambal Ban &amp; Angin</option>
                <option value="Tol & Parkir">Tol &amp; Parkir</option>
                <option value="Sparepart & Aksesoris">Sparepart</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>
            )}
          </div>
        </div>

        {/* Tab 1: Semua Mutasi (Buku Kas Umum) */}
        {activeTabSub === 'semua' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Tanggal &amp; Kode</th>
                  <th className="py-3 px-4">Tipe &amp; Kategori</th>
                  <th className="py-3 px-4">Uraian / Keterangan</th>
                  <th className="py-3 px-4">PJ / Kasir</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  {isCoordinator && <th className="py-3 px-4 text-center">Aksi Koordinator</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {combinedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Belum ada transaksi kas yang tercatat.
                    </td>
                  </tr>
                ) : (
                  combinedTransactions.map((tx) => (
                    <tr key={tx.code} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{tx.date}</div>
                        <div className="text-[11px] font-mono text-slate-500">{tx.code}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            tx.type === 'pemasukan'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tx.type === 'pemasukan' ? (
                            <ArrowDownLeft className="w-3 h-3" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3" />
                          )}
                          {tx.category}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{tx.paymentMethod}</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-slate-900 line-clamp-1">{tx.title}</div>
                        {tx.notes && (
                          <div className="text-[11px] text-slate-500 italic line-clamp-1">
                            {tx.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{tx.pic}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span
                          className={tx.type === 'pemasukan' ? 'text-emerald-700' : 'text-rose-700'}
                        >
                          {tx.type === 'pemasukan' ? '+' : '-'} Rp{' '}
                          {tx.amount.toLocaleString('id-ID')}
                        </span>
                      </td>
                      {isCoordinator && (
                        <td className="py-3 px-4 text-center">
                          {tx.type === 'pemasukan' ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditInfaq(tx.rawItem as InfaqRecord)}
                                className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                                title="Koreksi Nominal / Data Infaq"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteInfaq(tx.id, tx.code)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Hapus Infaq Keliru"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditExpense(tx.rawItem as ExpenseRecord)}
                                className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
                                title="Edit Pengeluaran"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteExpense(tx.id, tx.code)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Hapus Pengeluaran"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Pemasukan Kas (Infaq & Koreksi Angka) */}
        {activeTabSub === 'pemasukan' && (
          <div>
            <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 flex items-start gap-3 text-xs text-emerald-900">
              <AlertTriangle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Otorisasi Koreksi Nominal Infaq Koordinator</p>
                <p className="text-emerald-800 text-[11px] mt-0.5">
                  Jika pengguna atau staf salah menginput nominal (misal saldo kas bertambah tetapi fisik uang kasir belum sesuai), klik tombol <strong>Koreksi / Edit</strong> pada baris terkait untuk menyesuaikan nominal dengan uang riil.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">No. Kuitansi</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Peminjam / Donatur</th>
                    <th className="py-3 px-4">Unit / Divisi</th>
                    <th className="py-3 px-4">Keperluan / Catatan</th>
                    <th className="py-3 px-4">Metode Bayar</th>
                    <th className="py-3 px-4 text-right">Nominal Infaq</th>
                    <th className="py-3 px-4 text-center">Aksi Koordinator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInfaq.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Tidak ada data pemasukan infaq yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredInfaq.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.receiptNo}</td>
                        <td className="py-3 px-4 text-slate-600">{item.date}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{item.contributorName}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {item.division}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="line-clamp-1">{item.purpose}</div>
                          {item.notes && <div className="text-[11px] text-slate-500 italic">{item.notes}</div>}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{item.paymentMethod}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                          Rp {item.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isCoordinator ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditInfaq(item)}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-colors"
                                title="Koreksi Nilai Infaq"
                              >
                                <Edit2 className="w-3 h-3 text-emerald-700" />
                                Koreksi
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteInfaq(item.id, item.receiptNo)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Hapus Data Salah"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Login Koordinator</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Pengeluaran Kas (BBM, Servis, Cuci, dll.) */}
        {activeTabSub === 'pengeluaran' && (
          <div>
            <div className="p-4 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between gap-3 text-xs text-rose-900">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-rose-700 shrink-0" />
                <span>
                  Pengeluaran kas operasional &amp; perawatan armada Suzuki APV Yayasan tercatat:{' '}
                  <strong>Rp {totalExpenseAmount.toLocaleString('id-ID')}</strong>
                </span>
              </div>
              {isCoordinator && (
                <button
                  type="button"
                  onClick={handleOpenAddExpense}
                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Catat Pengeluaran
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">No. Pengeluaran</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Kategori Biaya</th>
                    <th className="py-3 px-4">Uraian / Keterangan</th>
                    <th className="py-3 px-4">PJ / Yang Mengeluarkan</th>
                    <th className="py-3 px-4">No. Nota / Bukti</th>
                    <th className="py-3 px-4 text-right">Nominal</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Belum ada catatan pengeluaran kas.
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{exp.expenseNo}</td>
                        <td className="py-3 px-4 text-slate-600">{exp.date}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px] font-semibold">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-semibold text-slate-900">{exp.title}</div>
                          {exp.notes && <div className="text-[11px] text-slate-500 italic">{exp.notes}</div>}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">{exp.picName}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{exp.receiptNumber || '-'}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-rose-700">
                          Rp {exp.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isCoordinator ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditExpense(exp)}
                                className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Pengeluaran"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteExpense(exp.id, exp.expenseNo)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Hapus Pengeluaran"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Login Koordinator</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Koreksi / Edit Infaq Oleh Koordinator */}
      {editInfaqModalOpen && selectedInfaq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Koreksi Saldo Riil
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Koreksi Catatan Infaq ({selectedInfaq.receiptNo})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditInfaqModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveInfaq} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nominal Infaq yang Benar (Rp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={infaqForm.amount}
                    onChange={(e) => setInfaqForm({ ...infaqForm, amount: Number(e.target.value) })}
                    className="w-full pl-10 pr-3 py-2 text-sm font-bold font-mono text-emerald-800 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-emerald-50/30"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Sesuaikan nominal ini dengan fisik uang riil yang diterima di kasir Sarpras atau mutasi bank.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Peminjam / Donatur *</label>
                  <input
                    type="text"
                    required
                    value={infaqForm.contributorName}
                    onChange={(e) => setInfaqForm({ ...infaqForm, contributorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit / Divisi</label>
                  <input
                    type="text"
                    value={infaqForm.division}
                    onChange={(e) => setInfaqForm({ ...infaqForm, division: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Transaksi *</label>
                  <input
                    type="date"
                    required
                    value={infaqForm.date}
                    onChange={(e) => setInfaqForm({ ...infaqForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Metode Pembayaran</label>
                  <select
                    value={infaqForm.paymentMethod}
                    onChange={(e) =>
                      setInfaqForm({
                        ...infaqForm,
                        paymentMethod: e.target.value as InfaqRecord['paymentMethod'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Tunai di Kasir Sarpras">Tunai di Kasir Sarpras</option>
                    <option value="Transfer Bank Yayasan">Transfer Bank Yayasan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Uraian / Keperluan</label>
                <input
                  type="text"
                  value={infaqForm.purpose}
                  onChange={(e) => setInfaqForm({ ...infaqForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Koreksi</label>
                <textarea
                  rows={2}
                  value={infaqForm.notes}
                  onChange={(e) => setInfaqForm({ ...infaqForm, notes: e.target.value })}
                  placeholder="Alasan koreksi (contoh: Salah input nominal dari peminjam, disesuaikan dengan uang kasir)."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditInfaqModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-xs"
                >
                  Simpan Koreksi Infaq
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Tambah / Edit Pengeluaran Kas Armada */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-semibold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md">
                  Pengeluaran Kas
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {editingExpenseId ? 'Edit Catatan Pengeluaran' : 'Catat Pengeluaran Kas Armada Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setExpenseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nominal Pengeluaran Biaya (Rp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    value={expenseForm.amount || ''}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    placeholder="Contoh: 150000"
                    className="w-full pl-10 pr-3 py-2 text-sm font-bold font-mono text-rose-800 rounded-xl border border-rose-300 focus:ring-2 focus:ring-rose-500 focus:outline-hidden bg-rose-50/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Pengeluaran *</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, category: e.target.value as ExpenseCategory })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="BBM / Bensin">BBM / Bensin</option>
                    <option value="Servis & Ganti Oli">Servis &amp; Ganti Oli</option>
                    <option value="Cuci Kendaraan">Cuci Kendaraan</option>
                    <option value="Tambal Ban & Angin">Tambal Ban &amp; Angin</option>
                    <option value="Tol & Parkir">Tol &amp; Parkir</option>
                    <option value="Pajak & STNK">Pajak &amp; STNK</option>
                    <option value="Sparepart & Aksesoris">Sparepart &amp; Aksesoris</option>
                    <option value="Honor Supir / Driver">Honor Supir / Driver</option>
                    <option value="Perawatan Darurat">Perawatan Darurat</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Uraian / Keperluan Pengeluaran *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengisian BBM Pertalite 3 Strip persiapan dinas"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PJ / Yang Mengeluarkan *</label>
                  <input
                    type="text"
                    required
                    value={expenseForm.picName}
                    onChange={(e) => setExpenseForm({ ...expenseForm, picName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Nota / Struk SPBU / Bengkel</label>
                  <input
                    type="text"
                    placeholder="Contoh: NOTA-1029 / SPBU-01"
                    value={expenseForm.receiptNumber}
                    onChange={(e) => setExpenseForm({ ...expenseForm, receiptNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Metode Pembayaran</label>
                <select
                  value={expenseForm.paymentMethod}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      paymentMethod: e.target.value as ExpenseRecord['paymentMethod'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Tunai Kas Sarpras">Tunai Kas Sarpras</option>
                  <option value="Transfer Bank Yayasan">Transfer Bank Yayasan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  value={expenseForm.notes}
                  onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                  placeholder="Keterangan tambahan nota, lokasi bengkel, dll."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setExpenseModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-semibold shadow-xs"
                >
                  {editingExpenseId ? 'Simpan Perubahan' : 'Catat Pengeluaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
