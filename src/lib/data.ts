import { randomUUID } from "crypto";
import {
  Application,
  Housing,
  Notification,
  Payment,
  QueueEntry,
  StudentProfile
} from "@/lib/types";

const housingData: Housing[] = [
  {
    id: "h1",
    name: "TUIT Student Residence A",
    type: "DORMITORY",
    region: "Tashkent",
    district: "Yunusobod",
    city: "Tashkent",
    address: "12 Amir Temur Avenue, Tashkent",
    university: "TUIT",
    description:
      "University-verified dormitory with 24/7 security, modern study zones, and easy campus access.",
    distanceKm: 1.2,
    rating: 4.7,
    verified: true,
    monthlyPrice: 850000,
    availableBeds: 14,
    totalBeds: 320,
    genderPolicy: null,
    amenities: ["WiFi", "Kitchen", "Laundry", "Hot Water", "Security", "Study Room"],
    rules: ["No smoking", "Quiet hours after 22:00", "Visitors until 20:00"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80"
    ],
    videoUrl: "https://example.com/video/tuit-residence-a",
    rooms: [
      { roomNumber: "A-204", capacity: 4, occupiedBeds: 3, freeBeds: 1, genderRestriction: "MALE" },
      { roomNumber: "A-210", capacity: 4, occupiedBeds: 2, freeBeds: 2, genderRestriction: "FEMALE" }
    ]
  },
  {
    id: "h2",
    name: "Samarqand Women Hostel",
    type: "HOSTEL",
    region: "Samarqand",
    district: "Siab",
    city: "Samarqand",
    address: "45 Registon Street, Samarqand",
    university: "SamSU",
    description: "Safe hostel tailored for female students with biometric access and health center.",
    distanceKm: 2.4,
    rating: 4.5,
    verified: true,
    monthlyPrice: 1100000,
    availableBeds: 0,
    totalBeds: 140,
    genderPolicy: "FEMALE",
    amenities: ["WiFi", "Kitchen", "Security", "Gym", "Laundry"],
    rules: ["Female-only accommodation", "ID checks required", "No overnight guests"],
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80"
    ],
    videoUrl: "https://example.com/video/sam-hostel",
    rooms: [
      { roomNumber: "B-101", capacity: 6, occupiedBeds: 6, freeBeds: 0, genderRestriction: "FEMALE" },
      { roomNumber: "B-109", capacity: 4, occupiedBeds: 4, freeBeds: 0, genderRestriction: "FEMALE" }
    ]
  },
  {
    id: "h3",
    name: "Private Student Flats Chilonzor",
    type: "APARTMENT",
    region: "Tashkent",
    district: "Chilonzor",
    city: "Tashkent",
    address: "89 Bunyodkor Avenue, Tashkent",
    university: "WIUT",
    description: "Verified private apartments with flexible contracts and transport connectivity.",
    distanceKm: 3.8,
    rating: 4.2,
    verified: false,
    monthlyPrice: 1750000,
    availableBeds: 6,
    totalBeds: 36,
    genderPolicy: null,
    amenities: ["WiFi", "Kitchen", "Hot Water", "Laundry"],
    rules: ["Shared utility payments", "Deposit required", "Maximum 3 tenants per room"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80"
    ],
    videoUrl: "https://example.com/video/chilonzor-flat",
    rooms: [
      { roomNumber: "C-3", capacity: 3, occupiedBeds: 2, freeBeds: 1, genderRestriction: null },
      { roomNumber: "C-7", capacity: 3, occupiedBeds: 1, freeBeds: 2, genderRestriction: null }
    ]
  }
];

const students: StudentProfile[] = [
  {
    id: "s1",
    fullName: "Akmal Rakhimov",
    pinfl: "30212229990011",
    gender: "MALE",
    dateOfBirth: "2002-12-22",
    address: "Tashkent city, Shaykhontohur district",
    university: "TUIT",
    faculty: "Software Engineering",
    course: 3,
    phoneNumber: "+998901112233",
    email: "akmal@example.uz"
  },
  {
    id: "s2",
    fullName: "Madina Karimova",
    pinfl: "30211010000009",
    gender: "FEMALE",
    dateOfBirth: "2003-01-10",
    address: "Samarqand city, Siab district",
    university: "SamSU",
    faculty: "Philology",
    course: 2,
    phoneNumber: "+998933331144",
    email: "madina@example.uz"
  }
];

const applications: Application[] = [
  {
    id: "a1",
    studentId: "s1",
    housingId: "h1",
    status: "UNDER_REVIEW",
    createdAt: new Date().toISOString()
  }
];

const queueEntries: QueueEntry[] = [
  {
    id: "q1",
    studentId: "s2",
    housingId: "h2",
    position: 1,
    priorityScore: 96,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    reservedUntil: null
  }
];

const payments: Payment[] = [];
const notifications: Notification[] = [];

export function getHousing(filters?: {
  city?: string;
  type?: string;
  gender?: string;
  university?: string;
  minPrice?: number;
  maxPrice?: number;
  verified?: boolean;
}) {
  let data = [...housingData];
  const minPrice = filters?.minPrice;
  const maxPrice = filters?.maxPrice;
  const verified = filters?.verified;

  if (filters?.city) data = data.filter((h) => h.city.toLowerCase() === filters.city?.toLowerCase());
  if (filters?.type) data = data.filter((h) => h.type === filters.type);
  if (filters?.gender) data = data.filter((h) => !h.genderPolicy || h.genderPolicy === filters.gender);
  if (filters?.university) data = data.filter((h) => h.university === filters.university);
  if (typeof minPrice === "number") data = data.filter((h) => h.monthlyPrice >= minPrice);
  if (typeof maxPrice === "number") data = data.filter((h) => h.monthlyPrice <= maxPrice);
  if (typeof verified === "boolean") data = data.filter((h) => h.verified === verified);

  return data.sort((a, b) => Number(b.verified) - Number(a.verified) || b.rating - a.rating);
}

export function getHousingById(id: string) {
  return housingData.find((h) => h.id === id) ?? null;
}

export function getStudentById(id: string) {
  return students.find((s) => s.id === id) ?? null;
}

export function createApplication(studentId: string, housingId: string) {
  const student = getStudentById(studentId);
  const housing = getHousingById(housingId);

  if (!student) throw new Error("Student not found");
  if (!housing) throw new Error("Housing not found");

  if (housing.genderPolicy && housing.genderPolicy !== student.gender) {
    throw new Error("Gender restriction violation");
  }

  const hasBed = housing.availableBeds > 0;
  const status: Application["status"] = hasBed ? "SUBMITTED" : "WAITLISTED";

  const application: Application = {
    id: randomUUID(),
    studentId,
    housingId,
    status,
    createdAt: new Date().toISOString()
  };

  applications.push(application);

  notifications.push({
    id: randomUUID(),
    studentId,
    type: "APPLICATION_SUBMITTED",
    channel: "IN_APP",
    message: `Application ${application.id} submitted for ${housing.name}`,
    createdAt: new Date().toISOString()
  });

  if (!hasBed) {
    joinQueue(studentId, housingId, 60);
  }

  return application;
}

export function getApplications(studentId?: string) {
  return studentId ? applications.filter((a) => a.studentId === studentId) : applications;
}

export function joinQueue(studentId: string, housingId: string, priorityScore: number) {
  const existing = queueEntries
    .filter((q) => q.housingId === housingId)
    .sort((a, b) => b.priorityScore - a.priorityScore || Date.parse(a.joinedAt) - Date.parse(b.joinedAt));

  const queueItem: QueueEntry = {
    id: randomUUID(),
    studentId,
    housingId,
    position: existing.length + 1,
    priorityScore,
    joinedAt: new Date().toISOString(),
    reservedUntil: null
  };

  queueEntries.push(queueItem);
  rebalanceQueue(housingId);
  return queueItem;
}

function rebalanceQueue(housingId: string) {
  const ordered = queueEntries
    .filter((q) => q.housingId === housingId)
    .sort((a, b) => b.priorityScore - a.priorityScore || Date.parse(a.joinedAt) - Date.parse(b.joinedAt));

  ordered.forEach((entry, idx) => {
    entry.position = idx + 1;
  });
}

export function processVacancy(housingId: string) {
  const next = queueEntries
    .filter((q) => q.housingId === housingId)
    .sort((a, b) => a.position - b.position)[0];

  if (!next) return null;

  next.reservedUntil = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString();

  notifications.push({
    id: randomUUID(),
    studentId: next.studentId,
    type: "HOUSING_VACANCY",
    channel: "IN_APP",
    message: `A bed is reserved for you for 12 hours in ${housingId}`,
    createdAt: new Date().toISOString()
  });

  return next;
}

export function getQueue(housingId?: string) {
  return housingId ? queueEntries.filter((q) => q.housingId === housingId) : queueEntries;
}

export function createPayment(input: {
  studentId: string;
  amount: number;
  provider: Payment["provider"];
}) {
  const payment: Payment = {
    id: randomUUID(),
    paymentId: `SSHE-${Date.now()}`,
    studentId: input.studentId,
    amount: input.amount,
    provider: input.provider,
    success: true,
    createdAt: new Date().toISOString()
  };

  payments.push(payment);

  notifications.push({
    id: randomUUID(),
    studentId: input.studentId,
    type: "PAYMENT_SUCCESS",
    channel: "IN_APP",
    message: `Payment ${payment.paymentId} succeeded via ${input.provider}`,
    createdAt: new Date().toISOString()
  });

  return {
    ...payment,
    receipt: {
      receiptId: `RCP-${payment.paymentId}`,
      issuedAt: payment.createdAt
    }
  };
}

export function getPayments(studentId?: string) {
  return studentId ? payments.filter((p) => p.studentId === studentId) : payments;
}

export function getNotifications(studentId?: string) {
  return studentId ? notifications.filter((n) => n.studentId === studentId) : notifications;
}

export function getStats() {
  const universities = new Set(housingData.map((h) => h.university));
  return {
    universities: universities.size,
    housingObjects: housingData.length,
    availableBeds: housingData.reduce((acc, h) => acc + h.availableBeds, 0),
    registeredStudents: students.length,
    totalApplications: applications.length,
    activeQueueEntries: queueEntries.length,
    monthlyRevenue: payments.reduce((acc, p) => acc + (p.success ? p.amount : 0), 0)
  };
}

export function getFeaturedHousing() {
  return [...housingData]
    .sort((a, b) => Number(b.verified) - Number(a.verified) || b.rating - a.rating)
    .slice(0, 3);
}
