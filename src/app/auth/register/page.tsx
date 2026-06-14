"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

type MainFlow = "student" | "provider";
type ProviderFlow = "UNIVERSITY_ADMINISTRATION" | "PRIVATE_PROVIDER";

const baseStudentForm = {
  firstName: "",
  lastName: "",
  middleName: "",
  dateOfBirth: "",
  gender: "MALE",
  phoneNumber: "",
  email: "",
  address: "",
  university: "",
  faculty: "",
  course: "",
  studentIdNumber: "",
  password: "",
  passwordConfirmation: ""
};

const baseUniversityForm = {
  officialUniversityName: "",
  shortName: "",
  organizationType: "University",
  officialAddress: "",
  contactPhoneNumber: "",
  officialEmailAddress: "",
  website: "",
  responsiblePersonFullName: "",
  responsiblePersonPosition: "",
  responsiblePersonPhone: "",
  responsiblePersonEmail: "",
  bankAccountNumber: "",
  organizationTaxNumber: "",
  paymentReceivingInformation: "",
  registrationCertificate: "",
  authorizationLetter: "",
  supportingDocuments: "",
  password: "",
  passwordConfirmation: ""
};

const basePrivateProviderForm = {
  fullName: "",
  dateOfBirth: "",
  phoneNumber: "",
  emailAddress: "",
  propertyType: "Apartment",
  region: "",
  district: "",
  address: "",
  oneIdVerified: false,
  password: "",
  passwordConfirmation: ""
};

export default function RegisterPage() {
  const router = useRouter();
  const [mainFlow, setMainFlow] = useState<MainFlow | null>(null);
  const [providerFlow, setProviderFlow] = useState<ProviderFlow | null>(null);
  const [studentForm, setStudentForm] = useState(baseStudentForm);
  const [universityForm, setUniversityForm] = useState(baseUniversityForm);
  const [privateForm, setPrivateForm] = useState(basePrivateProviderForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitLabel = useMemo(() => {
    if (mainFlow === "student") return "Talaba akkauntini yaratish";
    if (providerFlow === "UNIVERSITY_ADMINISTRATION") return "Universitet akkauntini yuborish";
    if (providerFlow === "PRIVATE_PROVIDER") return "Provayder akkauntini yaratish";
    return "Davom etish";
  }, [mainFlow, providerFlow]);

  const isFormVisible =
    mainFlow === "student" || (mainFlow === "provider" && providerFlow !== null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload =
      mainFlow === "student"
        ? { flow: "student", ...studentForm }
        : providerFlow === "UNIVERSITY_ADMINISTRATION"
          ? { flow: "provider-university", providerType: providerFlow, ...universityForm }
          : { flow: "provider-private", providerType: "PRIVATE_PROVIDER", ...privateForm };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as { message?: string; redirectTo?: string };

      if (!response.ok || !data.redirectTo) {
        setError(data.message ?? "Ro'yxatdan o'tishda xatolik yuz berdi");
        return;
      }

      router.push(data.redirectTo as Route);
      router.refresh();
    } catch {
      setError("Tarmoq xatosi. Keyinroq qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <style jsx global>{`
        .footer { display: none; }
      `}</style>
      <section className="card register-wrap">
        <h1>TalabaJoy ro&#39;yxatdan o&#39;tish</h1>
        <p className="muted register-subtitle">TalabaJoy platformasidan qanday foydalanmoqchisiz?</p>

        <div className="register-choice-grid">
          <button
            type="button"
            className={`register-choice ${mainFlow === "student" ? "register-choice-active" : ""}`}
            onClick={() => {
              setMainFlow("student");
              setProviderFlow(null);
            }}
          >
            <h3>1. Talaba ro&#39;yxatdan o&#39;tishi</h3>
            <p>Uy-joy qidirish, ariza yuborish, navbat va to&#39;lovlarni kuzatish uchun.</p>
          </button>

          <button
            type="button"
            className={`register-choice ${mainFlow === "provider" ? "register-choice-active" : ""}`}
            onClick={() => setMainFlow("provider")}
          >
            <h3>2. Turar joy egasi ro&#39;yxatdan o&#39;tishi</h3>
            <p>Yotoqxona, xostel yoki ijaradagi uy-joy listinglarini joylashtirish uchun.</p>
          </button>
        </div>

        {mainFlow === "provider" ? (
          <div className="section">
            <p className="muted register-subtitle">Qaysi turdagi turar joy taqdimotchisisiz?</p>
            <div className="register-choice-grid">
              <button
                type="button"
                className={`register-choice ${providerFlow === "UNIVERSITY_ADMINISTRATION" ? "register-choice-active" : ""}`}
                onClick={() => setProviderFlow("UNIVERSITY_ADMINISTRATION")}
              >
                <h3>A. Universitet turar joy boshqarmasi</h3>
                <p>Universitetlar, kollejlar va rasmiy talabalar turar joylari uchun.</p>
              </button>
              <button
                type="button"
                className={`register-choice ${providerFlow === "PRIVATE_PROVIDER" ? "register-choice-active" : ""}`}
                onClick={() => setProviderFlow("PRIVATE_PROVIDER")}
              >
                <h3>B. Xususiy turar joy egasi</h3>
                <p>Kvartira, hovli va xostel egalarining listing joylashtirish oqimi.</p>
              </button>
            </div>
          </div>
        ) : null}

        {isFormVisible ? (
          <form className="section" onSubmit={onSubmit}>
            {mainFlow === "student" ? (
              <>
                <h2>Talaba ma&#39;lumotlari</h2>
                <div className="grid grid-2">
                  <div>
                    <label>Ism</label>
                    <input required value={studentForm.firstName} onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })} />
                  </div>
                  <div>
                    <label>Familiya</label>
                    <input required value={studentForm.lastName} onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })} />
                  </div>
                  <div>
                    <label>Otasining ismi (ixtiyoriy)</label>
                    <input value={studentForm.middleName} onChange={(e) => setStudentForm({ ...studentForm, middleName: e.target.value })} />
                  </div>
                  <div>
                    <label>Tug&#39;ilgan sana</label>
                    <input type="date" required value={studentForm.dateOfBirth} onChange={(e) => setStudentForm({ ...studentForm, dateOfBirth: e.target.value })} />
                  </div>
                  <div>
                    <label>Jins</label>
                    <select value={studentForm.gender} onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}>
                      <option value="MALE">Erkak</option>
                      <option value="FEMALE">Ayol</option>
                    </select>
                  </div>
                  <div>
                    <label>Telefon raqami</label>
                    <input required value={studentForm.phoneNumber} onChange={(e) => setStudentForm({ ...studentForm, phoneNumber: e.target.value })} />
                  </div>
                  <div>
                    <label>Email manzil</label>
                    <input type="email" required value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} />
                  </div>
                  <div>
                    <label>Doimiy manzil / ro&#39;yxatdan o&#39;tgan joy</label>
                    <input required value={studentForm.address} onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })} />
                  </div>
                  <div>
                    <label>Universitet</label>
                    <input required value={studentForm.university} onChange={(e) => setStudentForm({ ...studentForm, university: e.target.value })} />
                  </div>
                  <div>
                    <label>Fakultet</label>
                    <input required value={studentForm.faculty} onChange={(e) => setStudentForm({ ...studentForm, faculty: e.target.value })} />
                  </div>
                  <div>
                    <label>Kurs / o&#39;qish yili</label>
                    <input required value={studentForm.course} onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })} />
                  </div>
                  <div>
                    <label>Talabalik ID raqami (ixtiyoriy)</label>
                    <input value={studentForm.studentIdNumber} onChange={(e) => setStudentForm({ ...studentForm, studentIdNumber: e.target.value })} />
                  </div>
                  <div>
                    <label>Parol</label>
                    <input type="password" minLength={8} required value={studentForm.password} onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} />
                    <p className="field-hint">Kamida 8 ta belgi bo&#39;lishi kerak. Harf va raqam ishlatish tavsiya etiladi.</p>
                  </div>
                  <div>
                    <label>Parolni tasdiqlash</label>
                    <input type="password" minLength={8} required value={studentForm.passwordConfirmation} onChange={(e) => setStudentForm({ ...studentForm, passwordConfirmation: e.target.value })} />
                  </div>
                </div>
                <div className="verify-note">
                  OneID orqali shaxsingizni tasdiqlang va Verified Student nishonini oling.
                </div>
              </>
            ) : null}

            {providerFlow === "UNIVERSITY_ADMINISTRATION" ? (
              <>
                <h2>Universitet turar joy boshqarmasi</h2>
                <p className="muted">Hisob yaratilgach status Pending Verification bo&#39;ladi.</p>
                <div className="grid grid-2">
                  <div><label>Official University Name</label><input required value={universityForm.officialUniversityName} onChange={(e) => setUniversityForm({ ...universityForm, officialUniversityName: e.target.value })} /></div>
                  <div><label>University Short Name</label><input required value={universityForm.shortName} onChange={(e) => setUniversityForm({ ...universityForm, shortName: e.target.value })} /></div>
                  <div><label>Organization Type</label><input required value={universityForm.organizationType} onChange={(e) => setUniversityForm({ ...universityForm, organizationType: e.target.value })} /></div>
                  <div><label>Official Address</label><input required value={universityForm.officialAddress} onChange={(e) => setUniversityForm({ ...universityForm, officialAddress: e.target.value })} /></div>
                  <div><label>Contact Phone Number</label><input required value={universityForm.contactPhoneNumber} onChange={(e) => setUniversityForm({ ...universityForm, contactPhoneNumber: e.target.value })} /></div>
                  <div><label>Official Email Address</label><input type="email" required value={universityForm.officialEmailAddress} onChange={(e) => setUniversityForm({ ...universityForm, officialEmailAddress: e.target.value })} /></div>
                  <div><label>Website (optional)</label><input value={universityForm.website} onChange={(e) => setUniversityForm({ ...universityForm, website: e.target.value })} /></div>
                  <div><label>Responsible Person Full Name</label><input required value={universityForm.responsiblePersonFullName} onChange={(e) => setUniversityForm({ ...universityForm, responsiblePersonFullName: e.target.value })} /></div>
                  <div><label>Position</label><input required value={universityForm.responsiblePersonPosition} onChange={(e) => setUniversityForm({ ...universityForm, responsiblePersonPosition: e.target.value })} /></div>
                  <div><label>Responsible Person Phone Number</label><input required value={universityForm.responsiblePersonPhone} onChange={(e) => setUniversityForm({ ...universityForm, responsiblePersonPhone: e.target.value })} /></div>
                  <div><label>Responsible Person Email</label><input type="email" required value={universityForm.responsiblePersonEmail} onChange={(e) => setUniversityForm({ ...universityForm, responsiblePersonEmail: e.target.value })} /></div>
                  <div><label>Bank Account Number</label><input required value={universityForm.bankAccountNumber} onChange={(e) => setUniversityForm({ ...universityForm, bankAccountNumber: e.target.value })} /></div>
                  <div><label>Organization Tax Number</label><input required value={universityForm.organizationTaxNumber} onChange={(e) => setUniversityForm({ ...universityForm, organizationTaxNumber: e.target.value })} /></div>
                  <div><label>Payment Receiving Information</label><input required value={universityForm.paymentReceivingInformation} onChange={(e) => setUniversityForm({ ...universityForm, paymentReceivingInformation: e.target.value })} /></div>
                  <div><label>Registration Certificate</label><input value={universityForm.registrationCertificate} onChange={(e) => setUniversityForm({ ...universityForm, registrationCertificate: e.target.value })} placeholder="Hujjat nomi yoki havola" /></div>
                  <div><label>Authorization Letter</label><input value={universityForm.authorizationLetter} onChange={(e) => setUniversityForm({ ...universityForm, authorizationLetter: e.target.value })} placeholder="Hujjat nomi yoki havola" /></div>
                  <div><label>Supporting Documents</label><input value={universityForm.supportingDocuments} onChange={(e) => setUniversityForm({ ...universityForm, supportingDocuments: e.target.value })} placeholder="Hujjat nomi yoki havola" /></div>
                  <div><label>Parol</label><input type="password" minLength={8} required value={universityForm.password} onChange={(e) => setUniversityForm({ ...universityForm, password: e.target.value })} /><p className="field-hint">Kamida 8 ta belgi bo&#39;lishi kerak.</p></div>
                  <div><label>Parolni tasdiqlash</label><input type="password" minLength={8} required value={universityForm.passwordConfirmation} onChange={(e) => setUniversityForm({ ...universityForm, passwordConfirmation: e.target.value })} /></div>
                </div>
              </>
            ) : null}

            {providerFlow === "PRIVATE_PROVIDER" ? (
              <>
                <h2>Xususiy turar joy egasi</h2>
                <p className="muted">Listinglar joylashdan oldin OneID va davlat verifikatsiyasi talab qilinadi.</p>
                <div className="grid grid-2">
                  <div><label>Full Name</label><input required value={privateForm.fullName} onChange={(e) => setPrivateForm({ ...privateForm, fullName: e.target.value })} /></div>
                  <div><label>Date of Birth</label><input type="date" required value={privateForm.dateOfBirth} onChange={(e) => setPrivateForm({ ...privateForm, dateOfBirth: e.target.value })} /></div>
                  <div><label>Phone Number</label><input required value={privateForm.phoneNumber} onChange={(e) => setPrivateForm({ ...privateForm, phoneNumber: e.target.value })} /></div>
                  <div><label>Email Address</label><input type="email" required value={privateForm.emailAddress} onChange={(e) => setPrivateForm({ ...privateForm, emailAddress: e.target.value })} /></div>
                  <div><label>Property Type</label><input required value={privateForm.propertyType} onChange={(e) => setPrivateForm({ ...privateForm, propertyType: e.target.value })} /></div>
                  <div><label>Region</label><input required value={privateForm.region} onChange={(e) => setPrivateForm({ ...privateForm, region: e.target.value })} /></div>
                  <div><label>District</label><input required value={privateForm.district} onChange={(e) => setPrivateForm({ ...privateForm, district: e.target.value })} /></div>
                  <div><label>Address</label><input required value={privateForm.address} onChange={(e) => setPrivateForm({ ...privateForm, address: e.target.value })} /></div>
                  <div><label>Parol</label><input type="password" minLength={8} required value={privateForm.password} onChange={(e) => setPrivateForm({ ...privateForm, password: e.target.value })} /><p className="field-hint">Kamida 8 ta belgi bo&#39;lishi kerak.</p></div>
                  <div><label>Parolni tasdiqlash</label><input type="password" minLength={8} required value={privateForm.passwordConfirmation} onChange={(e) => setPrivateForm({ ...privateForm, passwordConfirmation: e.target.value })} /></div>
                </div>
              </>
            ) : null}

            {error ? <p className="register-error">{error}</p> : null}

            <div className="register-actions">
              <button disabled={loading} className="btn btn-primary" type="submit">
                {loading ? "Yuborilmoqda..." : submitLabel}
              </button>
            </div>
          </form>
        ) : null}
      </section>
    </main>
  );
}
