import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseSessionCookie } from "@/lib/session";
import { createBookingRequest } from "@/lib/dormitory-store";

const bookingSchema = z.object({
  roomId: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const sessionUser = parseSessionCookie(request.cookies.get("talabajoy_session")?.value);

  if (!sessionUser) {
    return NextResponse.json({ message: "Tizimga kiring" }, { status: 401 });
  }
  if (sessionUser.role !== "STUDENT") {
    return NextResponse.json({ message: "Faqat talabalar joy band qila oladi" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const payload = bookingSchema.parse(body);

    const booking = await createBookingRequest({
      roomId: payload.roomId,
      studentId: sessionUser.id,
      studentName: sessionUser.displayName,
      studentCourse: sessionUser.course,
      studentFaculty: sessionUser.faculty,
      studentGender: sessionUser.gender
    });

    return NextResponse.json({ message: "So'rov yuborildi", booking }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Ma'lumotlar to'liq emas" }, { status: 400 });
    }
    return NextResponse.json(
      { message: (error as Error).message || "Bron qilishda xatolik" },
      { status: 400 }
    );
  }
}
