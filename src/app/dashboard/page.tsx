import Link from "next/link";
import type { Route } from "next";

const roles = [
  {
    title: "Student Dashboard",
    path: "/dashboard/student" as Route,
    details: "Applications, queue position, payments, receipts, notifications"
  },
  {
    title: "University/Hostel Admin Dashboard",
    path: "/dashboard/admin" as Route,
    details: "Buildings, rooms, beds, approvals, queue control, reports"
  },
  {
    title: "Private Landlord Dashboard",
    path: "/dashboard/provider?status=PENDING_VERIFICATION&type=PRIVATE&oneid=required" as Route,
    details: "Property listings, verification status, tenant approvals"
  },
  {
    title: "Super Admin Panel",
    path: "/dashboard/admin?mode=super" as Route,
    details: "Universities, provider verification, moderation, national analytics"
  }
];

export default function DashboardIndexPage() {
  return (
    <main>
      <h1>Dashboards</h1>
      <p className="muted">Role-based access control entry points across the SSHE platform.</p>
      <section className="grid grid-2">
        {roles.map((role) => (
          <article className="card" key={role.path}>
            <h2>{role.title}</h2>
            <p className="muted">{role.details}</p>
            <Link className="btn btn-primary" href={role.path}>
              Open
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
