/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Vehicle, FuelType, VehicleStatus } from '../types';
import {
  Plus,
  Users,
  Fuel,
  Gauge,
  Calendar,
  Search,
  Lock,
  Edit2,
  Trash2,
  CheckCircle,
  Car,
  Upload,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const ArmadaView: React.FC = () => {
  const {
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    isCoordinator,
    setCoordinatorPinModalOpen,
    setActiveTab,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [deleteTargetVehicle, setDeleteTargetVehicle] = useState<Vehicle | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
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
    notes: 'Mobil resmi Kendaraan Yayasan Daar El Dzikir. Kondisi prima, AC dingin, cover sarung mobil tersimpan di garasi.',
  });

  const filteredVehicles = vehicles.filter((v) => {
    const matchStatus = filterStatus === 'Semua' || v.status === filterStatus;
    const matchSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleOpenAdd = () => {
    if (!isCoordinator) {
      setCoordinatorPinModalOpen(true);
      return;
    }
    setEditingVehicleId(null);
    setFormData({
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
    setModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    if (!isCoordinator) {
      setCoordinatorPinModalOpen(true);
      return;
    }
    setEditingVehicleId(v.id);
    setFormData({
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
    setModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.plateNumber) return;

    if (editingVehicleId) {
      updateVehicle(editingVehicleId, formData);
    } else {
      addVehicle(formData);
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetVehicle) return;
    deleteVehicle(deleteTargetVehicle.id);
    setDeleteTargetVehicle(null);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Car className="w-5 h-5 text-emerald-700" />
            Armada Kendaraan Yayasan Daar El Dzikir
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unit Operasional Resmi: Suzuki APV Arena GX Luxury (B 1928 SDZ)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
          >
            {isCoordinator ? (
              <>
                <Plus className="w-4 h-4" />
                Tambah Unit
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-emerald-300" />
                Kelola Armada (Koordinator)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto text-xs">
          {['Semua', 'Tersedia', 'Digunakan', 'Dalam Servis'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
                filterStatus === st
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama atau plat nomor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.map((v) => (
          <div
            key={v.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            {/* Image */}
            <div className="relative h-56 bg-slate-100 overflow-hidden group">
              <img
                src={v.imageUrl || '/assets/images/fleet_suzuki_apv_1793252858721.jpg'}
                alt={v.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    '/assets/images/fleet_suzuki_apv_1793252858721.jpg';
                }}
              />
              <div className="absolute top-3 right-3">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full shadow-xs ${
                    v.status === 'Tersedia'
                      ? 'bg-emerald-600 text-white'
                      : v.status === 'Digunakan'
                      ? 'bg-blue-600 text-white'
                      : v.status === 'Dibooking'
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {v.status}
                </span>
              </div>
              <div className="absolute bottom-2 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider">
                {v.plateNumber}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 tracking-wide uppercase">
                  {v.type}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{v.name}</h3>
                {v.notes && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {v.notes}
                  </p>
                )}
              </div>

              {/* Spec Grid */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Kapasitas: {v.capacity} Orang</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Fuel className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{v.fuelType}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Gauge className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-mono tabular-nums">
                    {(v.odometerKm ?? 38450).toLocaleString('id-ID')} KM
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Servis: {v.lastServiceDate}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                {isCoordinator ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(v)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Edit Armada"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetVehicle(v)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Armada"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400">Siap operasional</span>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab('booking')}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Booking Unit Ini
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* In-App Delete Confirmation Modal (NO window.confirm) */}
      {deleteTargetVehicle && (
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
                Apakah Anda yakin ingin menghapus unit kendaraan{' '}
                <strong className="text-slate-900">
                  {deleteTargetVehicle.name} ({deleteTargetVehicle.plateNumber})
                </strong>
                ? Data peminjaman sebelumnya akan tetap tersimpan.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTargetVehicle(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
              >
                Hapus Armada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-emerald-800 p-5 text-white flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm">
                {editingVehicleId ? 'Edit Data Armada APV' : 'Tambah Unit Armada Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white/80 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs overflow-y-auto">
              {/* Photo Upload & Preview Section */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-700">
                  Upload Foto Kendaraan
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-300 shrink-0">
                    <img
                      src={formData.imageUrl || '/assets/images/fleet_suzuki_apv_1793252858721.jpg'}
                      alt="Pratinjau Mobil"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 font-semibold text-xs">
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      Pilih Foto dari Galeri / Kamera
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          imageUrl: '/assets/images/fleet_suzuki_apv_1793252858721.jpg',
                        })
                      }
                      className="text-[11px] text-emerald-700 font-semibold hover:underline block"
                    >
                      Gunakan Foto Resmi Suzuki APV Arena
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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Kendaraan</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as VehicleStatus })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Digunakan">Digunakan</option>
                    <option value="Dalam Servis">Dalam Servis</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kapasitas (Seat)</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bahan Bakar</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) =>
                      setFormData({ ...formData, fuelType: e.target.value as FuelType })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="Pertalite / Pertamax">Pertalite / Pertamax</option>
                    <option value="Solar / Dexlite">Solar / Dexlite</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Odometer (KM)</label>
                  <input
                    type="number"
                    value={formData.odometerKm}
                    onChange={(e) =>
                      setFormData({ ...formData, odometerKm: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Terakhir Servis</label>
                  <input
                    type="date"
                    value={formData.lastServiceDate}
                    onChange={(e) =>
                      setFormData({ ...formData, lastServiceDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Perubahan Armada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
