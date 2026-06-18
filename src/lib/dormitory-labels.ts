import type { BedGender, BookingStatus } from "@/lib/dormitory-types";

export const BOOKING_STATUS_LABELS: Record<BookingStatus, { label: string; tone: string }> = {
  PENDING: { label: "Kutilmoqda", tone: "pending" },
  APPROVED: { label: "Tasdiqlangan", tone: "approved" },
  CHECKED_IN: { label: "Yashayapti", tone: "checkedIn" },
  REJECTED: { label: "Rad etilgan", tone: "rejected" },
  CHECKED_OUT: { label: "Chiqib ketgan", tone: "checkedOut" }
};

export const GENDER_LABELS: Record<BedGender, string> = {
  MALE: "Yigitlar",
  FEMALE: "Qizlar"
};

// Date.toLocaleDateString output for "uz-UZ" can differ between Node
// (server) and the browser's bundled ICU data, which breaks SSR hydration.
// A manual DD.MM.YYYY format using UTC fields keeps server and client
// output identical regardless of either side's local timezone.
export function formatDate(iso: string) {
  const d = new Date(iso);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${d.getUTCFullYear()}`;
}
