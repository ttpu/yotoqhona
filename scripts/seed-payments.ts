/**
 * Seeds demo dormitory invoices (rent) for every checked-in student, with a
 * realistic mix of paid history, unpaid current dues, and a few overdue.
 * Safe to re-run — skips entirely if any invoice already exists (delete
 * data/invoices.json to reseed).
 *
 * Usage: npm run seed:payments
 * Requires: npm run seed:dormitory to have been run first.
 */
import { promises as fs } from "fs";
import path from "path";
import { findUserByEmail } from "../src/lib/auth-store";
import { hasAnyInvoices, seedInvoices } from "../src/lib/payments-store";
import type { Invoice } from "../src/lib/payment-types";
import type { RoomBooking } from "../src/lib/dormitory-types";

const MONTHLY_RENT = 350_000;

async function main() {
  const university = await findUserByEmail("demo.university@talabajoy.uz");
  if (!university) {
    console.error("demo.university@talabajoy.uz not found — run `npm run seed:demo` first.");
    process.exit(1);
  }
  const universityId = university.id;

  if (await hasAnyInvoices()) {
    console.log("Invoices already seeded — skipping. Delete data/invoices.json to reseed.");
    return;
  }

  const bookingsPath = path.join(process.cwd(), "data", "dorm-bookings.json");
  const raw = await fs.readFile(bookingsPath, "utf8").catch(() => "[]");
  const bookings = JSON.parse(raw) as RoomBooking[];
  const checkedIn = bookings.filter((b) => b.status === "CHECKED_IN");

  if (checkedIn.length === 0) {
    console.error("No checked-in bookings found — run `npm run seed:dormitory` first.");
    process.exit(1);
  }

  const demoStudent = await findUserByEmail("demo.student@talabajoy.uz");
  const now = Date.now();
  const DAY = 86_400_000;

  function monthTitle(monthsAgo: number) {
    const d = new Date(now - monthsAgo * 30 * DAY);
    const months = [
      "yanvar", "fevral", "mart", "aprel", "may", "iyun",
      "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr"
    ];
    return `${d.getUTCFullYear()}-yil ${months[d.getUTCMonth()]} oyi uchun yotoqxona haqi`;
  }

  const invoices: Invoice[] = [];

  function addInvoicesForBooking(booking: RoomBooking, overdueChance: number) {
    const roomLabel = `${booking.floorNumber}-qavat, ${booking.roomNumber}-xona`;

    // Two paid months in the past.
    for (const monthsAgo of [2, 1]) {
      invoices.push({
        id: crypto.randomUUID(),
        studentId: booking.studentId,
        studentName: booking.studentName,
        universityId,
        roomLabel,
        title: monthTitle(monthsAgo),
        amount: MONTHLY_RENT,
        currency: "UZS",
        dueDate: new Date(now - monthsAgo * 30 * DAY).toISOString(),
        status: "PAID",
        paidAt: new Date(now - monthsAgo * 30 * DAY + 2 * DAY).toISOString(),
        paymentProvider: Math.random() < 0.5 ? "PAYME" : "CLICK",
        createdAt: new Date(now - (monthsAgo + 1) * 30 * DAY).toISOString()
      });
    }

    // Current month: unpaid, sometimes already overdue.
    const isOverdue = Math.random() < overdueChance;
    const dueDate = isOverdue ? now - 5 * DAY : now + 10 * DAY;
    invoices.push({
      id: crypto.randomUUID(),
      studentId: booking.studentId,
      studentName: booking.studentName,
      universityId,
      roomLabel,
      title: monthTitle(0),
      amount: MONTHLY_RENT,
      currency: "UZS",
      dueDate: new Date(dueDate).toISOString(),
      status: "UNPAID",
      createdAt: new Date(now - 25 * DAY).toISOString()
    });
  }

  for (const booking of checkedIn) {
    if (demoStudent && booking.studentId === demoStudent.id) continue; // handled explicitly below
    addInvoicesForBooking(booking, 0.18);
  }

  if (demoStudent) {
    const demoBooking = checkedIn.find((b) => b.studentId === demoStudent.id);
    if (demoBooking) {
      addInvoicesForBooking(demoBooking, 1); // guarantee an overdue invoice for the demo account
    }
  }

  await seedInvoices(invoices);
  console.log(`Seeded ${invoices.length} invoices for ${checkedIn.length} checked-in students.`);
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
