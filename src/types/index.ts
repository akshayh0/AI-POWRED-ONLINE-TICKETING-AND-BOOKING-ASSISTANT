export interface MatchFixture {
  id: string;
  tournament: string;
  matchNumber: string;
  teams: {
    home: string;
    away: string;
    kannadaTitle: string;
  };
  date: {
    dayNumber: string;
    month: string;
    dayOfWeek: string;
    time: string;
  };
  venue: {
    stadium: string;
    city: string;
    gateInfo: string;
  };
  telemetry: {
    demandLevel: 'HIGH DEMAND' | 'MODERATE' | 'OPEN';
    bookedPercent: number;
    seatsRemaining: number;
    tatkalReserveStatus: string;
  };
  pricing: {
    tierName: string;
    startingPrice: number;
    includesGST: boolean;
    entryGate: string;
  };
  isDemo: boolean;
}

export interface RegionalExperience {
  id: string;
  badge: string;
  badgeType: 'secondary' | 'tertiary';
  title: string;
  location: string;
  timing: string;
  description: string;
  price: number;
  perPersonLabel: string;
  image: string;
  features: string[];
  ctaText: string;
  isDemo: boolean;
}

export interface CorridorDestination {
  id: string;
  name: string;
  kannadaName: string;
  code: string;
  stationSubtitle: string;
  badgeText: string;
  badgeColor: string;
  verticalLabel: string;
  image: string;
  liveConnections: string;
  isDemo: boolean;
}

export interface MultiLegBundle {
  id: string;
  packageName: string;
  packageSubtitle: string;
  badgeText: string;
  transport: {
    serviceName: string;
    timing: string;
    pricePerPerson: number;
  };
  stay: {
    hotelName: string;
    proximity: string;
    pricePerNight: number;
  };
  match: {
    standName: string;
    gateAccess: string;
    pricePerTicket: number;
  };
  totalPriceForTwo: number;
  isDemo: boolean;
}

export interface CalendarEvent {
  id: string;
  dayNumber: string;
  month: string;
  badgeText: string;
  seriesCode: string;
  title: string;
  venueAndTransit: string;
  startingPrice: number;
  fareLabel: string;
  isDemo: boolean;
}

