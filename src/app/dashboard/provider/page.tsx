export default function ProviderDashboardPage({
  searchParams
}: {
  searchParams: { status?: string; type?: string; oneid?: string };
}) {
  const status = searchParams.status ?? "PENDING_VERIFICATION";
  const providerType = searchParams.type ?? "UNIVERSITY";
  const oneIdRequired = searchParams.oneid === "required";

  return (
    <main>
      <section className="dashboard-hero">
        <h1>Provayder kabineti</h1>
        <p className="muted">Listinglar, tekshiruv holati va keyingi amallarni bitta interfeysda boshqaring.</p>
      </section>

      <section className="status-banner">
        <strong>Account status: {status}</strong>
        <p>
          {status === "PENDING_VERIFICATION"
            ? "Hisobingiz tekshiruvda. Tasdiqlangach public listing joylashtirish funksiyasi ochiladi."
            : "Hisob faol. Listinglar joylashtirish va boshqarish mumkin."}
        </p>
      </section>

      {oneIdRequired ? (
        <section className="status-banner status-banner-warning">
          <strong>OneID verification required</strong>
          <p>
            Xususiy provayderlar uchun shaxsni tasdiqlash, aloqa va mulk ma&#39;lumotlarini tekshirish talab qilinadi.
          </p>
        </section>
      ) : null}

      <section className="grid grid-2 section">
        <article className="card">
          <h2>Provayder turi</h2>
          <p>{providerType === "PRIVATE" ? "Private Housing Provider" : "University Housing Administration"}</p>
        </article>
        <article className="card">
          <h2>Keyingi bosqichlar</h2>
          <ul className="list">
            <li>Profil ma&#39;lumotlarini to&#39;ldirish</li>
            <li>Tekshiruv hujjatlarini tasdiqlash</li>
            <li>Uy-joy kartasini yaratish</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
