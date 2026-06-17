import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseSessionCookie } from "@/lib/session";
import { deleteListingImageFiles, saveListingImages } from "@/lib/listing-upload";
import {
  deleteListing,
  getListingById,
  getListingWithStats,
  updateListing
} from "@/lib/listings-store";
import type { ListingAmenity, ListingRequirement, ListingType } from "@/lib/listing-types";

const LISTING_TYPES: ListingType[] = ["APARTMENT", "ROOM", "DORMITORY", "HOUSE"];
const AMENITIES: ListingAmenity[] = [
  "WIFI",
  "AC",
  "WASHER",
  "FRIDGE",
  "KITCHEN",
  "PARKING",
  "HOT_WATER",
  "OTHER"
];
const REQUIREMENTS: ListingRequirement[] = [
  "STUDENTS_ONLY",
  "GIRLS_ONLY",
  "BOYS_ONLY",
  "NO_PETS",
  "OTHER"
];

const patchSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  type: z.enum(LISTING_TYPES as [ListingType, ...ListingType[]]).optional(),
  address: z.string().min(3).optional(),
  city: z.string().min(1).optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  price: z.coerce.number().positive().optional(),
  currency: z.enum(["UZS", "USD"]).optional(),
  roomsCount: z.coerce.number().int().positive().optional(),
  capacity: z.coerce.number().int().positive().optional(),
  contactPhone: z.string().min(7).optional(),
  contactTelegram: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  customAmenity: z.string().optional(),
  customRequirement: z.string().optional(),
  status: z.enum(["ACTIVE", "BOOKED", "UNAVAILABLE"]).optional()
});

function canManage(
  sessionUser: ReturnType<typeof parseSessionCookie>,
  listing: { ownerId: string }
) {
  if (!sessionUser) return false;
  if (sessionUser.role === "UNIVERSITY_PROVIDER") return true;
  return sessionUser.id === listing.ownerId;
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const listing = await getListingWithStats(params.id);
  if (!listing) return NextResponse.json({ message: "E'lon topilmadi" }, { status: 404 });
  return NextResponse.json({ listing });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const sessionUser = parseSessionCookie(request.cookies.get("talabajoy_session")?.value);
  const existing = await getListingById(params.id);
  if (!existing) return NextResponse.json({ message: "E'lon topilmadi" }, { status: 404 });
  if (!canManage(sessionUser, existing)) {
    return NextResponse.json({ message: "Bu amalga ruxsatingiz yo'q" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const raw = Object.fromEntries(formData.entries());
    const payload = patchSchema.parse(raw);

    const amenitiesProvided = formData.has("amenities");
    const amenities = formData.getAll("amenities").filter((a): a is string => typeof a === "string");
    const requirementsProvided = formData.has("requirements");
    const requirements = formData.getAll("requirements").filter((r): r is string => typeof r === "string");

    const invalidAmenity = amenities.find((a) => !AMENITIES.includes(a as ListingAmenity));
    if (invalidAmenity) {
      return NextResponse.json({ message: "Noto'g'ri qulaylik tanlandi" }, { status: 400 });
    }
    const invalidRequirement = requirements.find((r) => !REQUIREMENTS.includes(r as ListingRequirement));
    if (invalidRequirement) {
      return NextResponse.json({ message: "Noto'g'ri talab tanlandi" }, { status: 400 });
    }

    const removeImages = formData.getAll("removeImages").filter((p): p is string => typeof p === "string");
    const newImageFiles = formData.getAll("images").filter((f): f is File => f instanceof File);
    const newImagePaths = await saveListingImages(params.id, newImageFiles);

    const remainingImages = existing.images.filter((img) => !removeImages.includes(img));
    const finalImages = [...remainingImages, ...newImagePaths];

    if (finalImages.length === 0) {
      return NextResponse.json({ message: "Kamida 1 ta rasm qolishi kerak" }, { status: 400 });
    }

    const updated = await updateListing(params.id, {
      ...payload,
      contactTelegram: payload.contactTelegram || undefined,
      contactEmail: payload.contactEmail || undefined,
      customAmenity: payload.customAmenity || undefined,
      customRequirement: payload.customRequirement || undefined,
      amenities: amenitiesProvided ? (amenities as ListingAmenity[]) : undefined,
      requirements: requirementsProvided ? (requirements as ListingRequirement[]) : undefined,
      images: finalImages
    });

    return NextResponse.json({ message: "E'lon yangilandi", listing: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Forma ma'lumotlari to'liq emas", issues: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: (error as Error).message || "E'lonni yangilashda xatolik" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const sessionUser = parseSessionCookie(request.cookies.get("talabajoy_session")?.value);
  const existing = await getListingById(params.id);
  if (!existing) return NextResponse.json({ message: "E'lon topilmadi" }, { status: 404 });
  if (!canManage(sessionUser, existing)) {
    return NextResponse.json({ message: "Bu amalga ruxsatingiz yo'q" }, { status: 403 });
  }

  await deleteListing(params.id);
  await deleteListingImageFiles(params.id);

  return NextResponse.json({ message: "E'lon o'chirildi" });
}
