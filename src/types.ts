/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VehicleStatus = 'Tersedia' | 'Digunakan' | 'Dalam Servis' | 'Dibooking';
export type FuelType = 'Solar / Dexlite' | 'Pertalite / Pertamax' | 'Listrik / EV';
export type VehicleType = 'Bus / Minibus Sekolah' | 'Mobil Dinas MPV / SUV' | 'Mobil Operasional Box' | 'Sepeda Motor Patroli';

export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  type: VehicleType;
  capacity: number;
  fuelType: FuelType;
  odometerKm: number;
  status: VehicleStatus;
  imageUrl: string;
  lastServiceDate: string;
  nextServiceKm: number;
  assignedDriver?: string;
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
  | 'Kedinasan Sekolah'
  | 'Kegiatan Yayasan'
  | 'Antar Jemput Santri / Lomba'
  | 'Perorangan / Pribadi Guru';

export interface HandoverIn {
  id: string;
  bookingId: string;
  date: string;
  time: string;
  odometerKm: number;
  fuelLevel: '1/4' | '1/2' | '3/4' | 'Full';
  interiorClean: boolean;
  exteriorClean: boolean;
  tiresCondition: boolean;
  lightsAndHorn: boolean;
  brakesAndEngine: boolean;
  acWorking: boolean;
  toolsAndSpareTire: boolean;
  stnkAndKeys: boolean;
  initialDefectsNotes: string;
  inspectorName: string;
  borrowerSignatureName: string;
}

export interface HandoverReturn {
  id: string;
  bookingId: string;
  date: string;
  time: string;
  odometerKm: number;
  fuelLevel: '1/4' | '1/2' | '3/4' | 'Full';
  interiorClean: boolean;
  exteriorClean: boolean;
  isWashed: boolean;
  newDefectsNotes: string;
  inspectorName: string;
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
  borrowerRole: 'Guru' | 'Staf' | 'Pimpinan Yayasan' | 'Santri / Panitia';
  division: 'SD Daar el Dzikr' | 'SMP Daar el Dzikr' | 'SMA Daar el Dzikr' | 'Pondok Pesantren' | 'Yayasan Daar el Dzikr';
  phone: string;
  destination: string;
  purpose: string;
  purposeCategory: PurposeCategory;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  passengerCount: number;
  driverType: 'Sopir Sekolah' | 'Bawa Sendiri (SIM A/B1 Sah)';
  driverName?: string;
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
  durationDays: number;
  amount: number;
  paymentMethod: 'Tunai di Kasir Sarpras' | 'Transfer Bank Syariah Indonesia (BSI)';
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
  defaultInfaqPerDay: number;
  defaultInfaqPerKm: number;
  washingPenaltyAmount: number;
}
