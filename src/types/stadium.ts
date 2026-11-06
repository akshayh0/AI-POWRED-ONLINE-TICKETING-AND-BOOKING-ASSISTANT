export interface BlockData {
  i: number;
  code: string;
  t: number; // 0 = lower tier, 1 = upper tier
  a0: number;
  a1: number;
  price: number;
  seats: number[][]; // 10 rows, where row r has 12 + r seats. 0=available, 1=sold, 2=held
  base: number;
}

export interface SeatItem {
  b: BlockData;
  r: number; // 0-based row index (0 to 9)
  k: number; // 0-based seat index
  p: { x: number; y: number; z: number };
  yaw: number;
}

export interface SelectedSeat {
  i: number; // global seat index in S array
  b: BlockData;
  r: number;
  k: number;
  price: number;
}

export interface BookingConfirmation {
  ref: string;
  items: SelectedSeat[];
  money: {
    sub: number;
    fee: number;
    gst: number;
    tot: number;
  };
  timestamp: string;
}

export type ViewStandName = 'Overview' | 'North' | 'East' | 'South' | 'West';

// Legacy compatibility types for previous experimental components
export type CameraMode = 'overview' | 'stand' | 'firstPerson' | 'pitch';

export type StandSector = 'all' | 'east' | 'pavilion' | 'budget';

export interface SeatData {
  id: string;
  stand: 'East Stand' | 'North Pavilion' | 'South Stand' | 'West Stand';
  standKn: string;
  block: string;
  row: number;
  seatNumber: number;
  tier: 'Lower Tier' | 'Upper Tier' | 'Terrace';
  price: number;
  status: 'available' | 'sold' | 'selected';
  position: [number, number, number];
  viewAngle: string;
  sightlineQuality: string;
  gate: string;
  metroDistance: string;
  canopyShade: boolean;
}

export interface StadiumState {
  cameraMode: CameraMode;
  selectedSector: StandSector;
  selectedSeatIds: string[];
  hoveredSeatId: string | null;
  performanceMode: 'high' | 'balanced' | 'low';
}
