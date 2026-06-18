export type SessionRole = "STUDENT" | "UNIVERSITY_PROVIDER" | "PRIVATE_PROVIDER";

export type SessionUser = {
  id: string;
  email: string;
  displayName: string;
  role: SessionRole;
  status: string;
  verified: boolean;
  university?: string;
  faculty?: string;
  course?: string;
  organizationName?: string;
  gender?: "MALE" | "FEMALE";
};

export function parseSessionCookie(value: string | undefined): SessionUser | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;

    if (
      typeof parsed.id !== "string" ||
      typeof parsed.displayName !== "string" ||
      typeof parsed.role !== "string"
    ) {
      return null;
    }

    return {
      id: parsed.id,
      email: typeof parsed.email === "string" ? parsed.email : "",
      displayName: parsed.displayName,
      role: parsed.role as SessionRole,
      status: typeof parsed.status === "string" ? parsed.status : "ACTIVE",
      verified: Boolean(parsed.verified),
      university: typeof parsed.university === "string" ? parsed.university : undefined,
      faculty: typeof parsed.faculty === "string" ? parsed.faculty : undefined,
      course: typeof parsed.course === "string" ? parsed.course : undefined,
      organizationName: typeof parsed.organizationName === "string" ? parsed.organizationName : undefined,
      gender: parsed.gender === "MALE" || parsed.gender === "FEMALE" ? parsed.gender : undefined,
    };
  } catch {
    return null;
  }
}
