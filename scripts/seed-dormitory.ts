/**
 * Seeds a full demo dormitory building (Turin Politexnika Universiteti,
 * Tashkent): 4 floors, 41 rooms, realistic occupancy. Safe to re-run —
 * skips entirely if the building already exists (delete data/dormitory.json
 * and data/dorm-bookings.json to reseed).
 *
 * Usage: npm run seed:dormitory
 * Requires: npm run seed:demo to have been run first (uses
 * demo.university@talabajoy.uz as the building owner).
 */
import { findUserByEmail, setUserGender } from "../src/lib/auth-store";
import { getBuildingByUniversityId, seedBookings, seedBuilding } from "../src/lib/dormitory-store";
import { createListing, toggleFavorite } from "../src/lib/listings-store";
import type {
  BedGender,
  DormBuilding,
  DormFloor,
  DormFloorFacilities,
  DormRoom,
  RoomBooking
} from "../src/lib/dormitory-types";

const BUILDING_LAT = 41.328;
const BUILDING_LNG = 69.276;

const FACILITIES: DormFloorFacilities = {
  diningHalls: 1,
  fridges: 3,
  microwaves: 3,
  showerStalls: 4,
  toiletStalls: 4,
  washingMachines: 2
};

const FLOOR_LAYOUT: Array<{ floorNumber: number; roomCount: number; genderPolicy: BedGender }> = [
  { floorNumber: 1, roomCount: 8, genderPolicy: "MALE" },
  { floorNumber: 2, roomCount: 11, genderPolicy: "FEMALE" },
  { floorNumber: 3, roomCount: 11, genderPolicy: "MALE" },
  { floorNumber: 4, roomCount: 11, genderPolicy: "MALE" }
];

const MALE_NAMES = [
  "Aziz", "Bobur", "Davron", "Eldor", "Farrux", "Gayrat", "Husniddin", "Ibrohim",
  "Jasur", "Kamron", "Laziz", "Muhammadali", "Nodir", "Olimjon", "Parviz",
  "Rustam", "Sardor", "Temur", "Ulugbek", "Vohid", "Xurshid", "Yusuf", "Zafar",
  "Akbar", "Bekzod", "Dilshod", "Farxod", "Jahongir"
];

const FEMALE_NAMES = [
  "Aziza", "Barno", "Dilnoza", "Elnora", "Feruza", "Gulnoza", "Hilola",
  "Iroda", "Jasmina", "Kamola", "Laylo", "Madina", "Nilufar", "Oydin",
  "Parizoda", "Rayhona", "Sevinch", "Tamara", "Umida", "Visola", "Xadicha",
  "Yulduz", "Zarina", "Anora", "Binafsha", "Dildora", "Gulbahor", "Mahliyo"
];

const SURNAMES = [
  "Karimov", "Yusupov", "Rashidov", "Tursunov", "Abdullayev", "Sultonov",
  "Nazarov", "Ergashev", "Mirzayev", "Saidov", "Xolmatov", "Ismoilov",
  "Qodirov", "Ahmedov", "Yoldashev", "Boltayev", "Rahimov", "Shokirov"
];

const FACULTIES = [
  "Mexanika muhandisligi",
  "Elektrotexnika",
  "Kompyuter muhandisligi",
  "Avtomobilsozlik",
  "Iqtisodiyot va boshqaruv",
  "Qurilish muhandisligi"
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomStudentName(gender: BedGender) {
  const first = gender === "MALE" ? pick(MALE_NAMES) : pick(FEMALE_NAMES);
  const surnameBase = pick(SURNAMES).replace(/ov$/, "");
  const surname = gender === "MALE" ? `${surnameBase}ov` : `${surnameBase}ova`;
  return `${first} ${surname}`;
}

function buildRoomNumber(floorNumber: number, index: number) {
  return `${floorNumber}${String(index + 1).padStart(2, "0")}`;
}

async function main() {
  const university = await findUserByEmail("demo.university@talabajoy.uz");
  if (!university) {
    console.error("demo.university@talabajoy.uz not found — run `npm run seed:demo` first.");
    process.exit(1);
  }

  const demoStudent = await findUserByEmail("demo.student@talabajoy.uz");
  if (demoStudent && !demoStudent.gender) {
    await setUserGender(demoStudent.id, "MALE");
    console.log("Patched demo.student@talabajoy.uz with gender=MALE");
  }

  const existingBuilding = await getBuildingByUniversityId(university.id);
  if (existingBuilding) {
    console.log("Dormitory already seeded for this university — skipping. Delete data/dormitory.json and data/dorm-bookings.json to reseed.");
    return;
  }

  const buildingId = crypto.randomUUID();
  const building: DormBuilding = {
    id: buildingId,
    universityId: university.id,
    universityName: university.organizationName ?? university.displayName,
    name: "Turin Politexnika Universiteti talabalar turar joyi",
    address: "Toshkent shahri, Kichik Halqa Yo'li ko'chasi, 17-uy",
    totalFloors: FLOOR_LAYOUT.length,
    totalRooms: FLOOR_LAYOUT.reduce((sum, f) => sum + f.roomCount, 0),
    amenities: ["Sport maydonchasi", "Coworking zona", "Bepul Wi-Fi"]
  };

  const floors: DormFloor[] = [];
  const rooms: DormRoom[] = [];

  for (const layout of FLOOR_LAYOUT) {
    const floorId = crypto.randomUUID();
    floors.push({
      id: floorId,
      buildingId,
      floorNumber: layout.floorNumber,
      genderPolicy: layout.genderPolicy,
      facilities: FACILITIES
    });

    for (let i = 0; i < layout.roomCount; i++) {
      rooms.push({
        id: crypto.randomUUID(),
        floorId,
        floorNumber: layout.floorNumber,
        roomNumber: buildRoomNumber(layout.floorNumber, i),
        capacity: 4,
        bedsCount: 4,
        nightstandsCount: 4,
        wardrobesCount: 4,
        genderPolicy: layout.genderPolicy
      });
    }
  }

  await seedBuilding(building, floors, rooms);
  console.log(`Seeded building "${building.name}" with ${floors.length} floors and ${rooms.length} rooms.`);

  // ===== Public catalog listing for the dormitory, marked official =====
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const listing = await createListing({
    id: crypto.randomUUID(),
    ownerId: university.id,
    ownerRole: "UNIVERSITY_PROVIDER",
    ownerName: university.organizationName ?? university.displayName,
    title: building.name,
    description:
      `${building.name} — ${building.totalFloors} qavatli, ${building.totalRooms} xonali rasmiy talabalar turar joyi. ` +
      "Har bir xonada 4 talaba, 4 krovat, 4 tumbochka va 4 shkaf mavjud. Har qavatda oshxona, muzlatgichlar, " +
      "mikroto'lqinli pechlar, dush va hojatxona kabinalari, kir yuvish mashinalari bor. Hududda sport maydonchasi, " +
      "coworking zona va bepul Wi-Fi mavjud.",
    type: "DORMITORY",
    address: building.address,
    city: "Toshkent",
    lat: BUILDING_LAT,
    lng: BUILDING_LNG,
    price: 350000,
    currency: "UZS",
    roomsCount: building.totalRooms,
    capacity: totalCapacity,
    amenities: ["WIFI", "HOT_WATER", "KITCHEN"],
    customAmenity: building.amenities.join(", "),
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80"
    ],
    contactPhone: "+998901112299",
    contactEmail: university.email,
    requirements: ["STUDENTS_ONLY"],
    verified: true
  });
  console.log(`Created official catalog listing "${listing.title}" (verified).`);

  if (demoStudent) {
    await toggleFavorite(demoStudent.id, listing.id);
    console.log("Added the dormitory listing to demo.student@talabajoy.uz's favorites.");
  }

  // ===== Bookings: realistic occupancy =====
  const bookings: RoomBooking[] = [];
  const now = Date.now();

  function addBooking(room: DormRoom, bedSlot: number, status: RoomBooking["status"], daysAgo: number) {
    const requestedAt = new Date(now - daysAgo * 86_400_000).toISOString();
    bookings.push({
      id: crypto.randomUUID(),
      roomId: room.id,
      floorNumber: room.floorNumber,
      roomNumber: room.roomNumber,
      bedSlot,
      studentId: crypto.randomUUID(),
      studentName: randomStudentName(room.genderPolicy),
      studentCourse: String(1 + Math.floor(Math.random() * 4)),
      studentFaculty: pick(FACULTIES),
      status,
      requestedAt,
      decidedAt: status === "PENDING" ? undefined : new Date(now - Math.max(daysAgo - 1, 0) * 86_400_000).toISOString()
    });
  }

  for (const layout of FLOOR_LAYOUT) {
    const floorRooms = rooms.filter((r) => r.floorNumber === layout.floorNumber);
    // Leave the last room on every floor completely empty so there's
    // always somewhere fresh to test-book into, regardless of other
    // randomized occupancy below.
    const guaranteedEmptyRoomId = floorRooms[floorRooms.length - 1].id;

    floorRooms.forEach((room, roomIdx) => {
      if (room.id === guaranteedEmptyRoomId) return;

      // Vary occupancy: ~70% of beds filled on average, some rooms full,
      // a couple left fully empty per floor, a couple partially filled.
      const isSecondEmpty = roomIdx === 0;
      if (isSecondEmpty) return;

      const occupiedBeds = Math.random() < 0.55 ? 4 : Math.random() < 0.6 ? 3 : 2;
      for (let slot = 1; slot <= occupiedBeds; slot++) {
        addBooking(room, slot, "CHECKED_IN", 10 + Math.floor(Math.random() * 200));
      }
    });
  }

  // A few pending requests awaiting admin approval, in rooms that still
  // have free beds.
  const roomsWithSpace = rooms.filter((r) => {
    const taken = bookings.filter((b) => b.roomId === r.id).length;
    return taken < r.capacity;
  });
  for (let i = 0; i < 3 && i < roomsWithSpace.length; i++) {
    const room = roomsWithSpace[i * 3] ?? roomsWithSpace[i];
    const taken = new Set(bookings.filter((b) => b.roomId === room.id).map((b) => b.bedSlot));
    let slot = 1;
    while (taken.has(slot)) slot++;
    if (slot <= room.capacity) addBooking(room, slot, "PENDING", Math.floor(Math.random() * 3));
  }

  // One rejected and one checked-out, for status variety in the admin table.
  const variedRoom1 = roomsWithSpace[roomsWithSpace.length - 1];
  if (variedRoom1) addBooking(variedRoom1, variedRoom1.capacity, "REJECTED", 5);
  const variedRoom2 = roomsWithSpace[roomsWithSpace.length - 2];
  if (variedRoom2) addBooking(variedRoom2, variedRoom2.capacity, "CHECKED_OUT", 60);

  // Give the demo student account a real, checked-in booking matching
  // their gender, in a room that still has space.
  if (demoStudent) {
    const demoGender: BedGender = demoStudent.gender ?? "MALE";
    const demoRoom = rooms.find((r) => {
      if (r.genderPolicy !== demoGender) return false;
      const taken = bookings.filter((b) => b.roomId === r.id).length;
      return taken > 0 && taken < r.capacity;
    });
    if (demoRoom) {
      const taken = new Set(bookings.filter((b) => b.roomId === demoRoom.id).map((b) => b.bedSlot));
      let slot = 1;
      while (taken.has(slot)) slot++;
      bookings.push({
        id: crypto.randomUUID(),
        roomId: demoRoom.id,
        floorNumber: demoRoom.floorNumber,
        roomNumber: demoRoom.roomNumber,
        bedSlot: slot,
        studentId: demoStudent.id,
        studentName: demoStudent.displayName,
        studentCourse: demoStudent.course,
        studentFaculty: demoStudent.faculty,
        status: "CHECKED_IN",
        requestedAt: new Date(now - 90 * 86_400_000).toISOString(),
        decidedAt: new Date(now - 89 * 86_400_000).toISOString()
      });
      console.log(`Checked demo.student@talabajoy.uz into room ${demoRoom.roomNumber}, bed ${slot}.`);
    }
  }

  await seedBookings(bookings);

  const totalBeds = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const activeCount = bookings.filter((b) => b.status === "PENDING" || b.status === "CHECKED_IN" || b.status === "APPROVED").length;
  console.log(`Seeded ${bookings.length} bookings (${activeCount} active) out of ${totalBeds} total beds.`);
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
