'use client';
import { useEffect, useRef, useState } from 'react';
import type { Deal } from '@/lib/mockData';
import { getCommissionRate } from '@/lib/mockData';

interface MapViewProps {
  deals: Deal[];
  onSelectDeal?: (deal: Deal) => void;
  selectedId?: string;
}

export default function MapView({ deals, onSelectDeal, selectedId }: MapViewProps) {
  const mapRef    = useRef<HTMLDivElement>(null);
  const mapInst   = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (mapInst.current || !mapRef.current) return;

    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      const map = L.map(mapRef.current!, {
        center:        [44.8, 16.5],
        zoom:          7,
        zoomControl:   false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInst.current = map;

      deals.forEach(deal => {
        const isRE     = deal.type === 'real_estate';
        const color    = isRE ? '#3B82F6' : '#F59E0B';
        const rate     = getCommissionRate(deal.type);

        const icon = L.divIcon({
          className: '',
          html: `
            <div style="
              width:36px;height:36px;border-radius:50% 50% 50% 0;
              background:${color};border:2px solid #fff;
              transform:rotate(-45deg);
              box-shadow:0 2px 8px rgba(0,0,0,0.5);
              cursor:pointer;
              transition:transform 200ms cubic-bezier(0.4,0,0.2,1);
            "></div>`,
          iconSize:   [36, 36],
          iconAnchor: [18, 36],
        });

        const marker = L.marker([deal.lat, deal.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif;min-width:200px;padding:4px">
              <p style="font-size:11px;color:#999;margin:0 0 2px;text-transform:uppercase;letter-spacing:.08em">
                ${isRE ? 'Nekretnina' : 'Materijal'}
              </p>
              <p style="font-size:14px;font-weight:600;margin:0 0 4px;color:#000">
                ${deal.title}
              </p>
              <p style="font-size:18px;font-weight:700;margin:0 0 6px;color:#000">
                ${deal.price.toLocaleString('hr-HR')} €
              </p>
              <p style="font-size:11px;color:#666;margin:0">
                Lokacija: ${deal.location}
              </p>
              <p style="font-size:11px;color:#FF3B30;margin:4px 0 0;font-weight:600">
                ZEUS provizija (${rate}): ${(isRE ? deal.price*0.015 : deal.price*0.005).toLocaleString('hr-HR',{maximumFractionDigits:0})} €
              </p>
            </div>
          `, { maxWidth: 260 });

        marker.on('click', () => onSelectDeal?.(deal));
        markersRef.current.push({ id: deal.id, marker });
      });

      setReady(true);
    })();

    return () => {
      mapInst.current?.remove();
      mapInst.current = null;
    };
  }, []);

  // Pulse selected marker
  useEffect(() => {
    if (!selectedId) return;
    const found = markersRef.current.find(m => m.id === selectedId);
    found?.marker.openPopup();
  }, [selectedId]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-zeus-bg/80 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-zeus-red border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-white/40">Učitavam mapu...</p>
          </div>
        </div>
      )}
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-zeus-black/90 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-[11px] text-white/50">Nekretnina</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="text-[11px] text-white/50">Materijal</span>
        </div>
      </div>
    </div>
  );
}
