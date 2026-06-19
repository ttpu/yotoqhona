export type PaymentProvider = "PAYME" | "CLICK";
export type InvoiceStatus = "UNPAID" | "PAID" | "OVERDUE";

export type Invoice = {
  id: string;
  studentId: string;
  studentName: string;
  universityId?: string;
  roomLabel?: string; // e.g. "2-qavat, 201-xona"
  title: string;
  amount: number;
  currency: "UZS";
  dueDate: string;
  status: InvoiceStatus;
  paidAt?: string;
  paymentProvider?: PaymentProvider;
  createdAt: string;
};
