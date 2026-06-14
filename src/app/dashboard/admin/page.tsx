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
      <h1>
        {mode === "super"
          ? "Super Administrator"
          : mode === "landlord"
            ? "Private Landlord"
            : "University / Hostel Administrator"}
      </h1>
      <p className="muted">Management dashboard for properties, applications, queue, and payment analytics.</p>

      <section className="grid grid-4">
        <article className="card">
          <div className="metric">{housing.length}</div>
          <div className="muted">Managed objects</div>
        </article>
        <article className="card">
          <div className="metric">{queue.length}</div>
          <div className="muted">Queue entries</div>
        </article>
        <article className="card">
          <div className="metric">{stats.totalApplications}</div>
          <div className="muted">Applications</div>
        </article>
        <article className="card">
          <div className="metric">{formatMoney(stats.monthlyRevenue)}</div>
          <div className="muted">Monthly revenue</div>
        </article>
      </section>

      <section className="section grid grid-2">
        <article className="card">
          <h2>Housing Management</h2>
          <ul className="list">
            <li>Create and edit dormitories, hostels, and apartments</li>
            <li>Manage buildings, rooms, and beds</li>
            <li>Set gender restrictions and verified status</li>
          </ul>
          <a className="btn btn-primary" href="/api/housing">
            Open housing API
          </a>
        </article>

        <article className="card">
          <h2>Application & Queue Operations</h2>
          <ul className="list">
            <li>Approve or reject applications</li>
            <li>Track queue ranking by priority score</li>
            <li>Trigger vacancy processing and reservation</li>
          </ul>
          <a className="btn btn-primary" href="/api/queue">
            Open queue API
          </a>
        </article>
      </section>

      <section className="section card">
        <h2>Payment Monitoring</h2>
        <p className="muted">Integrated channels: Click, Payme, Uzum, Paynet.</p>
        <a className="btn btn-primary" href="/api/payments">
          Open payment API
        </a>
      </section>
    </main>
  );
}
