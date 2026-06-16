'use client';
import { useState } from 'react';
import Sidebar, { type View } from '@/components/Sidebar';
import TopBar       from '@/components/TopBar';
import MapDashboard  from '@/views/MapDashboard';
import DealsView     from '@/views/DealsView';
import ProfileView   from '@/views/ProfileView';
import EducationView from '@/views/EducationView';
import ContractView  from '@/views/ContractView';

export default function Home() {
  const [view, setView] = useState<View>('map');

  const VIEWS: Record<View, React.ReactNode> = {
    map:       <MapDashboard />,
    deals:     <DealsView />,
    profile:   <ProfileView />,
    education: <EducationView />,
    contract:  <ContractView />,
  };

  const TITLES: Record<View, string> = {
    map:       'Mapa',
    deals:     'Dealovi',
    profile:   'Profil',
    education: 'Edukacija',
    contract:  'Smart Ugovor',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zeus-bg">
      <Sidebar active={view} onChange={setView} notifCount={2} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={TITLES[view]} />
        <main
          key={view}
          className="flex-1 min-h-0 overflow-hidden"
          style={{ animation: 'slideFade 0.32s cubic-bezier(0.4,0,0.2,1) forwards' }}
        >
          {VIEWS[view]}
        </main>
      </div>
    </div>
  );
}
