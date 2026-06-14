import { getApplications, getNotifications, getPayments, getQueue } from "@/lib/data";
import { formatMoney } from "@/lib/format";

export default function StudentDashboardPage() {
  const studentId = "s1";
  const applications = getApplications(studentId);
  const payments = getPayments(studentId);
  const queue = getQueue().filter((q) => q.studentId === studentId);
  const notifications = getNotifications(studentId);

  return (
    <main>
      <h1>Student Dashboard</h1>
      <p className="muted">Authenticated through OneID flow (integration-ready API included).</p>

      <section className="grid grid-3">
        <article className="card">
          <h3>Application Status</h3>
          {applications.length === 0 ? <p>No applications yet.</p> : null}
          {applications.map((app) => (
            <div key={app.id} className="kv">
              <span>{app.housingId}</span>
              <strong>{app.status}</strong>
            </div>
          ))}
        </article>

        <article className="card">
          <h3>Queue Position</h3>
          {queue.length === 0 ? <p>Not in queue.</p> : null}
          {queue.map((q) => (
            <div key={q.id}>
              <div className="kv">
                <span>Housing</span>
                <strong>{q.housingId}</strong>
              </div>
              <div className="kv">
                <span>Position</span>
                <strong>{q.position}</strong>
              </div>
              <div className="kv">
                <span>Priority score</span>
                <strong>{q.priorityScore}</strong>
              </div>
            </div>
          ))}
        </article>

        <article className="card">
          <h3>Payments</h3>
          {payments.length === 0 ? <p>No payments yet.</p> : null}
          {payments.map((p) => (
            <div key={p.id} className="kv">
              <span>{p.paymentId}</span>
              <strong>{formatMoney(p.amount)}</strong>
            </div>
          ))}
          <a className="btn btn-primary" href="/api/payments?studentId=s1" style={{ marginTop: 10 }}>
            Download receipts
          </a>
        </article>
      </section>

      <section className="section card">
        <h2>Notifications</h2>
        {notifications.length === 0 ? <p className="muted">No notifications yet.</p> : null}
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
