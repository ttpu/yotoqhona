'use client';

import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import '@/lib/leaflet-icon-fix';
import 'leaflet/dist/leaflet.css';
import styles from './map-picker.module.css';

const TASHKENT: [number, number] = [41.2995, 69.2401];

type MapPickerProps = {
  lat?: number;
  lng?: number;
  onChange: (lat: number, lng: number) => void;
};

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    lat != null && lng != null ? [lat, lng] : null
  );
  const [locating, setLocating] = useState(false);

  function useMyLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (geo) => {
        const next: [number, number] = [geo.coords.latitude, geo.coords.longitude];
        setPosition(next);
        onChange(next[0], next[1]);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <button type="button" className={styles.locateBtn} onClick={useMyLocation} disabled={locating}>
          {locating ? 'Aniqlanmoqda...' : "📍 Joriy joylashuvimni aniqlash"}
        </button>
        {position && (
          <span className={styles.coords}>
            {position[0].toFixed(5)}, {position[1].toFixed(5)}
          </span>
        )}
      </div>
      <MapContainer
        center={position ?? TASHKENT}
        zoom={position ? 15 : 11}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler
          onPick={(pickedLat, pickedLng) => {
            setPosition([pickedLat, pickedLng]);
            onChange(pickedLat, pickedLng);
          }}
        />
        {position && <Marker position={position} />}
      </MapContainer>
      <p className={styles.hint}>Joylashuvni belgilash uchun xaritada istalgan nuqtani bosing.</p>
    </div>
  );
}
