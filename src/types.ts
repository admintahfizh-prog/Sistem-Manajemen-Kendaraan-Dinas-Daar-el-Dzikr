/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VehicleStatus = 'Tersedia' | 'Digunakan' | 'Dalam Servis' | 'Dibooking';
export type FuelType = 'Pertalite / Pertamax' | 'Solar / Dexlite';
export type VehicleType = 'Suzuki APV Yayasan';

export interface Vehicle {
  id: string;
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
  notes?: string;
}

export type BookingStatus =
  | 'Menunggu ACC'
  | 'Disetujui'
  | 'Ditolak'
  | 'Sedang Berjalan'
  | 'Selesai'
  | 'Dibatalkan';

export type PurposeCategory =
  | 'Kedinasan Yayasan'
  | 'Kegiatan Santri / Lembaga'
  | 'Keperluan Pribadi / Keluarga';

export type UnitKerja =
  | 'PAUD'
  | 'SD'
  | 'SMP'
  | 'MA'
  | 'Pesantren'
  | 'Yayasan'
  | 'Pribadi';

export type FuelStripLevel =
  | 'Strip 1 (E / Rendah)'
  | 'Strip 2 (Sedang)'
  | 'Strip 3 (Full / Penuh)';

export interface HandoverIn {
  id: string;
  bookingId: string;
  date: string;
  time: string;
  odometerKm: number;
  fuelLevel: FuelStripLevel;
  interiorClean: boolean;
  exteriorClean: boolean;
  tiresCondition: boolean;
  lightsAndHorn: boolean;
  brakesAndEngine: boolean;
  acWorking: boolean;
  toolsAndSpareTire: boolean;
  stnkAndKeys: boolean;
  initialDefectsNotes: string;
  borrowerSignatureName: string;
}

export interface HandoverReturn {
  id: string;
  bookingId: string;
  date: string;
  time: string;
  odometerKm: number;
  fuelLevel: FuelStripLevel;
  interiorClean: boolean;
  exteriorClean: boolean;
  isWashed: boolean;
  carCoverClosed: boolean;
  newDefectsNotes: string;
  returneeSignatureName: string;
  lateMinutes: number;
  distanceTraveledKm: number;
  extraCleaningFee: number;
  settlementNotes: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  vehicleId: string;
  borrowerName: string;
  division: UnitKerja;
  phone: string;
  destination: string;
  purpose: string;
  purposeCategory: PurposeCategory;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  durationHours?: number;
  status: BookingStatus;
  coordinatorNotes?: string;
  rejectionReason?: string;
  estimatedInfaq?: number;
  createdAt: string;
  handoverIn?: HandoverIn;
  handoverReturn?: HandoverReturn;
}

export interface InfaqRecord {
  id: string;
  receiptNo: string;
  bookingId?: string;
  bookingCode?: string;
  date: string;
  contributorName: string;
  division: string;
  vehicleName: string;
  purpose: string;
  distanceKm: number;
  durationHours: number;
  amount: number;
  paymentMethod: 'Tunai di Kasir Sarpras' | 'Transfer Bank Yayasan';
  notes: string;
  receivedBy: string;
}

export interface SchoolSettings {
  schoolName: string;
  subTitle: string;
  foundationName: string;
  address: string;
  phone: string;
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorPin: string;
  logoUrl: string;
  sopPdfUrl?: string;
  sopPdfName?: string;
  infaq12Hours: number;
  infaq24Hours: number;
  washingPenaltyAmount: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  bankConfirmationPhone: string;
  bankNotes: string;
}

export type NotificationType =
  | 'booking_new'
  | 'ready_pickup'
  | 'returned'
  | 'booking_approved'
  | 'booking_rejected';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  bookingCode?: string;
  actionTab?: 'acc-coordinator' | 'pengambilan' | 'pengembalian' | 'booking' | 'infaq';
}

export interface SopPoint {
  no: string;
  title: string;
  content: string;
}

export interface SopChapter {
  chapter: string;
  title: string;
  points: SopPoint[];
}
