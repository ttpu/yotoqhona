'use client';

import { useState } from 'react';
import styles from './housing-detail.module.css';

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt={title} />
      </div>
      {images.length > 1 && (
        <div className={styles.thumbRow}>
          {images.map((src, idx) => (
            <button
              key={src}
              type="button"
              className={`${styles.thumb} ${idx === active ? styles.thumbActive : ''}`}
              onClick={() => setActive(idx)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${title} ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
