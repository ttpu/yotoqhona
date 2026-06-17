export type ListingType = "APARTMENT" | "ROOM" | "DORMITORY" | "HOUSE";
export type ListingCurrency = "UZS" | "USD";
export type ListingStatus = "ACTIVE" | "BOOKED" | "UNAVAILABLE";
export type ListingOwnerRole = "UNIVERSITY_PROVIDER" | "PRIVATE_PROVIDER";

export type ListingAmenity =
  | "WIFI"
  | "AC"
  | "WASHER"
  | "FRIDGE"
  | "KITCHEN"
  | "PARKING"
  | "HOT_WATER"
  | "OTHER";

export type ListingRequirement =
  | "STUDENTS_ONLY"
  | "GIRLS_ONLY"
  | "BOYS_ONLY"
  | "NO_PETS"
  | "OTHER";

export type Listing = {
  id: string;
  ownerId: string;
  ownerRole: ListingOwnerRole;
  ownerName: string;
  title: string;
  description: string;
  type: ListingType;
  address: string;
  city: string;
  lat: number;
  lng: number;
  price: number;
  currency: ListingCurrency;
  roomsCount: number;
  capacity: number;
  amenities: ListingAmenity[];
  customAmenity?: string;
  images: string[];
  contactPhone: string;
  contactTelegram?: string;
  contactEmail?: string;
  requirements: ListingRequirement[];
  customRequirement?: string;
  status: ListingStatus;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ListingReview = {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  score: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: string;
};

export type ListingFavorite = {
  userId: string;
  listingId: string;
  createdAt: string;
};

export type ListingWithStats = Listing & {
  rating: number;
  reviewCount: number;
  isFavorited?: boolean;
};
