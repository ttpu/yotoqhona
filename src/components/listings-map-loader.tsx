'use client';

import dynamic from 'next/dynamic';

const ListingsMap = dynamic(() => import('./listings-map'), {
  ssr: false,
  loading: () => <div style={{ height: 360, borderRadius: 14, background: '#f0f0f0' }} />
});

export default ListingsMap;
