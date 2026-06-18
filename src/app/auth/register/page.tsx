'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import {
  Building2,
  Check,
  Clock,
  CreditCard,
  GraduationCap,
  Home,
  IdCard,
  Landmark,
  Lock,
  PartyPopper,
  User,
} from 'lucide-react';
import styles from '../auth.module.css';

type MainFlow = 'student' | 'provider';
type ProviderFlow = 'UNIVERSITY_ADMINISTRATION' | 'PRIVATE_PROVIDER';

const baseStudentForm = {
  firstName: '', lastName: '', middleName: '',
  dateOfBirth: '', gender: 'MALE',
  phoneNumber: '', email: '', address: '',
  university: '', faculty: '', course: '', studentIdNumber: '',
  password: '', passwordConfirmation: '',
};

const baseUniversityForm = {
  officialUniversityName: '', shortName: '', organizationType: 'University',
  officialAddress: '', contactPhoneNumber: '', officialEmailAddress: '',
  website: '', responsiblePersonFullName: '', responsiblePersonPosition: '',
  responsiblePersonPhone: '', responsiblePersonEmail: '',
  bankAccountNumber: '', organizationTaxNumber: '',
  paymentReceivingInformation: '', registrationCertificate: '',
  authorizationLetter: '', supportingDocuments: '',
  password: '', passwordConfirmation: '',
};

const basePrivateForm = {
  fullName: '', dateOfBirth: '', phoneNumber: '', emailAddress: '',
  propertyType: 'Apartment', region: '', district: '', address: '',
  password: '', passwordConfirmation: '',
};

function getPasswordStrength(pw: string): 0 | 1 | 2 | 3 {
  if (pw.length < 4) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}

function PasswordStrength({ password }: { password: string }) {
  const s = getPasswordStrength(password);
  if (!password) return null;
  const labels = ['', "Juda zaif", "O'rtacha", "Kuchli"];
  const cls = [, styles.weak, styles.medium, styles.strong];
  return (
    <div>
      <div className={styles.strengthRow}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`${styles.strengthBar} ${s >= i ? cls[s] ?? '' : ''}`}
          />
        ))}
      </div>
      {s > 0 && (
        <p className={`${styles.strengthText} ${cls[s] ?? ''}`}>{labels[s]}</p>
      )}
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [mainFlow, setMainFlow] = useState<MainFlow | null>(null);
  const [providerFlow, setProviderFlow] = useState<ProviderFlow | null>(null);
  const [studentForm, setStudentForm] = useState(baseStudentForm);
  const [universityForm, setUniversityForm] = useState(baseUniversityForm);
  const [privateForm, setPrivateForm] = useState(basePrivateForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);

  const step = useMemo(() => {
    if (done) return 3;
    if (mainFlow === 'student' || (mainFlow === 'provider' && providerFlow)) return 2;
    return 1;
  }, [mainFlow, providerFlow, done]);

  const submitLabel = useMemo(() => {
    if (mainFlow === 'student') return "Talaba akkauntini yaratish";
    if (providerFlow === 'UNIVERSITY_ADMINISTRATION') return "Universitet akkauntini yuborish";
    if (providerFlow === 'PRIVATE_PROVIDER') return "Provayder akkauntini yaratish";
    return 'Davom etish';
  }, [mainFlow, providerFlow]);

  const isFormVisible = mainFlow === 'student' || (mainFlow === 'provider' && providerFlow !== null);

  function sf<K extends keyof typeof baseStudentForm>(k: K, v: string) {
    setStudentForm((prev) => ({ ...prev, [k]: v }));
  }
  function uf<K extends keyof typeof baseUniversityForm>(k: K, v: string) {
    setUniversityForm((prev) => ({ ...prev, [k]: v }));
  }
  function pf<K extends keyof typeof basePrivateForm>(k: K, v: string) {
    setPrivateForm((prev) => ({ ...prev, [k]: v }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload =
      mainFlow === 'student'
        ? { flow: 'student', ...studentForm }
        : providerFlow === 'UNIVERSITY_ADMINISTRATION'
          ? { flow: 'provider-university', providerType: providerFlow, ...universityForm }
          : { flow: 'provider-private', providerType: 'PRIVATE_PROVIDER', ...privateForm };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { message?: string; redirectTo?: string };

      if (!res.ok || !data.redirectTo) {
        setError(data.message ?? "Ro'yxatdan o'tishda xatolik yuz berdi");
        return;
      }

      setDone(true);
      setTimeout(() => {
        router.push(data.redirectTo as Route);
        router.refresh();
      }, 2000);
    } catch {
      setError("Tarmoq xatosi. Keyinroq qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.card} ${styles.cardWide}`}>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>TJ</div>
          TalabaJoy
        </Link>

        {/* Step indicator */}
        <div className={styles.steps}>
          <div className={styles.stepItem}>
            <div className={`${styles.stepNum} ${step >= 1 ? (step > 1 ? styles.done : styles.active) : ''}`}>
              {step > 1 ? <Check size={14} /> : '1'}
            </div>
            <span className={`${styles.stepLabel} ${step === 1 ? styles.active : step > 1 ? styles.done : ''}`}>
              Rol tanlash
            </span>
          </div>
          <div className={`${styles.stepLine} ${step > 1 ? styles.done : ''}`} />
          <div className={styles.stepItem}>
            <div className={`${styles.stepNum} ${step >= 2 ? (step > 2 ? styles.done : styles.active) : ''}`}>
              {step > 2 ? <Check size={14} /> : '2'}
            </div>
            <span className={`${styles.stepLabel} ${step === 2 ? styles.active : step > 2 ? styles.done : ''}`}>
              Ma&#39;lumotlar
            </span>
          </div>
          <div className={`${styles.stepLine} ${step > 2 ? styles.done : ''}`} />
          <div className={styles.stepItem}>
            <div className={`${styles.stepNum} ${step >= 3 ? styles.active : ''}`}>
              {step >= 3 ? <Check size={14} /> : '3'}
            </div>
            <span className={`${styles.stepLabel} ${step === 3 ? styles.active : ''}`}>
              Tayyor
            </span>
          </div>
        </div>

        {/* ===== SUCCESS STATE ===== */}
        {done && (
          <div className={styles.successWrap}>
            <div className={styles.successIcon}><PartyPopper size={28} /></div>
            <h2 className={styles.successTitle}>Muvaffaqiyatli ro&#39;yxatdan o&#39;tdingiz!</h2>
            <p className={styles.successText}>
              Siz tizimga yo&#39;naltirilmoqdasiz...
            </p>
          </div>
        )}

        {/* ===== STEP 1: ROLE SELECTION ===== */}
        {!done && (
          <>
            {step === 1 || (step === 2 && mainFlow === 'provider' && !providerFlow) ? (
              <>
                <h1 className={styles.title}>Ro&#39;yxatdan o&#39;tish</h1>
                <p className={styles.subtitle}>Platformadan qanday foydalanmoqchisiz?</p>

                <div className={styles.roleGrid}>
                  <button
                    type="button"
                    className={`${styles.roleCard} ${mainFlow === 'student' ? styles.selected : ''}`}
                    onClick={() => { setMainFlow('student'); setProviderFlow(null); }}
                  >
                    <span className={styles.roleCardIcon}><GraduationCap size={28} /></span>
                    <h3>Talaba</h3>
                    <p>Turar joy qidirish, ariza yuborish va to&#39;lovlarni boshqarish uchun</p>
                  </button>

                  <button
                    type="button"
                    className={`${styles.roleCard} ${mainFlow === 'provider' ? styles.selected : ''}`}
                    onClick={() => setMainFlow('provider')}
                  >
                    <span className={styles.roleCardIcon}><Building2 size={28} /></span>
                    <h3>Turar joy egasi</h3>
                    <p>Yotoqxona, xostel yoki ijara uylarini ro&#39;yxatdan o&#39;tkazish uchun</p>
                  </button>
                </div>

                {mainFlow === 'provider' && (
                  <>
                    <p className={styles.subtitle} style={{ marginTop: 8 }}>
                      Qaysi turdagi turar joy taqdimotchisisiz?
                    </p>
                    <div className={styles.roleGrid}>
                      <button
                        type="button"
                        className={`${styles.roleCard} ${providerFlow === 'UNIVERSITY_ADMINISTRATION' ? styles.selected : ''}`}
                        onClick={() => setProviderFlow('UNIVERSITY_ADMINISTRATION')}
                      >
                        <span className={styles.roleCardIcon}><Landmark size={28} /></span>
                        <h3>Universitet boshqarmasi</h3>
                        <p>Rasmiy universitetlar va talabalar turar joylar uchun</p>
                      </button>
                      <button
                        type="button"
                        className={`${styles.roleCard} ${providerFlow === 'PRIVATE_PROVIDER' ? styles.selected : ''}`}
                        onClick={() => setProviderFlow('PRIVATE_PROVIDER')}
                      >
                        <span className={styles.roleCardIcon}><Home size={28} /></span>
                        <h3>Xususiy egasi</h3>
                        <p>Kvartira, hovli yoki xostel egasi uchun</p>
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : null}

            {/* ===== STEP 2: FORMS ===== */}
            {isFormVisible && (
              <form onSubmit={onSubmit}>

                {/* ---- STUDENT FORM ---- */}
                {mainFlow === 'student' && (
                  <>
                    <h1 className={styles.title}>Talaba ma&#39;lumotlari</h1>
                    <p className={styles.subtitle}>Shaxsiy va o&#39;quv ma&#39;lumotlaringizni kiriting</p>

                    {/* Personal info */}
                    <div className={styles.formSection}>
                      <p className={styles.formSectionTitle}><User size={16} /> Shaxsiy ma&#39;lumotlar</p>
                      <div className={styles.formGrid}>
                        <div className={styles.field}>
                          <label className={styles.label}>Ism *</label>
                          <input className={styles.input} required
                            placeholder="Alisher"
                            value={studentForm.firstName}
                            onChange={(e) => sf('firstName', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Familiya *</label>
                          <input className={styles.input} required
                            placeholder="Karimov"
                            value={studentForm.lastName}
                            onChange={(e) => sf('lastName', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Otasining ismi</label>
                          <input className={styles.input}
                            placeholder="Ixtiyoriy"
                            value={studentForm.middleName}
                            onChange={(e) => sf('middleName', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Tug&#39;ilgan sana *</label>
                          <input className={styles.input} type="date" required
                            value={studentForm.dateOfBirth}
                            onChange={(e) => sf('dateOfBirth', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Jins *</label>
                          <select className={styles.input}
                            value={studentForm.gender}
                            onChange={(e) => sf('gender', e.target.value)}>
                            <option value="MALE">Erkak</option>
                            <option value="FEMALE">Ayol</option>
                          </select>
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Telefon raqami *</label>
                          <input className={styles.input} required
                            placeholder="+998 90 000 00 00"
                            value={studentForm.phoneNumber}
                            onChange={(e) => sf('phoneNumber', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Email *</label>
                          <input className={styles.input} type="email" required
                            placeholder="talaba@example.uz"
                            value={studentForm.email}
                            onChange={(e) => sf('email', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Doimiy manzil *</label>
                          <input className={styles.input} required
                            placeholder="Toshkent, Yunusobod"
                            value={studentForm.address}
                            onChange={(e) => sf('address', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* University info */}
                    <div className={styles.formSection}>
                      <p className={styles.formSectionTitle}><GraduationCap size={16} /> O&#39;quv muassasasi</p>
                      <div className={styles.formGrid}>
                        <div className={styles.field}>
                          <label className={styles.label}>Universitet *</label>
                          <input className={styles.input} required
                            placeholder="TATU, TDTU..."
                            value={studentForm.university}
                            onChange={(e) => sf('university', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Fakultet *</label>
                          <input className={styles.input} required
                            placeholder="Kompyuter muhandisligi"
                            value={studentForm.faculty}
                            onChange={(e) => sf('faculty', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Kurs *</label>
                          <select className={styles.input}
                            value={studentForm.course}
                            onChange={(e) => sf('course', e.target.value)}>
                            <option value="">Tanlang</option>
                            {['1', '2', '3', '4', '5', '6'].map((c) => (
                              <option key={c} value={c}>{c}-kurs</option>
                            ))}
                          </select>
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Talabalik ID</label>
                          <input className={styles.input}
                            placeholder="Ixtiyoriy"
                            value={studentForm.studentIdNumber}
                            onChange={(e) => sf('studentIdNumber', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Password */}
                    <div className={styles.formSection}>
                      <p className={styles.formSectionTitle}><Lock size={16} /> Xavfsizlik</p>
                      <div className={styles.formGrid}>
                        <div className={styles.field}>
                          <label className={styles.label}>Parol *</label>
                          <div className={styles.inputWrap}>
                            <input
                              type={showPw ? 'text' : 'password'}
                              className={`${styles.input} ${styles.withIcon}`}
                              minLength={8} required
                              placeholder="Kamida 8 ta belgi"
                              value={studentForm.password}
                              onChange={(e) => sf('password', e.target.value)}
                            />
                            <button type="button" className={styles.eyeBtn} onClick={() => setShowPw((v) => !v)}>
                              <EyeIcon open={showPw} />
                            </button>
                          </div>
                          <PasswordStrength password={studentForm.password} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Parolni tasdiqlash *</label>
                          <div className={styles.inputWrap}>
                            <input
                              type={showPwConfirm ? 'text' : 'password'}
                              className={`${styles.input} ${styles.withIcon}`}
                              minLength={8} required
                              placeholder="Parolni qayta kiriting"
                              value={studentForm.passwordConfirmation}
                              onChange={(e) => sf('passwordConfirmation', e.target.value)}
                            />
                            <button type="button" className={styles.eyeBtn} onClick={() => setShowPwConfirm((v) => !v)}>
                              <EyeIcon open={showPwConfirm} />
                            </button>
                          </div>
                          {studentForm.passwordConfirmation && studentForm.password !== studentForm.passwordConfirmation && (
                            <p className={`${styles.hint} ${styles.weak}`}>Parollar mos kelmayapti</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.verifyNote}>
                      <IdCard size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>OneID orqali shaxsingizni tasdiqlang va <strong>Verified Talaba</strong> nishonini oling.</span>
                    </div>
                  </>
                )}

                {/* ---- UNIVERSITY FORM ---- */}
                {providerFlow === 'UNIVERSITY_ADMINISTRATION' && (
                  <>
                    <h1 className={styles.title}>Universitet boshqarmasi</h1>
                    <p className={styles.subtitle}>Hisob yaratilgach status tekshiruvga yuboriladi</p>

                    <div className={styles.formSection}>
                      <p className={styles.formSectionTitle}><Landmark size={16} /> Muassasa ma&#39;lumotlari</p>
                      <div className={styles.formGrid}>
                        <div className={styles.field}>
                          <label className={styles.label}>Rasmiy nomi *</label>
                          <input className={styles.input} required placeholder="Toshkent Davlat Texnika Universiteti"
                            value={universityForm.officialUniversityName} onChange={(e) => uf('officialUniversityName', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Qisqa nomi *</label>
                          <input className={styles.input} required placeholder="TDTU"
                            value={universityForm.shortName} onChange={(e) => uf('shortName', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Rasmiy manzil *</label>
                          <input className={styles.input} required
                            value={universityForm.officialAddress} onChange={(e) => uf('officialAddress', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Telefon *</label>
                          <input className={styles.input} required
                            value={universityForm.contactPhoneNumber} onChange={(e) => uf('contactPhoneNumber', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Rasmiy email *</label>
                          <input className={styles.input} type="email" required
                            value={universityForm.officialEmailAddress} onChange={(e) => uf('officialEmailAddress', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Veb-sayt</label>
                          <input className={styles.input} placeholder="https://"
                            value={universityForm.website} onChange={(e) => uf('website', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formSection}>
                      <p className={styles.formSectionTitle}><User size={16} /> Mas&#39;ul shaxs</p>
                      <div className={styles.formGrid}>
                        <div className={styles.field}>
                          <label className={styles.label}>To&#39;liq ismi *</label>
                          <input className={styles.input} required
                            value={universityForm.responsiblePersonFullName} onChange={(e) => uf('responsiblePersonFullName', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Lavozimi *</label>
                          <input className={styles.input} required
                            value={universityForm.responsiblePersonPosition} onChange={(e) => uf('responsiblePersonPosition', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Telefon *</label>
                          <input className={styles.input} required
                            value={universityForm.responsiblePersonPhone} onChange={(e) => uf('responsiblePersonPhone', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Email *</label>
                          <input className={styles.input} type="email" required
                            value={universityForm.responsiblePersonEmail} onChange={(e) => uf('responsiblePersonEmail', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formSection}>
                      <p className={styles.formSectionTitle}><CreditCard size={16} /> Moliyaviy ma&#39;lumotlar</p>
                      <div className={styles.formGrid}>
                        <div className={styles.field}>
                          <label className={styles.label}>Bank hisob raqami *</label>
                          <input className={styles.input} required
                            value={universityForm.bankAccountNumber} onChange={(e) => uf('bankAccountNumber', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Soliq raqami (INN) *</label>
                          <input className={styles.input} required
                            value={universityForm.organizationTaxNumber} onChange={(e) => uf('organizationTaxNumber', e.target.value)} />
                        </div>
                        <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                          <label className={styles.label}>To&#39;lov qabul qilish ma&#39;lumoti *</label>
                          <input className={styles.input} required
                            value={universityForm.paymentReceivingInformation} onChange={(e) => uf('paymentReceivingInformation', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formSection}>
                      <p className={styles.formSectionTitle}><Lock size={16} /> Xavfsizlik</p>
                      <div className={styles.formGrid}>
                        <div className={styles.field}>
                          <label className={styles.label}>Parol *</label>
                          <div className={styles.inputWrap}>
                            <input type={showPw ? 'text' : 'password'} minLength={8} required
                              className={`${styles.input} ${styles.withIcon}`}
                              value={universityForm.password} onChange={(e) => uf('password', e.target.value)} />
                            <button type="button" className={styles.eyeBtn} onClick={() => setShowPw((v) => !v)}>
                              <EyeIcon open={showPw} />
                            </button>
                          </div>
                          <PasswordStrength password={universityForm.password} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Parolni tasdiqlash *</label>
                          <div className={styles.inputWrap}>
                            <input type={showPwConfirm ? 'text' : 'password'} minLength={8} required
                              className={`${styles.input} ${styles.withIcon}`}
                              value={universityForm.passwordConfirmation} onChange={(e) => uf('passwordConfirmation', e.target.value)} />
                            <button type="button" className={styles.eyeBtn} onClick={() => setShowPwConfirm((v) => !v)}>
                              <EyeIcon open={showPwConfirm} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.pendingNote}>
                      <Clock size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>Arizangiz yuborilgandan keyin <strong>1-3 ish kuni</strong> ichida tekshiriladi va siz email orqali xabardor qilinasiz.</span>
                    </div>
                  </>
                )}

                {/* ---- PRIVATE PROVIDER FORM ---- */}
                {providerFlow === 'PRIVATE_PROVIDER' && (
                  <>
                    <h1 className={styles.title}>Xususiy turar joy egasi</h1>
                    <p className={styles.subtitle}>Listinglar joylashdan oldin OneID tekshiruvi talab qilinadi</p>

                    <div className={styles.formSection}>
                      <p className={styles.formSectionTitle}><User size={16} /> Shaxsiy ma&#39;lumotlar</p>
                      <div className={styles.formGrid}>
                        <div className={styles.field}>
                          <label className={styles.label}>To&#39;liq ism *</label>
                          <input className={styles.input} required
                            value={privateForm.fullName} onChange={(e) => pf('fullName', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Tug&#39;ilgan sana *</label>
                          <input className={styles.input} type="date" required
                            value={privateForm.dateOfBirth} onChange={(e) => pf('dateOfBirth', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Telefon *</label>
                          <input className={styles.input} required placeholder="+998 90 000 00 00"
                            value={privateForm.phoneNumber} onChange={(e) => pf('phoneNumber', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Email *</label>
                          <input className={styles.input} type="email" required
                            value={privateForm.emailAddress} onChange={(e) => pf('emailAddress', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formSection}>
                      <p className={styles.formSectionTitle}><Home size={16} /> Mulk ma&#39;lumotlari</p>
                      <div className={styles.formGrid}>
                        <div className={styles.field}>
                          <label className={styles.label}>Mulk turi *</label>
                          <select className={styles.input}
                            value={privateForm.propertyType} onChange={(e) => pf('propertyType', e.target.value)}>
                            <option value="Apartment">Kvartira</option>
                            <option value="House">Hovli</option>
                            <option value="Hostel">Xostel</option>
                            <option value="Room">Xona</option>
                          </select>
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Viloyat *</label>
                          <input className={styles.input} required placeholder="Toshkent"
                            value={privateForm.region} onChange={(e) => pf('region', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Tuman *</label>
                          <input className={styles.input} required
                            value={privateForm.district} onChange={(e) => pf('district', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>To&#39;liq manzil *</label>
                          <input className={styles.input} required
                            value={privateForm.address} onChange={(e) => pf('address', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formSection}>
                      <p className={styles.formSectionTitle}><Lock size={16} /> Xavfsizlik</p>
                      <div className={styles.formGrid}>
                        <div className={styles.field}>
                          <label className={styles.label}>Parol *</label>
                          <div className={styles.inputWrap}>
                            <input type={showPw ? 'text' : 'password'} minLength={8} required
                              className={`${styles.input} ${styles.withIcon}`}
                              value={privateForm.password} onChange={(e) => pf('password', e.target.value)} />
                            <button type="button" className={styles.eyeBtn} onClick={() => setShowPw((v) => !v)}>
                              <EyeIcon open={showPw} />
                            </button>
                          </div>
                          <PasswordStrength password={privateForm.password} />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Parolni tasdiqlash *</label>
                          <div className={styles.inputWrap}>
                            <input type={showPwConfirm ? 'text' : 'password'} minLength={8} required
                              className={`${styles.input} ${styles.withIcon}`}
                              value={privateForm.passwordConfirmation} onChange={(e) => pf('passwordConfirmation', e.target.value)} />
                            <button type="button" className={styles.eyeBtn} onClick={() => setShowPwConfirm((v) => !v)}>
                              <EyeIcon open={showPwConfirm} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Error */}
                {error && (
                  <div className={styles.error}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                )}

                <div className={styles.btnRow}>
                  <button
                    type="button"
                    className={styles.btnOutline}
                    onClick={() => {
                      if (mainFlow === 'provider' && providerFlow) {
                        setProviderFlow(null);
                      } else {
                        setMainFlow(null);
                      }
                    }}
                  >
                    ← Orqaga
                  </button>
                  <button type="submit" className={styles.btnPrimary} disabled={loading}>
                    {loading ? 'Yuborilmoqda...' : submitLabel}
                  </button>
                </div>
              </form>
            )}

            {/* ===== BOTTOM LINK ===== */}
            <p className={styles.bottomLink}>
              Hisobingiz bormi?{' '}
              <Link href="/auth/login">Kirish</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
