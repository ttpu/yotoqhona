import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseSessionCookie } from "@/lib/session";
import { updateUserProfile } from "@/lib/auth-store";

const patchSchema = z.object({
  phone: z.string().min(7).optional(),
  organizationName: z.string().min(2).optional()
});

export async function PATCH(request: NextRequest) {
  const sessionUser = parseSessionCookie(request.cookies.get("talabajoy_session")?.value);
  if (!sessionUser) {
    return NextResponse.json({ message: "Tizimga kiring" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = patchSchema.parse(body);

    const user = await updateUserProfile(sessionUser.id, payload);

    const response = NextResponse.json({ message: "Sozlamalar saqlandi" });
    response.cookies.set(
      "talabajoy_session",
      JSON.stringify({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        status: user.status,
        verified: user.verified,
        university: user.university,
        faculty: user.faculty,
        course: user.course,
        organizationName: user.organizationName,
        gender: user.gender,
        phone: user.phone
      }),
      {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      }
    );

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Ma'lumotlar noto'g'ri" }, { status: 400 });
    }
    return NextResponse.json(
      { message: (error as Error).message || "Saqlashda xatolik" },
      { status: 400 }
    );
  }
}
