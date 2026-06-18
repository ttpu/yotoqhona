import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export type StoredUserRole = "STUDENT" | "UNIVERSITY_PROVIDER" | "PRIVATE_PROVIDER";
export type StoredAccountStatus = "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED" | "SUSPENDED" | "ACTIVE";

export type StoredUser = {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: StoredUserRole;
  status: StoredAccountStatus;
  verified: boolean;
  createdAt: string;
  university?: string;
  faculty?: string;
  course?: string;
  organizationName?: string;
  gender?: "MALE" | "FEMALE";
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "users.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, "[]", "utf8");
  }
}

async function readUsers() {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw) as StoredUser[];
}

async function writeUsers(users: StoredUser[]) {
  await ensureStore();
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2), "utf8");
}

export async function findUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((item) => item.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createStoredUser(input: {
  email: string;
  password: string;
  displayName: string;
  role: StoredUserRole;
  status: StoredAccountStatus;
  verified: boolean;
  university?: string;
  faculty?: string;
  course?: string;
  organizationName?: string;
  gender?: "MALE" | "FEMALE";
}) {
  const users = await readUsers();
  const existing = users.find((item) => item.email.toLowerCase() === input.email.toLowerCase());

  if (existing) {
    throw new Error("Bu email bilan akkaunt allaqachon mavjud");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user: StoredUser = {
    id: crypto.randomUUID(),
    email: input.email,
    passwordHash,
    displayName: input.displayName,
    role: input.role,
    status: input.status,
    verified: input.verified,
    createdAt: new Date().toISOString(),
    university: input.university,
    faculty: input.faculty,
    course: input.course,
    organizationName: input.organizationName,
    gender: input.gender
  };

  users.push(user);
  await writeUsers(users);
  return user;
}

export async function setUserGender(userId: string, gender: "MALE" | "FEMALE") {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], gender };
  await writeUsers(users);
  return users[idx];
}

export async function verifyCredentials(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid ? user : null;
}