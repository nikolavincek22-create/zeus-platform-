'use client';
import { useState, useEffect } from 'react';
import Sidebar, { type View } from '@/components/Sidebar';
import MapDashboard   from '@/views/MapDashboard';
import DealsView      from '@/views/DealsView';
import ProfileView    from '@/views/ProfileView';
import EducationView  from '@/views/EducationView';
import ContractView   from '@/views/ContractView';

export default function Home() {
  const [view, setView]       = useState<View>('map');
  const [prevView, setPrevView] = useState<View | null>(null);

  const navigate = (v: View) => {
    if (v === view) return;
    setPrevView(view);
    setView(v);
  };

  const VIEWS: Record<View, React.ReactNode> = {
    map:       <MapDashboard />,
    deals:     <DealsView />,
    profile:   <ProfileView />,
    education: <EducationView />,
    contract:  <ContractView />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zeus-bg">
      <Sidebar active={view} onChange={navigate} notifCount={2} />
      <main
        key={view}
        className="flex-1 overflow-hidden"
        style={{ animation: 'slideUp 0.28s cubic-bezier(0.4,0,0.2,1) forwards' }}
      >
        {VIEWS[view]}
      </main>
    </div>
  );
}
