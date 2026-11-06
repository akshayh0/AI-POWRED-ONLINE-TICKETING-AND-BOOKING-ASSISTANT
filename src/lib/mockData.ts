import {
  MatchFixture,
  RegionalExperience,
  CorridorDestination,
  MultiLegBundle,
  CalendarEvent,
} from '@/types';

export const DEMO_NOTICE = {
  text: 'SIMULATED DEMO ENVIRONMENT • Karnataka Corridor Hackathon Prototype • No Real Transactions',
  disclaimer: 'All schedules, seat allocations, Tatkal telemetry, and ticket pricing are simulated mock data for demonstration purposes.',
};

export const MOCK_TRENDING_MATCHES: MatchFixture[] = [
  {
    id: 'rcb-csk-2025',
    tournament: 'IPL 2025 MATCH 24',
    matchNumber: 'MATCH 24',
    teams: {
      home: 'RCB',
      away: 'CSK',
      kannadaTitle: 'ಬೆಂಗಳೂರು ರಾಯಲ್ ಚಾಲೆಂಜರ್ಸ್ vs ಸಿಎಸ್ಕೆ',
    },
    date: {
      dayNumber: '28',
      month: 'OCT',
      dayOfWeek: 'SATURDAY',
      time: '19:30 IST',
    },
    venue: {
      stadium: 'M. Chinnaswamy Stadium',
      city: 'MG Road, Bengaluru',
      gateInfo: 'All stands accessible via Cubbon Park Metro Gate 2',
    },
    telemetry: {
      demandLevel: 'HIGH DEMAND',
      bookedPercent: 88,
      seatsRemaining: 420,
      tatkalReserveStatus: 'DYNAMIC TATKAL RESERVES ACTIVE',
    },
    pricing: {
      tierName: 'TIER 1 ENTRY',
      startingPrice: 1800,
      includesGST: true,
      entryGate: 'Entry Gate C',
    },
    isDemo: true,
  },
  {
    id: 'kar-mum-ranji',
    tournament: 'RANJI ELITE GROUP A',
    matchNumber: 'DAY 1 PASS',
    teams: {
      home: 'Karnataka',
      away: 'Mumbai',
      kannadaTitle: 'ಕರ್ನಾಟಕ ರಣಜಿ ಪಂದ್ಯಾವಳಿ',
    },
    date: {
      dayNumber: '03',
      month: 'NOV',
      dayOfWeek: 'FRIDAY',
      time: '09:30 IST',
    },
    venue: {
      stadium: 'Rajnagar Stadium, KSCA Hubballi',
      city: 'Hubballi',
      gateInfo: 'Special Vande Bharat feeder stop at UBL Junction',
    },
    telemetry: {
      demandLevel: 'OPEN',
      bookedPercent: 42,
      seatsRemaining: 1840,
      tatkalReserveStatus: 'DAY MEMBERSHIP PASSES AVAILABLE',
    },
    pricing: {
      tierName: 'GENERAL STAND',
      startingPrice: 350,
      includesGST: true,
      entryGate: 'All 4 Sessions Valid',
    },
    isDemo: true,
  },
];

export const MOCK_REGIONAL_EXPERIENCES: RegionalExperience[] = [
  {
    id: 'mysuru-dasara-torchlight',
    badge: 'HERITAGE FAST-TRACK',
    badgeType: 'secondary',
    title: 'Mysuru Dasara Torchlight Parade & Royal Passage',
    location: 'MYSURU PALACE PRECINCTS',
    timing: 'OCT 2025',
    description:
      'Reserved VIP enclosure access at Bannimantap Parade Grounds with integrated Shatabdi Express AC Chair Car return tickets from Bengaluru KSR. Special royal dinner pass included.',
    price: 4500,
    perPersonLabel: '/ PERSON',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLAPTH6orsvrvRz5wNx6r_T6ha3RSpP8BNDbteL9JaFKmIXVYuU5udootLMbB6ciJ8QOTYifxbbWR8br2e3EzGZogheXndWzltAyzPniyUa6PUpgdihjsOcylYIRADjT5h2DHv722F0J2UBbMXKiXnU_JpxQBy8xeBwJ7ShXch3KRuoizFPiIFyoK0Kouj5VhMhqT10Cn3UGN1NqJsGeaWQI_H0jdjk1U0KUzBo1k',
    features: ['Express Transit Included', 'Royal Gate A Access', 'Dinner Pass'],
    ctaText: 'View Itinerary',
    isDemo: true,
  },
  {
    id: 'kannada-indie-night',
    badge: 'LIVE MUSIC',
    badgeType: 'tertiary',
    title: 'Kannada Indie Night at Phoenix Marketcity',
    location: 'WHITEFIELD, BENGALURU',
    timing: 'WEEKEND PRIME',
    description:
      'Featuring Raghu Dixit Project and All OK live. Guaranteed reserved front-bay deck and Purple Line metro feeder coupon.',
    price: 899,
    perPersonLabel: '/ PASS',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZPEG81FbSZRAq7ND_KK3ZelrQRx0tvE8xUVZ1Elaa2I9rCll4zpi1vIYKQlE4LsM-vwZZmlFTW6rpLIW82gXLtNnx-wMO8SXnywqG9ca6bsSLF5-mfGUSRl1ljC60JQThSQzSbAgaVtRlp4x4NA1m_GW-YAW0UIKPQNzkxfkyFliYrBqhSNQZOizLKHbJHphQ5mNAylATizHuvlRQvel2rPm080qIWRuBlBiQQA0',
    features: ['Front-Bay Deck', 'Metro Coupon'],
    ctaText: 'Details →',
    isDemo: true,
  },
  {
    id: 'coffee-trail-sakleshpur',
    badge: 'WEEKEND TRAIL',
    badgeType: 'secondary',
    title: 'Coffee Trail Express: Sakleshpur via Yeshvantpur',
    location: 'WESTERN GHATS CORRIDOR',
    timing: '3 DAYS EXPEDITION',
    description:
      'Vistadome rail carriage through the Ghats tunnels. Includes plantation estate walking tour and estate cupping session.',
    price: 1450,
    perPersonLabel: '/ PERSON',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDDLAG8VSqanIT7AVPY4JBF2FuJDo3bC_eQIrrcq_rkABGSTBqPDVyhI1uiswR6kWTzOvP5n9tcwudxbyIvVgzmFOqxHO3d31n_vsXGi73V8OoP4kHhs7f9tfYVT-UVUt1DHN5W4fOkFwaXY4DFB8BcCvMhvsvW_csFv1swWRcwmg0hbcBht4ZVN1aMtKbHpuFAKohh8NC6frjilL5seVd0PFpZ6jvo9bRMtqtR4e4',
    features: ['Vistadome Coach', 'Estate Tour'],
    ctaText: 'Details →',
    isDemo: true,
  },
];

export const MOCK_CORRIDOR_DESTINATIONS: CorridorDestination[] = [
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    kannadaName: 'ಬೆಂಗಳೂರು',
    code: 'SBC / YPR / SMVB',
    stationSubtitle: '42 Live Connections',
    badgeText: 'HUB 01',
    badgeColor: 'text-tertiary bg-surface',
    verticalLabel: 'BENGALURU',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA82F8GSTjjrGZw1A8i8RjsRdQdj6r-CNo5hpG9Qb2AlQg3rXooXw5OyFNi9naRe4Ttj17vrLkuq8pwPXFPHyRdHfFaVoPPlU8LuCf59TW4AQKS4AOVFkis0C1kaAl51cahJhWFyF8lnQFu_d50VndCE41WTC1zrmkPpeAptuAQwfDxSby3RBIcLaO7xArHLE5CuimWgrAM2JPWMvmhVHmJ_0L9I5nZS6NxanVNozQ',
    liveConnections: '42 Active Terminal Lines',
    isDemo: true,
  },
  {
    id: 'mysuru',
    name: 'Mysuru',
    kannadaName: 'ಮೈಸೂರು',
    code: 'MYS CENTRAL',
    stationSubtitle: '85m Superfast Line',
    badgeText: 'EXPRESSWAY',
    badgeColor: 'text-secondary bg-surface',
    verticalLabel: 'MYSURU',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAkRjVq2l4ds1ZjwHkc7ChBv-7V9RlKvv5pJzzMPTVKF1c-2fmBPeThc8RBtku-3htOIHqkHnSQQcTNufFnSuH5ETHNtacdSaOqphmSDmk4qyVvoEBV-4o6EBOeLE_X2A6Xe4XNqmCML9gI6tvVDvmjhskD1rtwqHVYp4jrhR3uDF4Kn5kwV_0vRDLd66OC-bjfi2nhcVmww8cVduuiK3xEEel_N8gR63I0PtE-y5g',
    liveConnections: 'Bengaluru-Mysuru Expressway',
    isDemo: true,
  },
  {
    id: 'hampi',
    name: 'Hampi',
    kannadaName: 'ಹಂಪಿ',
    code: 'HPT / HOSAPETE',
    stationSubtitle: 'Overnight Sleeper Rail',
    badgeText: 'UNESCO HERITAGE',
    badgeColor: 'text-tertiary bg-surface',
    verticalLabel: 'HAMPI',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxcuuTpNhMp0jPNWxnBjc-68K4QSTKgCsH5y4SvB5oqyjU5ZI2RwwAMIGbo2ITNu7MlMn23YNO5HQ7yK5ajJFfiRGJoUtSxWCoVAk4HVQnHj4cYQvlZLbBbXrCkL6tAQXQZPtcYYDWn2EPFznc74qUS3MG2_Fw6hCrtCSKOmeHtVN3V2gpvSAwg7pb_0_dnO4nS6WhCUXxrn_FXmsFNf_aBUGIskAqWoZtP7itlPU',
    liveConnections: 'Hampi Express Direct',
    isDemo: true,
  },
  {
    id: 'chikmagalur',
    name: 'Chikmagalur',
    kannadaName: 'ಚಿಕ್ಕಮಗಳೂರು',
    code: 'CMGR / KADUR',
    stationSubtitle: 'Coffee Estate Link',
    badgeText: 'HILL REGION',
    badgeColor: 'text-on-surface-variant bg-surface',
    verticalLabel: 'CHIKMAGALUR',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBqXRILtp07F-hu1_dtTUm5xV0MhWtJ-RccFh2MzFcDdhU1p99-fOtZUja4TSWITwxkgnJzWoKNEheDx9awH6hg7kme6QCxu6lmybRFSCGogjuXp0GvpVe7l-VieScsq-U8_XV-tEb2jT3146oFCHY1w3sOKcOYvUCH7lHeRsLQZJCLfjaH_gyDo3FIvsA983bEfkcI_YLZjBC_6DXk9KXgJio7JNmJ0pHd9Jx1lAc',
    liveConnections: 'Kadur Junction Shuttle',
    isDemo: true,
  },
  {
    id: 'coorg',
    name: 'Coorg',
    kannadaName: 'ಕೊಡಗು',
    code: 'MYSURU TRANSIT',
    stationSubtitle: 'Electric Coach Connect',
    badgeText: 'VALLEY ACCESS',
    badgeColor: 'text-on-surface-variant bg-surface',
    verticalLabel: 'COORG',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBIuhlcY63j0DzTUgS-a2K4X97gv5pZdMFmhkyCMAfhP8opdequo7nXgyzITse01oUThsbbCf5FNS8YKjl52Fqo5HMyCBwHnzitOZuJ1LxtoPOTzX3Tr7z4RNC_KSqD2iWNm8QHLzX6oXBtRu7X-yRQwLUjjRcyzrRtklvXigwih4CcJTapD60VCndsYHFJdBZpbxr3asI1q1RoxIL5TLj1PS-hBGRoVuMkdfJ7Jxc',
    liveConnections: 'EV Flybus Corridor',
    isDemo: true,
  },
];

export const MOCK_MULTI_LEG_BUNDLES: MultiLegBundle[] = [
  {
    id: 'chinnaswamy-derby-weekend',
    packageName: 'Chinnaswamy Derby Super Weekend',
    packageSubtitle: '2 Days • Mysuru Departure • Weekend Slated',
    badgeText: 'BEST VALUE',
    transport: {
      serviceName: 'KSRTC Airavat Club Class',
      timing: 'Dep: 06:15 AM MYS Bus Stand',
      pricePerPerson: 420,
    },
    stay: {
      hotelName: 'MG Road Business Hotel',
      proximity: '400m walk from Cricket Ground',
      pricePerNight: 5800,
    },
    match: {
      standName: 'East Stand Block D',
      gateAccess: 'Direct Gate 3 Access',
      pricePerTicket: 3200,
    },
    totalPriceForTwo: 18840,
    isDemo: true,
  },
  {
    id: 'budget-express-match-day',
    packageName: 'Budget Express Match Day',
    packageSubtitle: 'Same-day return corridor itinerary',
    badgeText: 'FAST-PACED',
    transport: {
      serviceName: 'Shatabdi Express (Train 12008)',
      timing: 'Dep: 11:00 AM • AC Chair Car',
      pricePerPerson: 670,
    },
    stay: {
      hotelName: 'Indiranagar Homestay',
      proximity: 'Purple Line Metro direct',
      pricePerNight: 3200,
    },
    match: {
      standName: 'South Pavilion Tier 2',
      gateAccess: 'Unobstructed sightline view',
      pricePerTicket: 2500,
    },
    totalPriceForTwo: 12740,
    isDemo: true,
  },
];

export const MOCK_UPCOMING_EVENTS: CalendarEvent[] = [
  {
    id: 'rcb-csk-oct28',
    dayNumber: '28',
    month: 'OCT',
    badgeText: 'HIGH ATTENDANCE',
    seriesCode: 'MATCH DAY 18',
    title: 'RCB vs CSK Saturday Night Blockbuster',
    venueAndTransit:
      'M. Chinnaswamy Stadium, Bengaluru • Special midnight return trains operated by SWR to Mysuru',
    startingPrice: 1800,
    fareLabel: 'STARTING FARE',
    isDemo: true,
  },
  {
    id: 'dasara-nov04',
    dayNumber: '04',
    month: 'NOV',
    badgeText: 'STATE FESTIVAL',
    seriesCode: 'JUMBOO SAVARI',
    title: 'Mysuru Dasara Grand Finale & Torchlight Procession',
    venueAndTransit:
      'Bannimantap Grounds & Mysore Palace • Exclusive gold card seating zone with KSRTC shuttle feeder',
    startingPrice: 4500,
    fareLabel: 'PER ENCLOSURE',
    isDemo: true,
  },
  {
    id: 'dhwani-nov12',
    dayNumber: '12',
    month: 'NOV',
    badgeText: 'CONCERT SERIES',
    seriesCode: 'PALACE GROUNDS',
    title: 'Kannada Rock Festival: Dhwani 2025',
    venueAndTransit:
      'Manpho Convention Centre & Palace Grounds • Joint pass with Bengaluru Metro Day Green Pass',
    startingPrice: 750,
    fareLabel: 'EARLY BIRD PASS',
    isDemo: true,
  },
];

export const PROMPT_SHORTCUTS = [
  'Cricket weekend for 4 from Mysuru',
  'Cheapest way to Bengaluru Sunday',
  'Dasara packages under ₹20,000',
  'Seats with a view of the sight screen',
];

