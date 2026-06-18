import { promises as fs } from "fs";
import path from "path";
import {
  BedGender,
  BookingStatus,
  DormBuilding,
  DormFloor,
  DormRoom,
  OccupancySummary,
  RoomBooking,
  RoomWithBookings
} from "@/lib/dormitory-types";

const dataDir = path.join(process.cwd(), "data");
const buildingsFile = path.join(dataDir, "dormitory.json");
const bookingsFile = path.join(dataDir, "dorm-bookings.json");

const ACTIVE_STATUSES: BookingStatus[] = ["PENDING", "APPROVED", "CHECKED_IN"];

type DormitoryData = {
  buildings: DormBuilding[];
  floors: DormFloor[];
  rooms: DormRoom[];
};

async function ensureFile(file: string, fallback: string) {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, fallback, "utf8");
  }
}

async function readDormitoryData(): Promise<DormitoryData> {
  await ensureFile(buildingsFile, JSON.stringify({ buildings: [], floors: [], rooms: [] }, null, 2));
  const raw = await fs.readFile(buildingsFile, "utf8");
  return JSON.parse(raw) as DormitoryData;
}

async function writeDormitoryData(data: DormitoryData) {
  await ensureFile(buildingsFile, JSON.stringify({ buildings: [], floors: [], rooms: [] }, null, 2));
  await fs.writeFile(buildingsFile, JSON.stringify(data, null, 2), "utf8");
}

async function readBookings(): Promise<RoomBooking[]> {
  await ensureFile(bookingsFile, "[]");
  const raw = await fs.readFile(bookingsFile, "utf8");
  return JSON.parse(raw) as RoomBooking[];
}

async function writeBookings(bookings: RoomBooking[]) {
  await ensureFile(bookingsFile, "[]");
  await fs.writeFile(bookingsFile, JSON.stringify(bookings, null, 2), "utf8");
}

// ===== Seed-only writers (used by scripts/seed-dormitory.ts) =====

export async function seedBuilding(building: DormBuilding, floors: DormFloor[], rooms: DormRoom[]) {
  const data = await readDormitoryData();
  if (data.buildings.some((b) => b.id === building.id)) return;
  data.buildings.push(building);
  data.floors.push(...floors);
  data.rooms.push(...rooms);
  await writeDormitoryData(data);
}

export async function seedBookings(bookings: RoomBooking[]) {
  const existing = await readBookings();
  await writeBookings([...existing, ...bookings]);
}

// ===== Reads =====

export async function getBuildingByUniversityId(universityId: string): Promise<DormBuilding | null> {
  const data = await readDormitoryData();
  return data.buildings.find((b) => b.universityId === universityId) ?? null;
}

// Students aren't formally linked to a specific university record yet, and
// this app currently models a single demo dormitory — so the booking flow
// just offers whichever building exists rather than trying to match the
// free-text university name from registration.
export async function getAnyBuilding(): Promise<DormBuilding | null> {
  const data = await readDormitoryData();
  return data.buildings[0] ?? null;
}

export async function getBuildingById(buildingId: string): Promise<DormBuilding | null> {
  const data = await readDormitoryData();
  return data.buildings.find((b) => b.id === buildingId) ?? null;
}

export async function getFloors(buildingId: string): Promise<DormFloor[]> {
  const data = await readDormitoryData();
  return data.floors.filter((f) => f.buildingId === buildingId).sort((a, b) => a.floorNumber - b.floorNumber);
}

export async function getFloor(buildingId: string, floorNumber: number): Promise<DormFloor | null> {
  const data = await readDormitoryData();
  return data.floors.find((f) => f.buildingId === buildingId && f.floorNumber === floorNumber) ?? null;
}

export async function getRoomsWithBookings(buildingId: string, floorNumber: number): Promise<RoomWithBookings[]> {
  const data = await readDormitoryData();
  const bookings = await readBookings();
  const rooms = data.rooms.filter((r) => {
    const floor = data.floors.find((f) => f.id === r.floorId);
    return floor?.buildingId === buildingId && r.floorNumber === floorNumber;
  });

  return rooms
    .map((room) => {
      const roomBookings = bookings
        .filter((b) => b.roomId === room.id && ACTIVE_STATUSES.includes(b.status))
        .sort((a, b) => a.bedSlot - b.bedSlot);
      return {
        ...room,
        bookings: roomBookings,
        occupiedCount: roomBookings.length,
        freeCount: room.capacity - roomBookings.length
      };
    })
    .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true }));
}

export async function getRoomById(roomId: string): Promise<DormRoom | null> {
  const data = await readDormitoryData();
  return data.rooms.find((r) => r.id === roomId) ?? null;
}

export async function getOccupancySummary(buildingId: string): Promise<OccupancySummary> {
  const data = await readDormitoryData();
  const bookings = await readBookings();
  const floors = data.floors.filter((f) => f.buildingId === buildingId).sort((a, b) => a.floorNumber - b.floorNumber);
  const rooms = data.rooms.filter((r) => floors.some((f) => f.id === r.floorId));

  const byFloor = floors.map((floor) => {
    const floorRooms = rooms.filter((r) => r.floorId === floor.id);
    const totalBeds = floorRooms.reduce((sum, r) => sum + r.capacity, 0);
    const occupiedBeds = bookings.filter(
      (b) => floorRooms.some((r) => r.id === b.roomId) && ACTIVE_STATUSES.includes(b.status)
    ).length;
    return {
      floorNumber: floor.floorNumber,
      genderPolicy: floor.genderPolicy,
      roomCount: floorRooms.length,
      totalBeds,
      occupiedBeds,
      freeBeds: totalBeds - occupiedBeds
    };
  });

  const totalBeds = byFloor.reduce((sum, f) => sum + f.totalBeds, 0);
  const occupiedBeds = byFloor.reduce((sum, f) => sum + f.occupiedBeds, 0);
  const pendingRequests = bookings.filter(
    (b) => rooms.some((r) => r.id === b.roomId) && b.status === "PENDING"
  ).length;

  return {
    totalRooms: rooms.length,
    totalBeds,
    occupiedBeds,
    freeBeds: totalBeds - occupiedBeds,
    pendingRequests,
    byFloor
  };
}

export async function getStudentActiveBooking(studentId: string): Promise<RoomBooking | null> {
  const bookings = await readBookings();
  return bookings.find((b) => b.studentId === studentId && ACTIVE_STATUSES.includes(b.status)) ?? null;
}

export type AdminBookingRow = RoomBooking & { genderPolicy: BedGender };

export async function getAllBookingsForAdmin(
  buildingId: string,
  filters?: { status?: BookingStatus; floorNumber?: number; search?: string }
): Promise<AdminBookingRow[]> {
  const data = await readDormitoryData();
  const bookings = await readBookings();
  const floors = data.floors.filter((f) => f.buildingId === buildingId);
  const rooms = data.rooms.filter((r) => floors.some((f) => f.id === r.floorId));
  const roomIds = new Set(rooms.map((r) => r.id));

  let rows: AdminBookingRow[] = bookings
    .filter((b) => roomIds.has(b.roomId))
    .map((b) => {
      const room = rooms.find((r) => r.id === b.roomId);
      return { ...b, genderPolicy: room?.genderPolicy ?? "MALE" };
    });

  if (filters?.status) rows = rows.filter((r) => r.status === filters.status);
  if (typeof filters?.floorNumber === "number") rows = rows.filter((r) => r.floorNumber === filters.floorNumber);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.studentName.toLowerCase().includes(q) ||
        r.roomNumber.toLowerCase().includes(q) ||
        (r.studentFaculty ?? "").toLowerCase().includes(q)
    );
  }

  return rows.sort((a, b) => Date.parse(b.requestedAt) - Date.parse(a.requestedAt));
}

// ===== Mutations =====

export async function createBookingRequest(input: {
  roomId: string;
  studentId: string;
  studentName: string;
  studentCourse?: string;
  studentFaculty?: string;
  studentPhone?: string;
  studentGender?: BedGender;
}) {
  const data = await readDormitoryData();
  const room = data.rooms.find((r) => r.id === input.roomId);
  if (!room) throw new Error("Xona topilmadi");

  if (input.studentGender && input.studentGender !== room.genderPolicy) {
    throw new Error("Bu qavat sizning jinsingiz uchun mo'ljallanmagan");
  }

  const bookings = await readBookings();

  const alreadyActive = bookings.some(
    (b) => b.studentId === input.studentId && ACTIVE_STATUSES.includes(b.status)
  );
  if (alreadyActive) {
    throw new Error("Sizda allaqachon faol bron mavjud");
  }

  const takenSlots = new Set(
    bookings.filter((b) => b.roomId === room.id && ACTIVE_STATUSES.includes(b.status)).map((b) => b.bedSlot)
  );
  let bedSlot = -1;
  for (let slot = 1; slot <= room.capacity; slot++) {
    if (!takenSlots.has(slot)) {
      bedSlot = slot;
      break;
    }
  }
  if (bedSlot === -1) {
    throw new Error("Bu xonada bo'sh joy qolmadi");
  }

  const booking: RoomBooking = {
    id: crypto.randomUUID(),
    roomId: room.id,
    floorNumber: room.floorNumber,
    roomNumber: room.roomNumber,
    bedSlot,
    studentId: input.studentId,
    studentName: input.studentName,
    studentCourse: input.studentCourse,
    studentFaculty: input.studentFaculty,
    studentPhone: input.studentPhone,
    status: "PENDING",
    requestedAt: new Date().toISOString()
  };

  bookings.push(booking);
  await writeBookings(bookings);
  return booking;
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  actorUniversityId: string
): Promise<RoomBooking> {
  const data = await readDormitoryData();
  const bookings = await readBookings();
  const idx = bookings.findIndex((b) => b.id === bookingId);
  if (idx === -1) throw new Error("Bron topilmadi");

  const room = data.rooms.find((r) => r.id === bookings[idx].roomId);
  const floor = room ? data.floors.find((f) => f.id === room.floorId) : null;
  const building = floor ? data.buildings.find((b) => b.id === floor.buildingId) : null;

  if (!building || building.universityId !== actorUniversityId) {
    throw new Error("Bu amalga ruxsatingiz yo'q");
  }

  bookings[idx] = { ...bookings[idx], status, decidedAt: new Date().toISOString() };
  await writeBookings(bookings);
  return bookings[idx];
}
