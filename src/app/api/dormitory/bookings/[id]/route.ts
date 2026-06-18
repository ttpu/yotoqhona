import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseSessionCookie } from "@/lib/session";
import { updateBookingStatus } from "@/lib/dormitory-store";

const patchSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "CHECKED_IN", "CHECKED_OUT"])
});

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const sessionUser = parseSessionCookie(request.cookies.get("talabajoy_session")?.value);

  if (!sessionUser || sessionUser.role !== "UNIVERSITY_PROVIDER") {
    return NextResponse.json({ message: "Bu amalga ruxsatingiz yo'q" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const payload = patchSchema.parse(body);

    const booking = await updateBookingStatus(params.id, payload.status, sessionUser.id);
    return NextResponse.json({ message: "Holat yangilandi", booking });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Noto'g'ri holat" }, { status: 400 });
    }
    return NextResponse.json(
      { message: (error as Error).message || "Yangilashda xatolik" },
      { status: 400 }
    );
  }
}
