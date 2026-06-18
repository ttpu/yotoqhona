'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  ClipboardList,
  Flag,
  FileText,
  Images,
  MapPin,
  Phone,
  RotateCcw,
  Sparkles,
  Upload,
  Wallet,
  X
} from 'lucide-react';
import {
  AMENITY_LABELS,
  LISTING_TYPE_LABELS,
  REQUIREMENT_LABELS,
  STATUS_LABELS
} from '@/lib/listing-labels';
import type {
  Listing,
  ListingAmenity,
  ListingCurrency,
  ListingRequirement,
  ListingStatus,
  ListingType
} from '@/lib/listing-types';
import styles from './listing-form.module.css';

const MapPicker = dynamic(() => import('./map-picker'), {
  ssr: false,
  loading: () => <div style={{ height: 320, borderRadius: 14, background: '#f0f0f0' }} />
});

const AMENITY_OPTIONS = Object.keys(AMENITY_LABELS).filter((k) => k !== 'OTHER') as ListingAmenity[];
const REQUIREMENT_OPTIONS = Object.keys(REQUIREMENT_LABELS).filter((k) => k !== 'OTHER') as ListingRequirement[];
const TYPE_OPTIONS = Object.keys(LISTING_TYPE_LABELS) as ListingType[];

type ExistingImage = { path: string; markedForRemoval: boolean };
type NewImage = { file: File; url: string };

type ListingFormProps = {
  mode: 'create' | 'edit';
  listingId?: string;
  initialValues?: Partial<Listing>;
};

export default function ListingForm({ mode, listingId, initialValues }: ListingFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [type, setType] = useState<ListingType>(initialValues?.type ?? 'APARTMENT');
  const [address, setAddress] = useState(initialValues?.address ?? '');
  const [city, setCity] = useState(initialValues?.city ?? 'Toshkent');
  const [lat, setLat] = useState<number | undefined>(initialValues?.lat);
  const [lng, setLng] = useState<number | undefined>(initialValues?.lng);
  const [price, setPrice] = useState(initialValues?.price?.toString() ?? '');
  const [currency, setCurrency] = useState<ListingCurrency>(initialValues?.currency ?? 'UZS');
  const [roomsCount, setRoomsCount] = useState(initialValues?.roomsCount?.toString() ?? '1');
  const [capacity, setCapacity] = useState(initialValues?.capacity?.toString() ?? '1');
  const [amenities, setAmenities] = useState<ListingAmenity[]>(initialValues?.amenities ?? []);
  const [customAmenity, setCustomAmenity] = useState(initialValues?.customAmenity ?? '');
  const [contactPhone, setContactPhone] = useState(initialValues?.contactPhone ?? '');
  const [contactTelegram, setContactTelegram] = useState(initialValues?.contactTelegram ?? '');
  const [contactEmail, setContactEmail] = useState(initialValues?.contactEmail ?? '');
  const [requirements, setRequirements] = useState<ListingRequirement[]>(initialValues?.requirements ?? []);
  const [customRequirement, setCustomRequirement] = useState(initialValues?.customRequirement ?? '');
  const [status, setStatus] = useState<ListingStatus>(initialValues?.status ?? 'ACTIVE');

  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    (initialValues?.images ?? []).map((path) => ({ path, markedForRemoval: false }))
  );
  const [newImages, setNewImages] = useState<NewImage[]>([]);
  const createdUrlsRef = useRef<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function toggleAmenity(a: ListingAmenity) {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }
  function toggleRequirement(r: ListingRequirement) {
    setRequirements((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }

  function onFilesPicked(files: FileList | null) {
    if (!files || files.length === 0) return;
    const added = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      createdUrlsRef.current.push(url);
      return { file, url };
    });
    setNewImages((prev) => [...prev, ...added]);
  }

  function removeNewImage(idx: number) {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function toggleRemoveExisting(targetPath: string) {
    setExistingImages((prev) =>
      prev.map((img) => (img.path === targetPath ? { ...img, markedForRemoval: !img.markedForRemoval } : img))
    );
  }

  const remainingExistingCount = existingImages.filter((i) => !i.markedForRemoval).length;
  const totalPhotos = remainingExistingCount + newImages.length;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (lat == null || lng == null) {
      setError('Iltimos, xaritada joylashuvni belgilang');
      return;
    }
    if (totalPhotos === 0) {
      setError("Kamida 1 ta rasm yuklang");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set('title', title);
      formData.set('description', description);
      formData.set('type', type);
      formData.set('address', address);
      formData.set('city', city);
      formData.set('lat', String(lat));
      formData.set('lng', String(lng));
      formData.set('price', price);
      formData.set('currency', currency);
      formData.set('roomsCount', roomsCount);
      formData.set('capacity', capacity);
      formData.set('contactPhone', contactPhone);
      if (contactTelegram) formData.set('contactTelegram', contactTelegram);
      if (contactEmail) formData.set('contactEmail', contactEmail);
      if (customAmenity) formData.set('customAmenity', customAmenity);
      if (customRequirement) formData.set('customRequirement', customRequirement);
      amenities.forEach((a) => formData.append('amenities', a));
      requirements.forEach((r) => formData.append('requirements', r));
      newImages.forEach((img) => formData.append('images', img.file));

      if (mode === 'edit') {
        formData.set('status', status);
        existingImages
          .filter((i) => i.markedForRemoval)
          .forEach((i) => formData.append('removeImages', i.path));
      }

      const url = mode === 'create' ? '/api/listings' : `/api/listings/${listingId}`;
      const res = await fetch(url, { method: mode === 'create' ? 'POST' : 'PATCH', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Xatolik yuz berdi');
        return;
      }

      router.push('/dashboard/listings');
      router.refresh();
    } catch {
      setError("Tarmoq xatosi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1 className={styles.title}>{mode === 'create' ? "Yangi e'lon qo'shish" : "E'lonni tahrirlash"}</h1>
        <p className={styles.subtitle}>
          Barcha maydonlarni to&#39;ldiring — bu talabalarga joyni topishni osonlashtiradi.
        </p>
      </div>

      <form onSubmit={onSubmit}>
        {error && <div className={styles.error}>{error}</div>}

        <section className={styles.section}>
          <p className={styles.sectionTitle}><FileText size={16} /> Asosiy ma&#39;lumotlar</p>
          <div className={styles.field}>
            <label className={styles.label}>E&#39;lon nomi *</label>
            <input
              className={styles.input}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Chilonzordagi yorug' 2 xonali kvartira"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Tafsilotli tavsif *</label>
            <textarea
              className={styles.textarea}
              required
              minLength={10}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Uy haqida batafsil ma'lumot: holati, atrof-muhit, transport..."
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Turar joy turi *</label>
            <select className={styles.select} value={type} onChange={(e) => setType(e.target.value as ListingType)}>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {LISTING_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionTitle}><MapPin size={16} /> Joylashuv</p>
          <div className={styles.field}>
            <label className={styles.label}>Manzil *</label>
            <input
              className={styles.input}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ko'cha, uy raqami"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Shahar *</label>
            <input className={styles.input} required value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Xaritada joylashuv *</label>
            <MapPicker
              lat={lat}
              lng={lng}
              onChange={(pickedLat, pickedLng) => {
                setLat(pickedLat);
                setLng(pickedLng);
              }}
            />
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionTitle}><Wallet size={16} /> Narx va sig&#39;im</p>
          <div className={styles.field}>
            <label className={styles.label}>Oylik narx *</label>
            <div className={styles.priceRow}>
              <input
                className={styles.input}
                type="number"
                min={1}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1500000"
              />
              <select className={styles.select} value={currency} onChange={(e) => setCurrency(e.target.value as ListingCurrency)}>
                <option value="UZS">UZS (so&#39;m)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Xonalar soni *</label>
              <input
                className={styles.input}
                type="number"
                min={1}
                required
                value={roomsCount}
                onChange={(e) => setRoomsCount(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Yashash o&#39;rinlari soni *</label>
              <input
                className={styles.input}
                type="number"
                min={1}
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionTitle}><Sparkles size={16} /> Qulayliklar</p>
          <div className={styles.checkGrid}>
            {AMENITY_OPTIONS.map((a) => {
              const AmenityIcon = AMENITY_LABELS[a].icon;
              return (
                <label key={a} className={`${styles.checkItem} ${amenities.includes(a) ? styles.checkItemActive : ''}`}>
                  <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                  <AmenityIcon size={14} /> {AMENITY_LABELS[a].label}
                </label>
              );
            })}
          </div>
          <div className={styles.field} style={{ marginTop: 14 }}>
            <label className={styles.label}>Boshqa qulayliklar</label>
            <input
              className={styles.input}
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              placeholder="Masalan: Balkon, Liftli bino..."
            />
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionTitle}><Images size={16} /> Fotosuratlar * (kamida 1 ta)</p>

          {existingImages.length > 0 && (
            <div className={styles.previewGrid}>
              {existingImages.map((img) => (
                <div
                  key={img.path}
                  className={styles.previewItem}
                  style={{ opacity: img.markedForRemoval ? 0.35 : 1 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.path} alt="" />
                  <button type="button" className={styles.previewRemove} onClick={() => toggleRemoveExisting(img.path)}>
                    {img.markedForRemoval ? <RotateCcw size={12} /> : <X size={12} />}
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className={styles.dropzone} style={{ marginTop: existingImages.length ? 14 : 0, display: 'block' }}>
            <div className={styles.dropzoneIcon}><Upload size={26} /></div>
            <div className={styles.dropzoneText}>Rasmlarni tanlash uchun bosing</div>
            <div className={styles.dropzoneHint}>JPG, PNG — bir nechta rasm tanlash mumkin</div>
            <input type="file" accept="image/*" multiple hidden onChange={(e) => onFilesPicked(e.target.files)} />
          </label>

          {newImages.length > 0 && (
            <div className={styles.previewGrid}>
              {newImages.map((img, idx) => (
                <div key={img.url} className={styles.previewItem}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" />
                  <span className={styles.previewBadge}>YANGI</span>
                  <button type="button" className={styles.previewRemove} onClick={() => removeNewImage(idx)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <p className={styles.sectionTitle}><Phone size={16} /> Kontakt ma&#39;lumotlari</p>
          <div className={styles.field}>
            <label className={styles.label}>Telefon raqami *</label>
            <input
              className={styles.input}
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+998 90 000 00 00"
            />
          </div>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Telegram</label>
              <input
                className={styles.input}
                value={contactTelegram}
                onChange={(e) => setContactTelegram(e.target.value)}
                placeholder="@username"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionTitle}><ClipboardList size={16} /> Qo&#39;shimcha talablar</p>
          <div className={styles.checkGrid}>
            {REQUIREMENT_OPTIONS.map((r) => (
              <label key={r} className={`${styles.checkItem} ${requirements.includes(r) ? styles.checkItemActive : ''}`}>
                <input type="checkbox" checked={requirements.includes(r)} onChange={() => toggleRequirement(r)} />
                {REQUIREMENT_LABELS[r]}
              </label>
            ))}
          </div>
          <div className={styles.field} style={{ marginTop: 14 }}>
            <label className={styles.label}>Boshqa shart</label>
            <input
              className={styles.input}
              value={customRequirement}
              onChange={(e) => setCustomRequirement(e.target.value)}
              placeholder="Masalan: minimal 6 oyga ijara"
            />
          </div>
        </section>

        {mode === 'edit' && (
          <section className={styles.section}>
            <p className={styles.sectionTitle}><Flag size={16} /> E&#39;lon holati</p>
            <div className={styles.field}>
              <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value as ListingStatus)}>
                {Object.entries(STATUS_LABELS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>
          </section>
        )}

        <div className={styles.btnRow}>
          <button type="button" className={styles.btnOutline} onClick={() => router.push('/dashboard/listings')}>
            Bekor qilish
          </button>
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Saqlanmoqda...' : mode === 'create' ? "E'lonni joylashtirish" : 'Saqlash'}
          </button>
        </div>
      </form>
    </div>
  );
}
