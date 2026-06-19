import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseSessionCookie } from "@/lib/session";
import { changeUserPassword } from "@/lib/auth-store";

const passwordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
});

export async function POST(request: NextRequest) {
  const sessionUser = parseSessionCookie(request.cookies.get("talabajoy_session")?.value);
  if (!sessionUser) {
    return NextResponse.json({ message: "Tizimga kiring" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = passwordSchema.parse(body);

    await changeUserPassword(sessionUser.id, payload.currentPassword, payload.newPassword);
    return NextResponse.json({ message: "Parol muvaffaqiyatli o'zgartirildi" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Parollar kamida 8 belgidan iborat bo'lishi kerak" }, { status: 400 });
    }
    return NextResponse.json(
      { message: (error as Error).message || "Parolni o'zgartirishda xatolik" },
      { status: 400 }
    );
  }
}
