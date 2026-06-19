import { promises as fs } from "fs";
import path from "path";
import { Invoice, InvoiceStatus, PaymentProvider } from "@/lib/payment-types";

const dataDir = path.join(process.cwd(), "data");
const invoicesFile = path.join(dataDir, "invoices.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(invoicesFile);
  } catch {
    await fs.writeFile(invoicesFile, "[]", "utf8");
  }
}

async function readInvoices(): Promise<Invoice[]> {
  await ensureStore();
  const raw = await fs.readFile(invoicesFile, "utf8");
  return JSON.parse(raw) as Invoice[];
}

async function writeInvoices(invoices: Invoice[]) {
  await ensureStore();
  await fs.writeFile(invoicesFile, JSON.stringify(invoices, null, 2), "utf8");
}

// Invoices are only ever persisted as UNPAID or PAID — "overdue" is purely
// a function of an unpaid invoice's due date vs. now, computed on read so
// there's no need for a background job to "expire" anything.
function withDerivedStatus(invoice: Invoice): Invoice {
  if (invoice.status === "UNPAID" && Date.parse(invoice.dueDate) < Date.now()) {
    return { ...invoice, status: "OVERDUE" };
  }
  return invoice;
}

export async function seedInvoices(invoices: Invoice[]) {
  const existing = await readInvoices();
  await writeInvoices([...existing, ...invoices]);
}

export async function hasAnyInvoices(): Promise<boolean> {
  const invoices = await readInvoices();
  return invoices.length > 0;
}

export async function getInvoicesForStudent(studentId: string): Promise<Invoice[]> {
  const invoices = await readInvoices();
  return invoices
    .filter((i) => i.studentId === studentId)
    .map(withDerivedStatus)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const invoices = await readInvoices();
  const found = invoices.find((i) => i.id === id);
  return found ? withDerivedStatus(found) : null;
}

export type UniversitySummary = {
  collected: number;
  outstanding: number;
  overdueCount: number;
  unpaidCount: number;
  paidCount: number;
};

export async function getInvoicesForUniversity(
  universityId: string,
  filters?: { status?: InvoiceStatus; search?: string }
): Promise<Invoice[]> {
  const invoices = await readInvoices();
  let rows = invoices.filter((i) => i.universityId === universityId).map(withDerivedStatus);

  if (filters?.status) rows = rows.filter((r) => r.status === filters.status);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    rows = rows.filter((r) => r.studentName.toLowerCase().includes(q) || (r.roomLabel ?? "").toLowerCase().includes(q));
  }

  return rows.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function getUniversitySummary(universityId: string): Promise<UniversitySummary> {
  const invoices = await readInvoices();
  const rows = invoices.filter((i) => i.universityId === universityId).map(withDerivedStatus);

  return {
    collected: rows.filter((r) => r.status === "PAID").reduce((sum, r) => sum + r.amount, 0),
    outstanding: rows.filter((r) => r.status !== "PAID").reduce((sum, r) => sum + r.amount, 0),
    overdueCount: rows.filter((r) => r.status === "OVERDUE").length,
    unpaidCount: rows.filter((r) => r.status === "UNPAID").length,
    paidCount: rows.filter((r) => r.status === "PAID").length
  };
}

export async function payInvoice(invoiceId: string, studentId: string, provider: PaymentProvider) {
  const invoices = await readInvoices();
  const idx = invoices.findIndex((i) => i.id === invoiceId);
  if (idx === -1) throw new Error("Hisob-faktura topilmadi");
  if (invoices[idx].studentId !== studentId) throw new Error("Bu amalga ruxsatingiz yo'q");
  if (invoices[idx].status === "PAID") throw new Error("Bu hisob-faktura allaqachon to'langan");

  invoices[idx] = {
    ...invoices[idx],
    status: "PAID",
    paidAt: new Date().toISOString(),
    paymentProvider: provider
  };
  await writeInvoices(invoices);
  return invoices[idx];
}
