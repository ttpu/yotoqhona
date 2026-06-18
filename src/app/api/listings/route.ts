import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseSessionCookie } from "@/lib/session";
import { saveListingImages } from "@/lib/listing-upload";
import {
  ListingSort,
  createListing,
  generateListingId,
  getFavoriteIds,
  listListings
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

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(LISTING_TYPES as [ListingType, ...ListingType[]]),
  address: z.string().min(3),
  city: z.string().min(1),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  price: z.coerce.number().positive(),
  currency: z.enum(["UZS", "USD"]),
  roomsCount: z.coerce.number().int().positive(),
  capacity: z.coerce.number().int().positive(),
  contactPhone: z.string().min(7),
  contactTelegram: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  customAmenity: z.string().optional(),
  customRequirement: z.string().optional()
});

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const sessionUser = parseSessionCookie(request.cookies.get("talabajoy_session")?.value);

  const amenities = sp.getAll("amenities") as ListingAmenity[];

  try {
    const result = await listListings({
      filters: {
        search: sp.get("search") ?? undefined,
        type: (sp.get("type") as ListingType) || undefined,
        city: sp.get("city") ?? undefined,
        minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
        maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
        minRooms: sp.get("minRooms") ? Number(sp.get("minRooms")) : undefined,
        amenities: amenities.length ? amenities : undefined,
        status: (sp.get("status") as never) || undefined,
        ownerId: sp.get("ownerId") ?? undefined
      },
      sort: (sp.get("sort") as ListingSort) || "newest",
      page: sp.get("page") ? Number(sp.get("page")) : 1,
      pageSize: sp.get("pageSize") ? Number(sp.get("pageSize")) : 9
    });

    const favoriteIds = sessionUser ? await getFavoriteIds(sessionUser.id) : [];
    const items = result.items.map((item) => ({
      ...item,
      isFavorited: favoriteIds.includes(item.id)
    }));

    return NextResponse.json({ ...result, items });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "E'lonlarni yuklashda xatolik" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const sessionUser = parseSessionCookie(request.cookies.get("talabajoy_session")?.value);

  if (!sessionUser) {
    return NextResponse.json({ message: "Tizimga kiring" }, { status: 401 });
  }
  if (sessionUser.role !== "UNIVERSITY_PROVIDER" && sessionUser.role !== "PRIVATE_PROVIDER") {
    return NextResponse.json(
      { message: "Faqat turar joy egalari e'lon joylashtira oladi" },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const raw = Object.fromEntries(formData.entries());
    const payload = createSchema.parse(raw);

    const amenities = formData.getAll("amenities").filter((a): a is string => typeof a === "string");
    const requirements = formData.getAll("requirements").filter((r): r is string => typeof r === "string");
    const invalidAmenity = amenities.find((a) => !AMENITIES.includes(a as ListingAmenity));
    if (invalidAmenity) {
      return NextResponse.json({ message: "Noto'g'ri qulaylik tanlandi" }, { status: 400 });
    }
    const invalidRequirement = requirements.find((r) => !REQUIREMENTS.includes(r as ListingRequirement));
    if (invalidRequirement) {
      return NextResponse.json({ message: "Noto'g'ri talab tanlandi" }, { status: 400 });
    }

    const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File);
    if (imageFiles.length === 0) {
      return NextResponse.json({ message: "Kamida 1 ta rasm yuklang" }, { status: 400 });
    }

    const id = generateListingId();
    const images = await saveListingImages(id, imageFiles);

    const listing = await createListing({
      id,
      ownerId: sessionUser.id,
      ownerRole: sessionUser.role,
      ownerName: sessionUser.displayName,
      title: payload.title,
      description: payload.description,
      type: payload.type,
      address: payload.address,
      city: payload.city,
      lat: payload.lat,
      lng: payload.lng,
      price: payload.price,
      currency: payload.currency,
      roomsCount: payload.roomsCount,
      capacity: payload.capacity,
      amenities: amenities as ListingAmenity[],
      customAmenity: payload.customAmenity || undefined,
      images,
      contactPhone: payload.contactPhone,
      contactTelegram: payload.contactTelegram || undefined,
      contactEmail: payload.contactEmail || undefined,
      requirements: requirements as ListingRequirement[],
      customRequirement: payload.customRequirement || undefined
    });

    return NextResponse.json({ message: "E'lon yaratildi", listing }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Forma ma'lumotlari to'liq emas", issues: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: (error as Error).message || "E'lon yaratishda xatolik" },
      { status: 500 }
    );
  }
}
