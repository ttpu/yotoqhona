export type BedGender = "MALE" | "FEMALE";

export type BookingStatus = "PENDING" | "APPROVED" | "CHECKED_IN" | "REJECTED" | "CHECKED_OUT";

export type DormFloorFacilities = {
  diningHalls: number;
  fridges: number;
  microwaves: number;
  showerStalls: number;
  toiletStalls: number;
  washingMachines: number;
};

export type DormBuilding = {
  id: string;
  universityId: string;
  universityName: string;
  name: string;
  address: string;
  totalFloors: number;
  totalRooms: number;
  amenities: string[];
};

export type DormFloor = {
  id: string;
  buildingId: string;
  floorNumber: number;
  genderPolicy: BedGender;
  facilities: DormFloorFacilities;
};

export type DormRoom = {
  id: string;
  floorId: string;
  floorNumber: number;
  roomNumber: string;
  capacity: number;
  bedsCount: number;
  nightstandsCount: number;
  wardrobesCount: number;
  genderPolicy: BedGender;
};

export type RoomBooking = {
  id: string;
  roomId: string;
  floorNumber: number;
  roomNumber: string;
  bedSlot: number;
  studentId: string;
  studentName: string;
  studentCourse?: string;
  studentFaculty?: string;
  studentPhone?: string;
  status: BookingStatus;
  requestedAt: string;
  decidedAt?: string;
  note?: string;
};

export type RoomWithBookings = DormRoom & {
  bookings: RoomBooking[];
  occupiedCount: number;
  freeCount: number;
};

export type OccupancySummary = {
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  freeBeds: number;
  pendingRequests: number;
  byFloor: Array<{
    floorNumber: number;
    genderPolicy: BedGender;
    roomCount: number;
    totalBeds: number;
    occupiedBeds: number;
    freeBeds: number;
  }>;
};
