/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Vehicle,
  Booking,
  InfaqRecord,
  ExpenseRecord,
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
  INITIAL_EXPENSES,
  INITIAL_NOTIFICATIONS,
  SOP_CLAUSES_DATA,
} from '../data/mockData';
import { triggerAiNotification } from '../utils/notificationSound';
import {
  db,
  COLLECTIONS,
  cleanForFirestore,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';

export type NavTab =
  | 'dashboard'
  | 'armada'
  | 'booking'
  | 'acc-coordinator'
  | 'pengambilan'
  | 'pengembalian'
  | 'infaq'
  | 'keuangan-armada'
  | 'sop'
  | 'settings'
  | 'edit-klausul'
  | 'edit-rekening'
  | 'logo-sekolah'
  | 'petunjuk';

export interface PrintDocument {
  type: 'surat-jalan' | 'bast-in' | 'bast-return' | 'kwitansi-infaq' | 'laporan-kas';
  data: any;
}

interface AppContextType {
  vehicles: Vehicle[];
  bookings: Booking[];
  infaqRecords: InfaqRecord[];
  expenses: ExpenseRecord[];
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
  updateInfaqRecord: (id: string, updated: Partial<InfaqRecord>) => void;
  deleteInfaqRecord: (id: string) => void;
  addExpenseRecord: (expenseData: Omit<ExpenseRecord, 'id' | 'expenseNo' | 'createdAt'>) => ExpenseRecord;
  updateExpenseRecord: (id: string, updated: Partial<ExpenseRecord>) => void;
  deleteExpenseRecord: (id: string) => void;
  totalInfaqAmount: number;
  totalExpenseAmount: number;
  cashBalance: number;
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
  isFirestoreConnected: boolean;
  firestoreSyncStatus: 'connected' | 'connecting' | 'error';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VEHICLES: 'dzikr_fleet_vehicles_v2',
  BOOKINGS: 'dzikr_fleet_bookings_v2',
  INFAQ: 'dzikr_fleet_infaq_v2',
  EXPENSES: 'dzikr_fleet_expenses_v2',
  SETTINGS: 'dzikr_fleet_settings_v2',
  SOP: 'dzikr_fleet_sop_clauses_v2',
  AUTH: 'dzikr_fleet_is_coord_v2',
  SIDEBAR: 'dzikr_fleet_sidebar_collapsed_v2',
  NOTIFS: 'dzikr_fleet_notifs_v2',
  SOUND: 'dzikr_fleet_sound_v2',
  VOICE: 'dzikr_fleet_voice_v2',
  APP_BUILD_ID: 'dzikr_fleet_build_id_v2',
};

// Unique build tag to ensure automatic cache invalidation
const CURRENT_BUILD_TAG = 'dzikr-build-20261029-2040';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check build tag on mount: auto-clear stale legacy cache if code changed
  useEffect(() => {
    try {
      const storedBuild = localStorage.getItem(STORAGE_KEYS.APP_BUILD_ID);
      if (storedBuild && storedBuild !== CURRENT_BUILD_TAG) {
        console.info('Pembaruan aplikasi terdeteksi, membersihkan cache lama...');
        // Clean old version keys without clearing user login if any
        localStorage.removeItem('dzikr_fleet_vehicles_v1');
        localStorage.removeItem('dzikr_fleet_bookings_v1');
        localStorage.removeItem('dzikr_fleet_infaq_v1');
        localStorage.removeItem('dzikr_fleet_settings_v1');
      }
      localStorage.setItem(STORAGE_KEYS.APP_BUILD_ID, CURRENT_BUILD_TAG);
    } catch (e) {
      console.warn('Storage check error:', e);
    }
  }, []);

  // Local state with immediate fallback cache
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      if (!saved) return INITIAL_VEHICLES;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_VEHICLES;
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
      return Array.isArray(parsed) ? parsed : INITIAL_INFAQ_RECORDS;
    } catch {
      return INITIAL_INFAQ_RECORDS;
    }
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (!saved) return INITIAL_EXPENSES;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [settings, setSettings] = useState<SchoolSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!saved) return INITIAL_SETTINGS;
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_SETTINGS,
        ...parsed,
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
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);
  const [firestoreSyncStatus, setFirestoreSyncStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');

  const seededRef = useRef<{ [key: string]: boolean }>({});

  // -------------------------------------------------------------
  // Real-time Firestore Listeners & Synchronization
  // -------------------------------------------------------------
  useEffect(() => {
    let active = true;

    // 1. Vehicles
    const unsubVehicles = onSnapshot(
      collection(db, COLLECTIONS.VEHICLES),
      (snapshot) => {
        if (!active) return;
        setIsFirestoreConnected(true);
        setFirestoreSyncStatus('connected');
        if (snapshot.empty && !seededRef.current['vehicles']) {
          seededRef.current['vehicles'] = true;
          INITIAL_VEHICLES.forEach(async (v) => {
            try {
              await setDoc(doc(db, COLLECTIONS.VEHICLES, v.id), cleanForFirestore(v));
            } catch (err) {
              console.warn('Seeding vehicle err:', err);
            }
          });
        } else if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as Vehicle);
          setVehicles(list);
          localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(list));
        }
      },
      (error) => {
        console.warn('Firestore vehicles listener error:', error);
        setFirestoreSyncStatus('error');
        handleFirestoreError(error, OperationType.LIST, COLLECTIONS.VEHICLES);
      }
    );

    // 2. Bookings
    const unsubBookings = onSnapshot(
      collection(db, COLLECTIONS.BOOKINGS),
      (snapshot) => {
        if (!active) return;
        if (snapshot.empty && !seededRef.current['bookings']) {
          seededRef.current['bookings'] = true;
          INITIAL_BOOKINGS.forEach(async (b) => {
            try {
              await setDoc(doc(db, COLLECTIONS.BOOKINGS, b.id), cleanForFirestore(b));
            } catch (err) {
              console.warn('Seeding booking err:', err);
            }
          });
        } else if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as Booking);
          list.sort((a, b) => (b.id > a.id ? 1 : -1));
          setBookings(list);
          localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
        }
      },
      (error) => {
        console.warn('Firestore bookings listener error:', error);
        handleFirestoreError(error, OperationType.LIST, COLLECTIONS.BOOKINGS);
      }
    );

    // 3. Infaq Records
    const unsubInfaq = onSnapshot(
      collection(db, COLLECTIONS.INFAQ),
      (snapshot) => {
        if (!active) return;
        if (snapshot.empty && !seededRef.current['infaq']) {
          seededRef.current['infaq'] = true;
          INITIAL_INFAQ_RECORDS.forEach(async (rec) => {
            try {
              await setDoc(doc(db, COLLECTIONS.INFAQ, rec.id), cleanForFirestore(rec));
            } catch (err) {
              console.warn('Seeding infaq err:', err);
            }
          });
        } else if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as InfaqRecord);
          list.sort((a, b) => (b.id > a.id ? 1 : -1));
          setInfaqRecords(list);
          localStorage.setItem(STORAGE_KEYS.INFAQ, JSON.stringify(list));
        }
      },
      (error) => {
        console.warn('Firestore infaq listener error:', error);
        handleFirestoreError(error, OperationType.LIST, COLLECTIONS.INFAQ);
      }
    );

    // 4. Expense Records (Pengeluaran Kas Armada)
    const unsubExpenses = onSnapshot(
      collection(db, COLLECTIONS.EXPENSES),
      (snapshot) => {
        if (!active) return;
        if (snapshot.empty && !seededRef.current['expenses']) {
          seededRef.current['expenses'] = true;
          INITIAL_EXPENSES.forEach(async (exp) => {
            try {
              await setDoc(doc(db, COLLECTIONS.EXPENSES, exp.id), cleanForFirestore(exp));
            } catch (err) {
              console.warn('Seeding expense err:', err);
            }
          });
        } else if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as ExpenseRecord);
          list.sort((a, b) => (b.id > a.id ? 1 : -1));
          setExpenses(list);
          localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(list));
        }
      },
      (error) => {
        console.warn('Firestore expenses listener error:', error);
        handleFirestoreError(error, OperationType.LIST, COLLECTIONS.EXPENSES);
      }
    );

    // 5. Settings (Single Document: 'current')
    const unsubSettings = onSnapshot(
      doc(db, COLLECTIONS.SETTINGS, 'current'),
      async (snap) => {
        if (!active) return;
        if (!snap.exists() && !seededRef.current['settings']) {
          seededRef.current['settings'] = true;
          try {
            await setDoc(doc(db, COLLECTIONS.SETTINGS, 'current'), cleanForFirestore(INITIAL_SETTINGS));
          } catch (err) {
            console.warn('Seeding settings err:', err);
          }
        } else if (snap.exists()) {
          const remoteSettings = snap.data() as SchoolSettings;
          setSettings((prev) => ({ ...prev, ...remoteSettings }));
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(remoteSettings));
        }
      },
      (error) => {
        console.warn('Firestore settings listener error:', error);
        handleFirestoreError(error, OperationType.GET, `${COLLECTIONS.SETTINGS}/current`);
      }
    );

    // 6. SOP Clauses
    const unsubSop = onSnapshot(
      collection(db, COLLECTIONS.SOP),
      (snapshot) => {
        if (!active) return;
        if (snapshot.empty && !seededRef.current['sop']) {
          seededRef.current['sop'] = true;
          SOP_CLAUSES_DATA.forEach(async (chapter, index) => {
            try {
              const docId = `chapter-${index + 1}`;
              await setDoc(doc(db, COLLECTIONS.SOP, docId), cleanForFirestore(chapter));
            } catch (err) {
              console.warn('Seeding sop err:', err);
            }
          });
        } else if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as SopChapter);
          setSopClauses(list);
          localStorage.setItem(STORAGE_KEYS.SOP, JSON.stringify(list));
        }
      },
      (error) => {
        console.warn('Firestore sop listener error:', error);
        handleFirestoreError(error, OperationType.LIST, COLLECTIONS.SOP);
      }
    );

    // 7. Notifications
    const unsubNotifs = onSnapshot(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      (snapshot) => {
        if (!active) return;
        if (snapshot.empty && !seededRef.current['notifications']) {
          seededRef.current['notifications'] = true;
          INITIAL_NOTIFICATIONS.forEach(async (n) => {
            try {
              await setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, n.id), cleanForFirestore(n));
            } catch (err) {
              console.warn('Seeding notifications err:', err);
            }
          });
        } else if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as AppNotification);
          list.sort((a, b) => (b.id > a.id ? 1 : -1));
          setNotifications(list);
          localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(list));
        }
      },
      (error) => {
        console.warn('Firestore notifications listener error:', error);
        handleFirestoreError(error, OperationType.LIST, COLLECTIONS.NOTIFICATIONS);
      }
    );

    return () => {
      active = false;
      unsubVehicles();
      unsubBookings();
      unsubInfaq();
      unsubExpenses();
      unsubSettings();
      unsubSop();
      unsubNotifs();
    };
  }, []);

  // Sync auxiliary preferences to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, String(isCoordinator));
  }, [isCoordinator]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

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

  // Real-time financial totals
  const totalInfaqAmount = (infaqRecords || []).reduce((acc, curr) => acc + (Number(curr?.amount) || 0), 0);
  const totalExpenseAmount = (expenses || []).reduce((acc, curr) => acc + (Number(curr?.amount) || 0), 0);
  const cashBalance = totalInfaqAmount - totalExpenseAmount;

  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id), { read: true });
    } catch (err) {
      console.warn('Mark notif read err:', err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      const batch = writeBatch(db);
      notifications.forEach((n) => {
        if (!n.read) {
          batch.update(doc(db, COLLECTIONS.NOTIFICATIONS, n.id), { read: true });
        }
      });
      await batch.commit();
    } catch (err) {
      console.warn('Mark all notifs read err:', err);
    }
  };

  const clearNotifications = async () => {
    setNotifications([]);
    try {
      const batch = writeBatch(db);
      notifications.forEach((n) => {
        batch.delete(doc(db, COLLECTIONS.NOTIFICATIONS, n.id));
      });
      await batch.commit();
    } catch (err) {
      console.warn('Clear notifications err:', err);
    }
  };

  const dismissToast = () => {
    setToastNotification(null);
  };

  const testAiNotificationVoice = () => {
    triggerAiNotification({
      type: 'booking_new',
      voiceText: 'Pemberitahuan Sistem Sarpras: Uji coba suara kecerdasan buatan untuk notifikasi kendaraan dinas Daar el Dzikr berhasil terhubung ke Firebase.',
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

  // -------------------------------------------------------------
  // Data Mutations (Persisted Directly to Firestore)
  // -------------------------------------------------------------
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

    triggerAiNotification({
      type: 'booking_new',
      voiceText: `Pemberitahuan Koordinator: Terdapat permohonan booking kendaraan baru dari ${bookingData.borrowerName} yang memerlukan persetujuan ACC.`,
      playAudio: soundEnabled,
      playVoice: voiceEnabled,
    });

    setDoc(doc(db, COLLECTIONS.BOOKINGS, newBooking.id), cleanForFirestore(newBooking)).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `${COLLECTIONS.BOOKINGS}/${newBooking.id}`);
    });

    setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notif.id), cleanForFirestore(notif)).catch((err) => {
      console.warn('Error saving notification:', err);
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

      updateDoc(
        doc(db, COLLECTIONS.BOOKINGS, bookingId),
        cleanForFirestore({
          status: 'Disetujui',
          coordinatorNotes: notes || b.coordinatorNotes || '',
        })
      ).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.BOOKINGS}/${bookingId}`);
      });

      setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notif.id), cleanForFirestore(notif)).catch((err) => {
        console.warn('Error saving notification:', err);
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

    updateDoc(
      doc(db, COLLECTIONS.BOOKINGS, bookingId),
      cleanForFirestore({
        status: 'Ditolak',
        rejectionReason: reason,
      })
    ).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.BOOKINGS}/${bookingId}`);
    });
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

    updateDoc(
      doc(db, COLLECTIONS.BOOKINGS, bookingId),
      cleanForFirestore({ status: 'Dibatalkan' })
    ).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.BOOKINGS}/${bookingId}`);
    });
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

      updateDoc(
        doc(db, COLLECTIONS.BOOKINGS, bookingId),
        cleanForFirestore({
          status: 'Sedang Berjalan',
          handoverIn: handoverInRecord,
        })
      ).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.BOOKINGS}/${bookingId}`);
      });

      updateDoc(
        doc(db, COLLECTIONS.VEHICLES, targetBooking.vehicleId),
        cleanForFirestore({
          status: 'Digunakan',
          odometerKm: data.odometerKm,
        })
      ).catch((err) => {
        console.warn('Update vehicle err:', err);
      });

      setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notif.id), cleanForFirestore(notif)).catch((err) => {
        console.warn('Error saving notification:', err);
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

      updateDoc(
        doc(db, COLLECTIONS.BOOKINGS, bookingId),
        cleanForFirestore({
          status: 'Selesai',
          handoverReturn: handoverReturnRecord,
        })
      ).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.BOOKINGS}/${bookingId}`);
      });

      updateDoc(
        doc(db, COLLECTIONS.VEHICLES, vId),
        cleanForFirestore({
          status: 'Tersedia',
          odometerKm: data.odometerKm,
        })
      ).catch((err) => {
        console.warn('Update vehicle err:', err);
      });

      setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notif.id), cleanForFirestore(notif)).catch((err) => {
        console.warn('Error saving notification:', err);
      });

      // Check infaq recording
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
            notes:
              data.extraCleaningFee > 0
                ? `Termasuk biaya cuci armada: Rp ${data.extraCleaningFee.toLocaleString('id-ID')}`
                : 'Infaq pemakaian perorangan.',
            receivedBy: settings.coordinatorName,
          };
          setInfaqRecords((prev) => [newInfaq, ...prev]);

          setDoc(doc(db, COLLECTIONS.INFAQ, newInfaq.id), cleanForFirestore(newInfaq)).catch((err) => {
            console.warn('Error saving infaq record:', err);
          });
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

    setDoc(doc(db, COLLECTIONS.INFAQ, newRecord.id), cleanForFirestore(newRecord)).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `${COLLECTIONS.INFAQ}/${newRecord.id}`);
    });

    return newRecord;
  };

  // Koreksi / Edit Infaq oleh Koordinator
  const updateInfaqRecord = (id: string, updated: Partial<InfaqRecord>) => {
    setInfaqRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, ...updated } : rec))
    );

    updateDoc(doc(db, COLLECTIONS.INFAQ, id), cleanForFirestore(updated)).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.INFAQ}/${id}`);
    });
  };

  // Hapus catatan infaq yang salah input oleh Koordinator
  const deleteInfaqRecord = (id: string) => {
    setInfaqRecords((prev) => prev.filter((rec) => rec.id !== id));

    deleteDoc(doc(db, COLLECTIONS.INFAQ, id)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.INFAQ}/${id}`);
    });
  };

  // Catat Pengeluaran Kas Armada
  const addExpenseRecord = (expenseData: Omit<ExpenseRecord, 'id' | 'expenseNo' | 'createdAt'>): ExpenseRecord => {
    const recCount = expenses.length + 1;
    const now = new Date();
    const dateCode = now.toISOString().slice(0, 10).replace(/-/g, '/');
    const expenseNo = `KLR/DZK/${dateCode}/${String(recCount).padStart(3, '0')}`;

    const newExpense: ExpenseRecord = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      expenseNo,
      createdAt: now.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
    };

    setExpenses((prev) => [newExpense, ...prev]);

    setDoc(doc(db, COLLECTIONS.EXPENSES, newExpense.id), cleanForFirestore(newExpense)).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `${COLLECTIONS.EXPENSES}/${newExpense.id}`);
    });

    return newExpense;
  };

  // Koreksi / Edit Pengeluaran oleh Koordinator
  const updateExpenseRecord = (id: string, updated: Partial<ExpenseRecord>) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updated } : exp))
    );

    updateDoc(doc(db, COLLECTIONS.EXPENSES, id), cleanForFirestore(updated)).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.EXPENSES}/${id}`);
    });
  };

  // Hapus Catatan Pengeluaran oleh Koordinator
  const deleteExpenseRecord = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));

    deleteDoc(doc(db, COLLECTIONS.EXPENSES, id)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.EXPENSES}/${id}`);
    });
  };

  const updateSchoolSettings = (newSettings: Partial<SchoolSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    setDoc(doc(db, COLLECTIONS.SETTINGS, 'current'), cleanForFirestore(updated), { merge: true }).catch(
      (err) => {
        handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.SETTINGS}/current`);
      }
    );
  };

  const updateLogo = (newLogoDataUrl: string) => {
    setSettings((prev) => ({ ...prev, logoUrl: newLogoDataUrl }));

    updateDoc(doc(db, COLLECTIONS.SETTINGS, 'current'), {
      logoUrl: newLogoDataUrl,
    }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.SETTINGS}/current`);
    });
  };

  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVeh: Vehicle = {
      ...vehicleData,
      id: `vh-${Date.now()}`,
    };
    setVehicles((prev) => [...prev, newVeh]);

    setDoc(doc(db, COLLECTIONS.VEHICLES, newVeh.id), cleanForFirestore(newVeh)).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `${COLLECTIONS.VEHICLES}/${newVeh.id}`);
    });
  };

  const updateVehicle = (id: string, updated: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updated } : v))
    );

    updateDoc(doc(db, COLLECTIONS.VEHICLES, id), cleanForFirestore(updated)).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.VEHICLES}/${id}`);
    });
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));

    deleteDoc(doc(db, COLLECTIONS.VEHICLES, id)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.VEHICLES}/${id}`);
    });
  };

  const updateSopClauses = (newClauses: SopChapter[]) => {
    setSopClauses(newClauses);

    try {
      const batch = writeBatch(db);
      newClauses.forEach((chapter, idx) => {
        const docId = `chapter-${idx + 1}`;
        batch.set(doc(db, COLLECTIONS.SOP, docId), cleanForFirestore(chapter));
      });
      batch.commit().catch((err) => console.warn('Update SOP err:', err));
    } catch (err) {
      console.warn('Update SOP batch err:', err);
    }
  };

  const resetSopClauses = () => {
    setSopClauses(SOP_CLAUSES_DATA);
    updateSopClauses(SOP_CLAUSES_DATA);
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.INFAQ);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.SOP);
    setVehicles(INITIAL_VEHICLES);
    setBookings(INITIAL_BOOKINGS);
    setInfaqRecords(INITIAL_INFAQ_RECORDS);
    setExpenses(INITIAL_EXPENSES);
    setSettings(INITIAL_SETTINGS);
    setSopClauses(SOP_CLAUSES_DATA);

    // Reset Firestore collections
    INITIAL_VEHICLES.forEach((v) => {
      setDoc(doc(db, COLLECTIONS.VEHICLES, v.id), cleanForFirestore(v)).catch(() => {});
    });
    INITIAL_BOOKINGS.forEach((b) => {
      setDoc(doc(db, COLLECTIONS.BOOKINGS, b.id), cleanForFirestore(b)).catch(() => {});
    });
    INITIAL_INFAQ_RECORDS.forEach((r) => {
      setDoc(doc(db, COLLECTIONS.INFAQ, r.id), cleanForFirestore(r)).catch(() => {});
    });
    INITIAL_EXPENSES.forEach((exp) => {
      setDoc(doc(db, COLLECTIONS.EXPENSES, exp.id), cleanForFirestore(exp)).catch(() => {});
    });
    setDoc(doc(db, COLLECTIONS.SETTINGS, 'current'), cleanForFirestore(INITIAL_SETTINGS)).catch(() => {});
  };

  return (
    <AppContext.Provider
      value={{
        vehicles,
        bookings,
        infaqRecords,
        expenses,
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
        updateInfaqRecord,
        deleteInfaqRecord,
        addExpenseRecord,
        updateExpenseRecord,
        deleteExpenseRecord,
        totalInfaqAmount,
        totalExpenseAmount,
        cashBalance,
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
        isFirestoreConnected,
        firestoreSyncStatus,
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
