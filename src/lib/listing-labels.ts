import {
  Car,
  ChefHat,
  type LucideIcon,
  Plus,
  Refrigerator,
  ShowerHead,
  Snowflake,
  WashingMachine,
  Wifi
} from "lucide-react";
import {
  ListingAmenity,
  ListingRequirement,
  ListingStatus,
  ListingType
} from "@/lib/listing-types";

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  APARTMENT: "Kvartira",
  ROOM: "Xona",
  DORMITORY: "Yotoqxona",
  HOUSE: "Hovli / Uy"
};

export const AMENITY_LABELS: Record<ListingAmenity, { label: string; icon: LucideIcon }> = {
  WIFI: { label: "Wi-Fi", icon: Wifi },
  AC: { label: "Konditsioner", icon: Snowflake },
  WASHER: { label: "Kir yuvish mashinasi", icon: WashingMachine },
  FRIDGE: { label: "Muzlatgich", icon: Refrigerator },
  KITCHEN: { label: "Oshxona", icon: ChefHat },
  PARKING: { label: "Parking", icon: Car },
  HOT_WATER: { label: "Issiq suv", icon: ShowerHead },
  OTHER: { label: "Boshqa", icon: Plus }
};

export const REQUIREMENT_LABELS: Record<ListingRequirement, string> = {
  STUDENTS_ONLY: "Faqat talabalar uchun",
  GIRLS_ONLY: "Faqat qizlar uchun",
  BOYS_ONLY: "Faqat yigitlar uchun",
  NO_PETS: "Hayvonlarsiz",
  OTHER: "Boshqa shart"
};

export const STATUS_LABELS: Record<ListingStatus, { label: string; tone: "active" | "booked" | "unavailable" }> = {
  ACTIVE: { label: "Faol", tone: "active" },
  BOOKED: { label: "Band qilingan", tone: "booked" },
  UNAVAILABLE: { label: "Mavjud emas", tone: "unavailable" }
};

export const CURRENCY_LABELS: Record<"UZS" | "USD", string> = {
  UZS: "so'm",
  USD: "$"
};

export function formatListingPrice(price: number, currency: "UZS" | "USD") {
  // Intl.NumberFormat output for "uz-UZ" can differ between Node (server) and
  // the browser's bundled ICU data, which breaks SSR hydration. A manual
  // separator keeps server and client output byte-identical.
  const formatted = Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return currency === "USD" ? `$${formatted}` : `${formatted} so'm`;
}
