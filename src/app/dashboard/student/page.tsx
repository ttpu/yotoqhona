import { getApplications, getNotifications, getPayments, getQueue } from "@/lib/data";
import { formatMoney } from "@/lib/format";

export default function StudentDashboardPage({ searchParams }: { searchParams: { status?: string; verified?: string } }) {
  const studentId = "s1";
  const status = searchParams.status ?? "ACTIVE";
  const verified = searchParams.verified === "true";
  const applications = getApplications(studentId);
  const payments = getPayments(studentId);
  const queue = getQueue().filter((q) => q.studentId === studentId);
  const notifications = getNotifications(studentId);

  return (
    <main>
      <section className="dashboard-hero">
        <h1>Talaba kabineti</h1>
        <p className="muted">Arizalar, navbat, to&#39;lovlar va bildirishnomalarni bir joyda boshqaring.</p>
      </section>

      <section className="status-banner">
        <strong>Account status: {status}</strong>
        <p>{verified ? "Verified Student badge faollashgan" : "OneID orqali shaxsni tasdiqlab Verified Student badge oling"}</p>
      </section>

      {!verified ? (
        <section className="status-banner status-banner-warning">
          <strong>Verify your identity through OneID to receive a Verified Student badge.</strong>
          <p>
            Verified profil sizga ishonch darajasi va ayrim arizalarda ustuvorlik beradi. Profil sozlamalarida OneID ni bog&#39;lang.
          </p>
        </section>
      ) : null}

      <section className="grid grid-3">
        <article className="card">
          <h3>Ariza holati</h3>
          {applications.length === 0 ? <p>Hali arizalar yo&#39;q.</p> : null}
          {applications.map((app) => (
            <div key={app.id} className="kv">
              <span>{app.housingId}</span>
              <strong>{app.status}</strong>
            </div>
          ))}
        </article>

        <article className="card">
          <h3>Navbat o&#39;rni</h3>
          {queue.length === 0 ? <p>Navbatda emassiz.</p> : null}
          {queue.map((q) => (
            <div key={q.id}>
              <div className="kv">
                <span>Turar joy</span>
                <strong>{q.housingId}</strong>
              </div>
              <div className="kv">
                <span>O&#39;rin</span>
                <strong>{q.position}</strong>
              </div>
              <div className="kv">
                <span>Ustuvorlik bali</span>
                <strong>{q.priorityScore}</strong>
              </div>
            </div>
          ))}
        </article>

        <article className="card">
          <h3>To&#39;lovlar</h3>
          {payments.length === 0 ? <p>Hali to&#39;lovlar yo&#39;q.</p> : null}
          {payments.map((p) => (
            <div key={p.id} className="kv">
              <span>{p.paymentId}</span>
              <strong>{formatMoney(p.amount)}</strong>
            </div>
          ))}
          <a className="btn btn-primary" href="/api/payments?studentId=s1" style={{ marginTop: 10 }}>
            Cheklarni yuklash
          </a>
        </article>
      </section>

      <section className="section card">
        <h2>Bildirishnomalar</h2>
        {notifications.length === 0 ? <p className="muted">Hali bildirishnomalar yo&#39;q.</p> : null}
        {notifications.map((n) => (
          <div className="kv" key={n.id}>
            <span>{n.type}</span>
            <strong>{n.channel}</strong>
          </div>
        ))}
      </section>
    </main>
  );
}
