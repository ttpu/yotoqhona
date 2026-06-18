'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./map-view'), {
  ssr: false,
  loading: () => <div style={{ height: 280, borderRadius: 14, background: '#f0f0f0' }} />
});

export default MapView;
