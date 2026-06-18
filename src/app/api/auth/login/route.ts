import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyCredentials } from "@/lib/auth-store";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());
    const user = await verifyCredentials(body.email, body.password);

    if (!user) {
      return NextResponse.json({ message: "Email yoki parol noto'g'ri" }, { status: 401 });
    }

    const response = NextResponse.json({ message: "Muvaffaqiyatli kirildi", redirectTo: "/" }, { status: 200 });

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
        gender: user.gender
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
      return NextResponse.json({ message: "Email va parolni to'g'ri kiriting" }, { status: 400 });
    }

    return NextResponse.json({ message: "Kirishda xatolik yuz berdi" }, { status: 500 });
  }
}