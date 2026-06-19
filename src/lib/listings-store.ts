import { promises as fs } from "fs";
import path from "path";
import {
  Listing,
  ListingAmenity,
  ListingFavorite,
  ListingReview,
  ListingStatus,
  ListingType,
  ListingWithStats
} from "@/lib/listing-types";

const dataDir = path.join(process.cwd(), "data");
const listingsFile = path.join(dataDir, "listings.json");
const reviewsFile = path.join(dataDir, "reviews.json");
const favoritesFile = path.join(dataDir, "favorites.json");

async function ensureStore(file: string) {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, "[]", "utf8");
  }
}

async function readJson<T>(file: string): Promise<T[]> {
  await ensureStore(file);
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw) as T[];
}

async function writeJson<T>(file: string, data: T[]) {
  await ensureStore(file);
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

// ===== Listings =====

export type ListingFilters = {
  search?: string;
  type?: ListingType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  amenities?: ListingAmenity[];
  status?: ListingStatus;
  ownerId?: string;
};

export type ListingSort = "price_asc" | "price_desc" | "rating" | "newest";

export async function createListing(
  input: Omit<Listing, "viewCount" | "createdAt" | "updatedAt" | "status" | "verified"> & {
    status?: ListingStatus;
    verified?: boolean;
  }
) {
  const listings = await readJson<Listing>(listingsFile);
  const now = new Date().toISOString();
  const listing: Listing = {
    ...input,
    status: input.status ?? "ACTIVE",
    verified: input.verified ?? false,
    viewCount: 0,
    createdAt: now,
    updatedAt: now
  };
  listings.push(listing);
  await writeJson(listingsFile, listings);
  return listing;
}

export function generateListingId() {
  return crypto.randomUUID();
}

export async function updateListing(
  id: string,
  patch: Partial<Omit<Listing, "id" | "ownerId" | "createdAt">>
) {
  const listings = await readJson<Listing>(listingsFile);
  const idx = listings.findIndex((l) => l.id === id);
  if (idx === -1) return null;

  listings[idx] = {
    ...listings[idx],
    ...patch,
    updatedAt: new Date().toISOString()
  };
  await writeJson(listingsFile, listings);
  return listings[idx];
}

export async function deleteListing(id: string) {
  const listings = await readJson<Listing>(listingsFile);
  const filtered = listings.filter((l) => l.id !== id);
  await writeJson(listingsFile, filtered);

  const reviews = await readJson<ListingReview>(reviewsFile);
  await writeJson(reviewsFile, reviews.filter((r) => r.listingId !== id));

  const favorites = await readJson<ListingFavorite>(favoritesFile);
  await writeJson(favoritesFile, favorites.filter((f) => f.listingId !== id));

  return filtered.length !== listings.length;
}

export async function getListingById(id: string): Promise<Listing | null> {
  const listings = await readJson<Listing>(listingsFile);
  return listings.find((l) => l.id === id) ?? null;
}

export async function incrementViewCount(id: string) {
  const listings = await readJson<Listing>(listingsFile);
  const idx = listings.findIndex((l) => l.id === id);
  if (idx === -1) return;
  listings[idx].viewCount += 1;
  await writeJson(listingsFile, listings);
}

async function attachStats(listings: Listing[]): Promise<ListingWithStats[]> {
  const reviews = await readJson<ListingReview>(reviewsFile);
  return listings.map((listing) => {
    const listingReviews = reviews.filter((r) => r.listingId === listing.id);
    const reviewCount = listingReviews.length;
    const rating = reviewCount
      ? Math.round((listingReviews.reduce((sum, r) => sum + r.score, 0) / reviewCount) * 10) / 10
      : 0;
    return { ...listing, rating, reviewCount };
  });
}

export async function listListings(options?: {
  filters?: ListingFilters;
  sort?: ListingSort;
  page?: number;
  pageSize?: number;
}) {
  const { filters, sort = "newest", page = 1, pageSize = 9 } = options ?? {};
  let listings = await readJson<Listing>(listingsFile);

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    listings = listings.filter(
      (l) => l.title.toLowerCase().includes(q) || l.address.toLowerCase().includes(q)
    );
  }
  if (filters?.type) listings = listings.filter((l) => l.type === filters.type);
  if (filters?.city) listings = listings.filter((l) => l.city.toLowerCase() === filters.city?.toLowerCase());
  if (typeof filters?.minPrice === "number") listings = listings.filter((l) => l.price >= filters.minPrice!);
  if (typeof filters?.maxPrice === "number") listings = listings.filter((l) => l.price <= filters.maxPrice!);
  if (typeof filters?.minRooms === "number") listings = listings.filter((l) => l.roomsCount >= filters.minRooms!);
  if (filters?.amenities?.length) {
    listings = listings.filter((l) => filters.amenities!.every((a) => l.amenities.includes(a)));
  }
  if (filters?.status) listings = listings.filter((l) => l.status === filters.status);
  if (filters?.ownerId) listings = listings.filter((l) => l.ownerId === filters.ownerId);

  let withStats = await attachStats(listings);

  if (sort === "price_asc") withStats.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") withStats.sort((a, b) => b.price - a.price);
  else if (sort === "rating") withStats.sort((a, b) => b.rating - a.rating);
  else withStats.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  const total = withStats.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = withStats.slice(start, start + pageSize);

  return { items, total, page: safePage, totalPages, pageSize };
}

export async function getListingWithStats(id: string): Promise<ListingWithStats | null> {
  const listing = await getListingById(id);
  if (!listing) return null;
  const [withStats] = await attachStats([listing]);
  return withStats;
}

export type ListingLocation = {
  id: string;
  title: string;
  type: ListingType;
  price: number;
  currency: Listing["currency"];
  lat: number;
  lng: number;
};

export async function getAllListingLocations(): Promise<ListingLocation[]> {
  const listings = await readJson<Listing>(listingsFile);
  return listings
    .filter((l) => l.status === "ACTIVE")
    .map((l) => ({ id: l.id, title: l.title, type: l.type, price: l.price, currency: l.currency, lat: l.lat, lng: l.lng }));
}

// ===== Reviews =====

export async function getReviewsForListing(listingId: string) {
  const reviews = await readJson<ListingReview>(reviewsFile);
  return reviews
    .filter((r) => r.listingId === listingId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function addReview(input: {
  listingId: string;
  userId: string;
  userName: string;
  score: 1 | 2 | 3 | 4 | 5;
  comment: string;
}) {
  const reviews = await readJson<ListingReview>(reviewsFile);
  const existingIdx = reviews.findIndex(
    (r) => r.listingId === input.listingId && r.userId === input.userId
  );

  const review: ListingReview = {
    id: existingIdx !== -1 ? reviews[existingIdx].id : crypto.randomUUID(),
    listingId: input.listingId,
    userId: input.userId,
    userName: input.userName,
    score: input.score,
    comment: input.comment,
    createdAt: new Date().toISOString()
  };

  if (existingIdx !== -1) {
    reviews[existingIdx] = review;
  } else {
    reviews.push(review);
  }

  await writeJson(reviewsFile, reviews);
  return review;
}

// ===== Favorites =====

export async function toggleFavorite(userId: string, listingId: string) {
  const favorites = await readJson<ListingFavorite>(favoritesFile);
  const idx = favorites.findIndex((f) => f.userId === userId && f.listingId === listingId);

  if (idx !== -1) {
    favorites.splice(idx, 1);
    await writeJson(favoritesFile, favorites);
    return false;
  }

  favorites.push({ userId, listingId, createdAt: new Date().toISOString() });
  await writeJson(favoritesFile, favorites);
  return true;
}

export async function getFavoriteIds(userId: string) {
  const favorites = await readJson<ListingFavorite>(favoritesFile);
  return favorites.filter((f) => f.userId === userId).map((f) => f.listingId);
}

export async function isFavorited(userId: string, listingId: string) {
  const favorites = await readJson<ListingFavorite>(favoritesFile);
  return favorites.some((f) => f.userId === userId && f.listingId === listingId);
}

export async function getFavoriteListings(userId: string) {
  const favoriteIds = await getFavoriteIds(userId);
  const listings = await readJson<Listing>(listingsFile);
  const owned = listings.filter((l) => favoriteIds.includes(l.id));
  return attachStats(owned);
}
