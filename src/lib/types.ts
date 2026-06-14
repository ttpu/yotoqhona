export type UserRole =
  | "STUDENT"
  | "UNIVERSITY_ADMIN"
  | "HOSTEL_ADMIN"
  | "LANDLORD"
  | "SUPER_ADMIN";

export type Gender = "MALE" | "FEMALE";

export type HousingType = "DORMITORY" | "HOSTEL" | "APARTMENT";

export type Housing = {
  id: string;
  name: string;
  type: HousingType;
  region: string;
  district: string;
  city: string;
  address: string;
  university: string;
  description: string;
  distanceKm: number;
  rating: number;
  verified: boolean;
  monthlyPrice: number;
  availableBeds: number;
  totalBeds: number;
  genderPolicy: Gender | null;
  amenities: string[];
  rules: string[];
  images: string[];
  videoUrl: string;
  rooms: Array<{
    roomNumber: string;
    capacity: number;
    occupiedBeds: number;
    freeBeds: number;
    genderRestriction: Gender | null;
  }>;
};

export type StudentProfile = {
  id: string;
  fullName: string;
  pinfl: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  university: string;
  faculty: string;
  course: number;
  phoneNumber: string;
  email: string;
};

export type Application = {
  id: string;
  studentId: string;
  housingId: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "WAITLISTED";
  createdAt: string;
};

export type QueueEntry = {
  id: string;
  studentId: string;
  housingId: string;
  position: number;
  priorityScore: number;
  joinedAt: string;
  reservedUntil: string | null;
};

export type Payment = {
  id: string;
  paymentId: string;
  studentId: string;
  amount: number;
  provider: "CLICK" | "PAYME" | "UZUM" | "PAYNET";
  success: boolean;
  createdAt: string;
};

export type Notification = {
  id: string;
  studentId: string;
  type:
    | "APPLICATION_SUBMITTED"
    | "APPLICATION_APPROVED"
    | "APPLICATION_REJECTED"
    | "PAYMENT_DUE"
    | "PAYMENT_SUCCESS"
    | "HOUSING_VACANCY"
    | "QUEUE_POSITION_CHANGED"
    | "COMPLAINT_RESPONSE";
  channel: "IN_APP" | "EMAIL" | "SMS";
  message: string;
  createdAt: string;
};
