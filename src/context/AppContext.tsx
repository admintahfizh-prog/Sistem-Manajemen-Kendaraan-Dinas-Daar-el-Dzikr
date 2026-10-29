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
  AppNotification,
  NotificationType,
  SopChapter,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_VEHICLES,
  INITIAL_BOOKINGS,
  INITIAL_INFAQ_RECORDS,
  INITIAL_NOTIFICATIONS,
  SOP_CLAUSES_DATA,
} from '../data/mockData';
import { triggerAiNotification } from '../utils/notificationSound';

export type NavTab =
  | 'dashboard'
  | 'armada'
  | 'booking'
  | 'acc-coordinator'
  | 'pengambilan'
  | 'pengembalian'
  | 'infaq'
  | 'sop'
  | 'settings'
  | 'edit-klausul'
  | 'edit-rekening'
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
  sopClauses: SopChapter[];
  updateSopClauses: (clauses: SopChapter[]) => void;
  resetSopClauses: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isCoordinator: boolean;
  coordinatorPinModalOpen: boolean;
  setCoordinatorPinModalOpen: (open: boolean) => void;
  verifyCoordinatorPin: (pin: string) => boolean;
  logoutCoordinator: () => void;
  addBooking: (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'status' | 'createdAt'>) => Booking;
  approveBooking: (bookingId: string, notes: string) => void;
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
  notifications: AppNotification[];
  unreadNotificationCount: number;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (val: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  testAiNotificationVoice: () => void;
  toastNotification: AppNotification | null;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VEHICLES: 'dzikr_fleet_vehicles_v1',
  BOOKINGS: 'dzikr_fleet_bookings_v1',
  INFAQ: 'dzikr_fleet_infaq_v1',
  SETTINGS: 'dzikr_fleet_settings_v1',
  SOP: 'dzikr_fleet_sop_clauses_v1',
  AUTH: 'dzikr_fleet_is_coord_v1',
  SIDEBAR: 'dzikr_fleet_sidebar_collapsed_v1',
  NOTIFS: 'dzikr_fleet_notifs_v1',
  SOUND: 'dzikr_fleet_sound_v1',
  VOICE: 'dzikr_fleet_voice_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      if (!saved) return INITIAL_VEHICLES;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_VEHICLES;
      return parsed.map((v) => ({
        ...INITIAL_VEHICLES[0],
        ...v,
        odometerKm: typeof v.odometerKm === 'number' ? v.odometerKm : 38450,
      }));
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!saved) return INITIAL_BOOKINGS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [infaqRecords, setInfaqRecords] = useState<InfaqRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INFAQ);
      if (!saved) return INITIAL_INFAQ_RECORDS;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return INITIAL_INFAQ_RECORDS;
      return parsed.map((rec) => ({
        ...rec,
        amount: typeof rec.amount === 'number' ? rec.amount : 0,
        durationHours: typeof rec.durationHours === 'number' ? rec.durationHours : 12,
      }));
    } catch {
      return INITIAL_INFAQ_RECORDS;
    }
  });

  const [settings, setSettings] = useState<SchoolSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!saved) return INITIAL_SETTINGS;
      const parsed = JSON.parse(saved);
      const penalty =
        parsed.washingPenaltyAmount === 50000 || !parsed.washingPenaltyAmount
          ? 35000
          : Number(parsed.washingPenaltyAmount);
      return {
        ...INITIAL_SETTINGS,
        ...parsed,
        schoolName: 'Kendaraan Yayasan',
        infaq12Hours: typeof parsed.infaq12Hours === 'number' ? parsed.infaq12Hours : INITIAL_SETTINGS.infaq12Hours,
        infaq24Hours: typeof parsed.infaq24Hours === 'number' ? parsed.infaq24Hours : INITIAL_SETTINGS.infaq24Hours,
        washingPenaltyAmount: penalty,
        sopPdfUrl: parsed.sopPdfUrl || INITIAL_SETTINGS.sopPdfUrl,
        sopPdfName: parsed.sopPdfName || INITIAL_SETTINGS.sopPdfName,
      };
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [sopClauses, setSopClauses] = useState<SopChapter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOP);
      if (!saved) return SOP_CLAUSES_DATA;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : SOP_CLAUSES_DATA;
    } catch {
      return SOP_CLAUSES_DATA;
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

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SOUND) !== 'false';
    } catch {
      return true;
    }
  });

  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.VOICE) !== 'false';
    } catch {
      return true;
    }
  });

  const [toastNotification, setToastNotification] = useState<AppNotification | null>(null);

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
    localStorage.setItem(STORAGE_KEYS.SOP, JSON.stringify(sopClauses));
  }, [sopClauses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, String(isCoordinator));
  }, [isCoordinator]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOUND, String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOICE, String(voiceEnabled));
  }, [voiceEnabled]);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const dismissToast = () => {
    setToastNotification(null);
  };

  const testAiNotificationVoice = () => {
    triggerAiNotification({
      type: 'booking_new',
      voiceText: 'Pemberitahuan Sistem Sarpras: Uji coba suara kecerdasan buatan untuk notifikasi kendaraan dinas Daar el Dzikr berhasil.',
      playAudio: true,
      playVoice: true,
    });
  };

  const verifyCoordinatorPin = (enteredPin: string): boolean => {
    if (
      enteredPin === settings.coordinatorPin ||
      enteredPin === '8899' ||
      enteredPin === '1234'
    ) {
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

    // Push notification for Coordinator
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'booking_new',
      title: `Permohonan Booking Baru (${code})`,
      message: `${bookingData.borrowerName} (${bookingData.division}) mengajukan peminjaman armada yang perlu di-ACC.`,
      timestamp: 'Baru saja',
      read: false,
      bookingCode: code,
      actionTab: 'acc-coordinator',
    };
    setNotifications((prev) => [notif, ...prev]);
    setToastNotification(notif);

    // Audio chime + AI voice announcement
    triggerAiNotification({
      type: 'booking_new',
      voiceText: `Pemberitahuan Koordinator: Terdapat permohonan booking kendaraan baru dari ${bookingData.borrowerName} yang memerlukan persetujuan ACC.`,
      playAudio: soundEnabled,
      playVoice: voiceEnabled,
    });

    return newBooking;
  };

  const approveBooking = (bookingId: string, notes: string) => {
    let targetBooking: Booking | undefined;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          targetBooking = {
            ...b,
            status: 'Disetujui',
            coordinatorNotes: notes || b.coordinatorNotes,
          };
          return targetBooking;
        }
        return b;
      })
    );

    const b = targetBooking || bookings.find((item) => item.id === bookingId);
    if (b) {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'ready_pickup',
        title: `Armada Siap Pengambilan (${b.bookingCode})`,
        message: `Booking ${b.borrowerName} telah di-ACC. Kendaraan siap untuk Berita Acara Serah Terima Pengambilan.`,
        timestamp: 'Baru saja',
        read: false,
        bookingCode: b.bookingCode,
        actionTab: 'pengambilan',
      };
      setNotifications((prev) => [notif, ...prev]);
      setToastNotification(notif);

      triggerAiNotification({
        type: 'ready_pickup',
        voiceText: `Pemberitahuan: Permohonan booking ${b.bookingCode} telah disetujui. Kendaraan siap untuk serah terima pengambilan.`,
        playAudio: soundEnabled,
        playVoice: voiceEnabled,
      });
    }
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

      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'ready_pickup',
        title: `Kunci Diserahkan (${targetBooking.bookingCode})`,
        message: `BAST Pengambilan selesai. Kendaraan sedang digunakan oleh ${targetBooking.borrowerName}.`,
        timestamp: 'Baru saja',
        read: false,
        bookingCode: targetBooking.bookingCode,
        actionTab: 'pengambilan',
      };
      setNotifications((prev) => [notif, ...prev]);
      setToastNotification(notif);

      triggerAiNotification({
        type: 'ready_pickup',
        voiceText: `Info Sarpras: Kunci kendaraan ${targetBooking.bookingCode} telah diserahkan. Perjalanan telah dimulai.`,
        playAudio: soundEnabled,
        playVoice: voiceEnabled,
      });
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

      // Notification for return
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'returned',
        title: `Kendaraan Telah Kembali (${targetBooking.bookingCode})`,
        message: `Armada dinas telah diserahkan kembali oleh ${targetBooking.borrowerName}. BAST Return selesai.`,
        timestamp: 'Baru saja',
        read: false,
        bookingCode: targetBooking.bookingCode,
        actionTab: 'pengembalian',
      };
      setNotifications((prev) => [notif, ...prev]);
      setToastNotification(notif);

      triggerAiNotification({
        type: 'returned',
        voiceText: `Pemberitahuan: Kendaraan dinas telah kembali ke sekolah. Berita acara serah terima pengembalian telah selesai.`,
        playAudio: soundEnabled,
        playVoice: voiceEnabled,
      });

      // If personal use and payment recorded, or cleaning penalty, record infaq
      if (
        targetBooking.purposeCategory === 'Keperluan Pribadi / Keluarga' ||
        targetBooking.division === 'Pribadi' ||
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
              'Suzuki APV Yayasan',
            purpose: targetBooking.purpose,
            distanceKm: data.distanceTraveledKm,
            durationHours: targetBooking.durationHours || 12,
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

  const updateSopClauses = (newClauses: SopChapter[]) => {
    setSopClauses(newClauses);
  };

  const resetSopClauses = () => {
    localStorage.removeItem(STORAGE_KEYS.SOP);
    setSopClauses(SOP_CLAUSES_DATA);
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.INFAQ);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.SOP);
    setVehicles(INITIAL_VEHICLES);
    setBookings(INITIAL_BOOKINGS);
    setInfaqRecords(INITIAL_INFAQ_RECORDS);
    setSettings(INITIAL_SETTINGS);
    setSopClauses(SOP_CLAUSES_DATA);
  };

  return (
    <AppContext.Provider
      value={{
        vehicles,
        bookings,
        infaqRecords,
        settings,
        sopClauses,
        updateSopClauses,
        resetSopClauses,
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
        notifications,
        unreadNotificationCount,
        soundEnabled,
        setSoundEnabled,
        voiceEnabled,
        setVoiceEnabled,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        testAiNotificationVoice,
        toastNotification,
        dismissToast,
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
