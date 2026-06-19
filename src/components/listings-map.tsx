'use client';

import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import Link from 'next/link';
import type { Route } from 'next';
import 'leaflet/dist/leaflet.css';
import { formatListingPrice } from '@/lib/listing-labels';
import type { ListingLocation } from '@/lib/listings-store';
import type { ListingType } from '@/lib/listing-types';
import styles from './listings-map.module.css';

const TASHKENT: [number, number] = [41.2995, 69.2401];

const TYPE_COLOR: Record<ListingType, string> = {
  DORMITORY: '#4caf50',
  ROOM: '#2196f3',
  APARTMENT: '#ff9800',
  HOUSE: '#9c27b0'
};

function dotIcon(color: string) {
  return L.divIcon({
    className: styles.markerDot,
    html: `<span style="background:${color}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
}

export default function ListingsMap({ locations }: { locations: ListingLocation[] }) {
  return (
    <MapContainer center={TASHKENT} zoom={11} className={styles.map} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={dotIcon(TYPE_COLOR[loc.type])}>
          <Popup>
            <div className={styles.popup}>
              <p className={styles.popupTitle}>{loc.title}</p>
              <p className={styles.popupPrice}>{formatListingPrice(loc.price, loc.currency)} / oy</p>
              <Link href={`/housing/${loc.id}` as Route} className={styles.popupLink}>
                Batafsil ko&#39;rish →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
