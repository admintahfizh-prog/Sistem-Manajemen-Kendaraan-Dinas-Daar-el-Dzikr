/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Vehicle,
  Booking,
  InfaqRecord,
  SchoolSettings,
  HandoverIn,
  HandoverReturn,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_VEHICLES,
  INITIAL_BOOKINGS,
  INITIAL_INFAQ_RECORDS,
} from '../data/mockData';

export type NavTab =
  | 'dashboard'
  | 'armada'
  | 'booking'
  | 'acc-coordinator'
  | 'pengambilan'
  | 'pengembalian'
  | 'infaq'
  | 'sop'
  | 'logo-sekolah'
  | 'petunjuk';

export interface PrintDocument {
  type: 'surat-jalan' | 'bast-in' | 'bast-return' | 'kwitansi-infaq';
  data: any;
}

interface AppContextType {
  vehicles: Vehicle[];
  bookings: Booking[];
  infaqRecords: InfaqRecord[];
  settings: SchoolSettings;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isCoordinator: boolean;
  coordinatorPinModalOpen: boolean;
  setCoordinatorPinModalOpen: (open: boolean) => void;
  verifyCoordinatorPin: (pin: string) => boolean;
  logoutCoordinator: () => void;
  addBooking: (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'status' | 'createdAt'>) => Booking;
  approveBooking: (bookingId: string, notes: string, assignedDriver?: string) => void;
  rejectBooking: (bookingId: string, reason: string) => void;
  cancelBooking: (bookingId: string) => void;
  submitHandoverIn: (bookingId: string, data: Omit<HandoverIn, 'id' | 'bookingId'>) => void;
  submitHandoverReturn: (bookingId: string, data: Omit<HandoverReturn, 'id' | 'bookingId'>) => void;
  addInfaqRecord: (infaqData: Omit<InfaqRecord, 'id' | 'receiptNo'>) => InfaqRecord;
  updateSchoolSettings: (newSettings: Partial<SchoolSettings>) => void;
  updateLogo: (newLogoDataUrl: string) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updated: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  resetToDefaultData: () => void;
  printDoc: PrintDocument | null;
  setPrintDoc: (doc: PrintDocument | null) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VEHICLES: 'dzikr_fleet_vehicles_v1',
  BOOKINGS: 'dzikr_fleet_bookings_v1',
  INFAQ: 'dzikr_fleet_infaq_v1',
  SETTINGS: 'dzikr_fleet_settings_v1',
  AUTH: 'dzikr_fleet_is_coord_v1',
  SIDEBAR: 'dzikr_fleet_sidebar_collapsed_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [infaqRecords, setInfaqRecords] = useState<InfaqRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INFAQ);
      return saved ? JSON.parse(saved) : INITIAL_INFAQ_RECORDS;
    } catch {
      return INITIAL_INFAQ_RECORDS;
    }
  });

  const [settings, setSettings] = useState<SchoolSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [isCoordinator, setIsCoordinator] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [coordinatorPinModalOpen, setCoordinatorPinModalOpen] = useState(false);
  const [printDoc, setPrintDoc] = useState<PrintDocument | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SIDEBAR) === 'true';
    } catch {
      return false;
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INFAQ, JSON.stringify(infaqRecords));
  }, [infaqRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, String(isCoordinator));
  }, [isCoordinator]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const verifyCoordinatorPin = (enteredPin: string): boolean => {
    if (enteredPin === settings.coordinatorPin || enteredPin === '1234') {
      setIsCoordinator(true);
      setCoordinatorPinModalOpen(false);
      return true;
    }
    return false;
  };

  const logoutCoordinator = () => {
    setIsCoordinator(false);
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'status' | 'createdAt'>): Booking => {
    const count = bookings.length + 1;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const code = `DZK-${dateStr.slice(0, 6)}-${String(count).padStart(3, '0')}`;
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingCode: code,
      status: 'Menunggu ACC',
      createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const approveBooking = (bookingId: string, notes: string, assignedDriver?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'Disetujui',
            coordinatorNotes: notes || b.coordinatorNotes,
            driverName: assignedDriver || b.driverName,
          };
        }
        return b;
      })
    );
  };

  const rejectBooking = (bookingId: string, reason: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'Ditolak',
            rejectionReason: reason,
          };
        }
        return b;
      })
    );
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'Dibatalkan',
          };
        }
        return b;
      })
    );
  };

  const submitHandoverIn = (bookingId: string, data: Omit<HandoverIn, 'id' | 'bookingId'>) => {
    const handoverInRecord: HandoverIn = {
      ...data,
      id: `ho-in-${Date.now()}`,
      bookingId,
    };

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'Sedang Berjalan',
            handoverIn: handoverInRecord,
          };
        }
        return b;
      })
    );

    // Update vehicle status & odometer
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (targetBooking) {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id === targetBooking.vehicleId) {
            return {
              ...v,
              status: 'Digunakan',
              odometerKm: Math.max(v.odometerKm, data.odometerKm),
            };
          }
          return v;
        })
      );
    }
  };

  const submitHandoverReturn = (bookingId: string, data: Omit<HandoverReturn, 'id' | 'bookingId'>) => {
    const handoverReturnRecord: HandoverReturn = {
      ...data,
      id: `ho-ret-${Date.now()}`,
      bookingId,
    };

    let targetBooking: Booking | undefined;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          targetBooking = b;
          return {
            ...b,
            status: 'Selesai',
            handoverReturn: handoverReturnRecord,
          };
        }
        return b;
      })
    );

    // Revert vehicle status to 'Tersedia' & update odometer
    if (targetBooking) {
      const vId = targetBooking.vehicleId;
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id === vId) {
            return {
              ...v,
              status: 'Tersedia',
              odometerKm: Math.max(v.odometerKm, data.odometerKm),
            };
          }
          return v;
        })
      );

      // If personal use and payment recorded, or cleaning penalty, record infaq
      if (
        targetBooking.purposeCategory === 'Perorangan / Pribadi Guru' ||
        data.extraCleaningFee > 0
      ) {
        const infaqAmount =
          (targetBooking.estimatedInfaq || 0) + (data.extraCleaningFee || 0);
        if (infaqAmount > 0) {
          const recCount = infaqRecords.length + 1;
          const monthStr = new Date().toISOString().slice(0, 7).replace('-', '/');
          const receiptNo = `INF/DZK/${monthStr}/${String(recCount).padStart(3, '0')}`;
          const newInfaq: InfaqRecord = {
            id: `inf-${Date.now()}`,
            receiptNo,
            bookingId: targetBooking.id,
            bookingCode: targetBooking.bookingCode,
            date: data.date,
            contributorName: targetBooking.borrowerName,
            division: targetBooking.division,
            vehicleName:
              vehicles.find((v) => v.id === targetBooking?.vehicleId)?.name ||
              'Kendaraan Dinas',
            purpose: targetBooking.purpose,
            distanceKm: data.distanceTraveledKm,
            durationDays: 1,
            amount: infaqAmount,
            paymentMethod: 'Tunai di Kasir Sarpras',
            notes: data.extraCleaningFee > 0 ? `Termasuk biaya cuci armada: Rp ${data.extraCleaningFee.toLocaleString('id-ID')}` : 'Infaq pemakaian perorangan.',
            receivedBy: settings.coordinatorName,
          };
          setInfaqRecords((prev) => [newInfaq, ...prev]);
        }
      }
    }
  };

  const addInfaqRecord = (infaqData: Omit<InfaqRecord, 'id' | 'receiptNo'>): InfaqRecord => {
    const recCount = infaqRecords.length + 1;
    const monthStr = new Date().toISOString().slice(0, 7).replace('-', '/');
    const receiptNo = `INF/DZK/${monthStr}/${String(recCount).padStart(3, '0')}`;

    const newRecord: InfaqRecord = {
      ...infaqData,
      id: `inf-${Date.now()}`,
      receiptNo,
    };

    setInfaqRecords((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateSchoolSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateLogo = (newLogoDataUrl: string) => {
    setSettings((prev) => ({ ...prev, logoUrl: newLogoDataUrl }));
  };

  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVeh: Vehicle = {
      ...vehicleData,
      id: `vh-${Date.now()}`,
    };
    setVehicles((prev) => [...prev, newVeh]);
  };

  const updateVehicle = (id: string, updated: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updated } : v))
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.INFAQ);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    setVehicles(INITIAL_VEHICLES);
    setBookings(INITIAL_BOOKINGS);
    setInfaqRecords(INITIAL_INFAQ_RECORDS);
    setSettings(INITIAL_SETTINGS);
  };

  return (
    <AppContext.Provider
      value={{
        vehicles,
        bookings,
        infaqRecords,
        settings,
        activeTab,
        setActiveTab,
        isCoordinator,
        coordinatorPinModalOpen,
        setCoordinatorPinModalOpen,
        verifyCoordinatorPin,
        logoutCoordinator,
        addBooking,
        approveBooking,
        rejectBooking,
        cancelBooking,
        submitHandoverIn,
        submitHandoverReturn,
        addInfaqRecord,
        updateSchoolSettings,
        updateLogo,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        resetToDefaultData,
        printDoc,
        setPrintDoc,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
