'use client';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import '@/lib/leaflet-icon-fix';
import 'leaflet/dist/leaflet.css';
import styles from './map-picker.module.css';

type MapViewProps = {
  lat: number;
  lng: number;
  label?: string;
};

export default function MapView({ lat, lng, label }: MapViewProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      className={styles.map}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>{label ? <Popup>{label}</Popup> : null}</Marker>
    </MapContainer>
  );
}
