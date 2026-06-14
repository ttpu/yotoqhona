import { getHousing, getPayments, getQueue, getStats } from "@/lib/data";
import { formatMoney } from "@/lib/format";

export default function AdminDashboardPage({ searchParams }: { searchParams: { mode?: string } }) {
  const mode = searchParams.mode ?? "university";
  const housing = getHousing();
  const queue = getQueue();
  const payments = getPayments();
  const stats = getStats();

  return (
    <main>
      <section className="dashboard-hero">
        <h1>
          {mode === "super"
            ? "Super administrator paneli"
            : mode === "landlord"
              ? "Xususiy provayder paneli"
              : "Universitet / xostel boshqaruv paneli"}
        </h1>
        <p className="muted">Obyektlar, arizalar, navbat va to&#39;lov tahlilini zamonaviy boshqaruv panelida kuzating.</p>
      </section>

      <section className="grid grid-4">
        <article className="card">
          <div className="metric">{housing.length}</div>
          <div className="muted">Boshqarilayotgan obyektlar</div>
        </article>
        <article className="card">
          <div className="metric">{queue.length}</div>
          <div className="muted">Navbat yozuvlari</div>
        </article>
        <article className="card">
          <div className="metric">{stats.totalApplications}</div>
          <div className="muted">Arizalar</div>
        </article>
        <article className="card">
          <div className="metric">{formatMoney(stats.monthlyRevenue)}</div>
          <div className="muted">Oylik tushum</div>
        </article>
      </section>

      <section className="section grid grid-2">
        <article className="card">
          <h2>Turar joy boshqaruvi</h2>
          <ul className="list">
            <li>Yotoqxona, xostel va kvartiralarni yaratish va tahrirlash</li>
            <li>Bino, xona va o&#39;rinlarni boshqarish</li>
            <li>Jins bo&#39;yicha cheklov va tasdiq statuslarini sozlash</li>
          </ul>
          <a className="btn btn-primary" href="/api/housing">
            Housing API ochish
          </a>
        </article>

        <article className="card">
          <h2>Ariza va navbat boshqaruvi</h2>
          <ul className="list">
            <li>Arizalarni tasdiqlash yoki rad etish</li>
            <li>Navbat ustuvorligini kuzatish</li>
            <li>Bo&#39;sh joy uchun rezerv va jarayonlarni ishga tushirish</li>
          </ul>
          <a className="btn btn-primary" href="/api/queue">
            Queue API ochish
          </a>
        </article>
      </section>

      <section className="section card">
        <h2>To&#39;lov monitoringi</h2>
        <p className="muted">Integratsiya qilingan kanallar: Click, Payme, Uzum, Paynet.</p>
        <a className="btn btn-primary" href="/api/payments">
          Payment API ochish
        </a>
      </section>
    </main>
  );
}
