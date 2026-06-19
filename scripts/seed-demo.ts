/**
 * Seeds demo accounts (one per role) and demo listings so the app has
 * something to look at out of the box. Safe to re-run: users are skipped
 * if the email already exists, and listings are skipped entirely if any
 * listing already exists (delete data/listings.json to reseed those).
 *
 * Usage: npm run seed:demo
 */
import { createStoredUser, findUserByEmail } from "../src/lib/auth-store";
import { addReview, createListing, generateListingId, listListings } from "../src/lib/listings-store";
import type { Listing } from "../src/lib/listing-types";

const DEMO_PASSWORD = "Demo12345";

async function ensureUser(input: Parameters<typeof createStoredUser>[0]) {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    console.log(`  - skip (already exists): ${input.email}`);
    return existing;
  }
  const user = await createStoredUser(input);
  console.log(`  - created: ${input.email} / ${DEMO_PASSWORD}`);
  return user;
}

type DemoListingInput = Omit<
  Listing,
  "id" | "ownerId" | "ownerRole" | "ownerName" | "viewCount" | "createdAt" | "updatedAt" | "status" | "verified"
>;

async function main() {
  console.log("Seeding demo accounts...");

  const student = await ensureUser({
    email: "demo.student@talabajoy.uz",
    password: DEMO_PASSWORD,
    displayName: "Demo Talaba",
    role: "STUDENT",
    status: "ACTIVE",
    verified: true,
    university: "Toshkent Davlat Texnika Universiteti",
    faculty: "Kompyuter muhandisligi",
    course: "2",
    gender: "MALE"
  });

  const university = await ensureUser({
    email: "demo.university@talabajoy.uz",
    password: DEMO_PASSWORD,
    displayName: "TTPU Yotoqxona Boshqarmasi",
    role: "UNIVERSITY_PROVIDER",
    status: "ACTIVE",
    verified: true,
    organizationName: "Toshkent Davlat Texnika Universiteti"
  });

  const owner = await ensureUser({
    email: "demo.owner@talabajoy.uz",
    password: DEMO_PASSWORD,
    displayName: "Demo Uy Egasi",
    role: "PRIVATE_PROVIDER",
    status: "ACTIVE",
    verified: true
  });

  console.log("\nSeeding demo listings...");
  const existing = await listListings({ pageSize: 1 });
  if (existing.total > 0) {
    console.log("  - skip: listings already exist (delete data/listings.json to reseed)");
    return;
  }

  const demoListings: Array<DemoListingInput & { ownerKey: "university" | "owner" }> = [
    {
      ownerKey: "owner",
      title: "Yunusobodda zamonaviy 2 xonali kvartira",
      description:
        "Metro bekatiga 5 daqiqa, to'liq jihozlangan oshxona, balkon va tinch hovli. Talabalar uchun qulay shartlar.",
      type: "APARTMENT",
      address: "Amir Temur shoh ko'chasi 45",
      city: "Toshkent",
      lat: 41.3375,
      lng: 69.288,
      price: 2500000,
      currency: "UZS",
      roomsCount: 2,
      capacity: 3,
      amenities: ["WIFI", "AC", "WASHER", "FRIDGE", "KITCHEN", "HOT_WATER"],
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
      ],
      contactPhone: "+998901112201",
      contactTelegram: "@talabajoy_demo1",
      requirements: ["STUDENTS_ONLY"]
    },
    {
      ownerKey: "university",
      title: "TDTU yotoqxonasi — standart xona",
      description:
        "Universitet hududida joylashgan, 24/7 xavfsizlik, isitiladigan xonalar va o'quv zonasi mavjud.",
      type: "DORMITORY",
      address: "Universitet ko'chasi 2",
      city: "Toshkent",
      lat: 41.3275,
      lng: 69.284,
      price: 350000,
      currency: "UZS",
      roomsCount: 1,
      capacity: 4,
      amenities: ["WIFI", "HOT_WATER", "KITCHEN"],
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80"
      ],
      contactPhone: "+998901112202",
      contactEmail: "yotoqxona@tdtu.uz",
      requirements: ["STUDENTS_ONLY", "NO_PETS"]
    },
    {
      ownerKey: "owner",
      title: "Chilonzorda hovli, talabalar uchun",
      description: "Keng hovli, alohida kirish eshigi, parkovka joyi va tinch atmosfera. Guruh bo'lib yashash uchun ideal.",
      type: "HOUSE",
      address: "Bunyodkor shoh ko'chasi 12",
      city: "Toshkent",
      lat: 41.2796,
      lng: 69.2034,
      price: 4000000,
      currency: "UZS",
      roomsCount: 4,
      capacity: 6,
      amenities: ["WIFI", "PARKING", "KITCHEN", "HOT_WATER", "WASHER"],
      images: [
        "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
      ],
      contactPhone: "+998901112203",
      contactTelegram: "@talabajoy_demo3",
      requirements: ["BOYS_ONLY"]
    },
    {
      ownerKey: "owner",
      title: "Sergeli tumanida qulay xona ijaraga",
      description: "Yangi ta'mirlangan, alohida xona, ishtirokdosh oshxona. Universitetga avtobus bilan 15 daqiqa.",
      type: "ROOM",
      address: "Sergeli ko'chasi 8",
      city: "Toshkent",
      lat: 41.227,
      lng: 69.236,
      price: 900000,
      currency: "UZS",
      roomsCount: 1,
      capacity: 1,
      amenities: ["WIFI", "FRIDGE"],
      images: [
        "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80"
      ],
      contactPhone: "+998901112204",
      requirements: ["GIRLS_ONLY"]
    },
    {
      ownerKey: "university",
      title: "Mirzo Ulug'bek — hamyonbop yotoqxona",
      description: "Eng arzon narxlardan biri, umumiy oshxona va kir yuvish xonasi, talabalar uchun moslashtirilgan.",
      type: "DORMITORY",
      address: "Talabalar shaharchasi 5",
      city: "Toshkent",
      lat: 41.334,
      lng: 69.279,
      price: 280000,
      currency: "UZS",
      roomsCount: 1,
      capacity: 6,
      amenities: ["WIFI", "HOT_WATER"],
      images: [
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80"
      ],
      contactPhone: "+998901112205",
      contactEmail: "yotoqxona2@tdtu.uz",
      requirements: ["STUDENTS_ONLY"]
    },
    {
      ownerKey: "owner",
      title: "Yakkasaroyda oilaviy uy yonida kvartira",
      description: "Tinch hovlida joylashgan, to'liq mebellangan, konditsioner va parkovka mavjud. Uzoq muddatli ijara uchun qulay.",
      type: "APARTMENT",
      address: "Yakkasaroy ko'chasi 21",
      city: "Toshkent",
      lat: 41.29,
      lng: 69.254,
      price: 3200000,
      currency: "UZS",
      roomsCount: 3,
      capacity: 4,
      amenities: ["WIFI", "AC", "KITCHEN", "PARKING", "HOT_WATER", "WASHER", "FRIDGE"],
      images: [
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
      ],
      contactPhone: "+998901112206",
      contactTelegram: "@talabajoy_demo6",
      requirements: []
    }
  ];

  const owners = { university, owner };
  const created: Listing[] = [];

  for (const demo of demoListings) {
    const { ownerKey, ...rest } = demo;
    const ownerUser = owners[ownerKey];
    const listing = await createListing({
      id: generateListingId(),
      ownerId: ownerUser.id,
      ownerRole: ownerUser.role as "UNIVERSITY_PROVIDER" | "PRIVATE_PROVIDER",
      ownerName: ownerUser.displayName,
      ...rest
    });
    created.push(listing);
    console.log(`  - created listing: ${listing.title}`);
  }

  console.log("\nSeeding demo reviews...");
  await addReview({
    listingId: created[0].id,
    userId: student.id,
    userName: student.displayName,
    score: 5,
    comment: "Juda yaxshi joy, uy egasi ham mas'uliyatli. Tavsiya qilaman!"
  });
  await addReview({
    listingId: created[1].id,
    userId: student.id,
    userName: student.displayName,
    score: 4,
    comment: "Narxi hamyonbop, lekin internet ba'zida sekinlashadi."
  });
  await addReview({
    listingId: created[5].id,
    userId: student.id,
    userName: student.displayName,
    score: 5,
    comment: "Juda tinch va qulay, transport yaqin."
  });
  console.log("  - added 3 demo reviews");

  console.log("\nDone.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
