import { TelemetryStatusBar } from '@/components/layout/TelemetryStatusBar';
import { HeroSearchPanel } from '@/components/home/HeroSearchPanel';
import { PlatformCategories } from '@/components/home/PlatformCategories';
import { TrendingMatches } from '@/components/home/TrendingMatches';
import { RegionalBento } from '@/components/home/RegionalBento';
import { DestinationCards } from '@/components/home/DestinationCards';
import { MultiLegBundles } from '@/components/home/MultiLegBundles';
import { EventsTimeline } from '@/components/home/EventsTimeline';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-[#080B18]">
      {/* Top Corridor Telemetry Ribbon */}
      <TelemetryStatusBar />

      {/* Hero Section with Interactive AI Terminal & Floodlit Chinnaswamy Photo */}
      <HeroSearchPanel />

      {/* Platform Multimodal Ecosystem (Cricket, Cinema, Zoo, Heritage, Concerts, Hotels, Transit) */}
      <PlatformCategories />

      {/* Section 1: Trending Matches (Ticket Stubs & Live Inventory) */}
      <TrendingMatches />

      {/* Section 2: Regional Experiences (Asymmetric 1-Big + 2-Stacked Bento) */}
      <RegionalBento />

      {/* Section 3: Corridor Destinations (5 Editorial Cards with Rotated Labels) */}
      <DestinationCards />

      {/* Section 4: Multi-Leg Bundles (Comparison Matrix Table) */}
      <MultiLegBundles />

      {/* Section 5: Upcoming Events Timeline & PNR Sync Banner */}
      <EventsTimeline />
    </div>
  );
}
