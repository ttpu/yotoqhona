import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseSessionCookie } from "@/lib/session";
import { payInvoice } from "@/lib/payments-store";

const paySchema = z.object({
  provider: z.enum(["PAYME", "CLICK"])
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const sessionUser = parseSessionCookie(request.cookies.get("talabajoy_session")?.value);
  if (!sessionUser || sessionUser.role !== "STUDENT") {
    return NextResponse.json({ message: "Faqat talabalar to'lov qila oladi" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const payload = paySchema.parse(body);

    const invoice = await payInvoice(params.id, sessionUser.id, payload.provider);
    return NextResponse.json({ message: "To'lov muvaffaqiyatli amalga oshirildi", invoice });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Noto'g'ri to'lov tizimi" }, { status: 400 });
    }
    return NextResponse.json(
      { message: (error as Error).message || "To'lovda xatolik" },
      { status: 400 }
    );
  }
}
