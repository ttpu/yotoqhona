import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseSessionCookie } from "@/lib/session";
import { createSupportMessage } from "@/lib/support-store";

const messageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5).max(2000)
});

export async function POST(request: NextRequest) {
  const sessionUser = parseSessionCookie(request.cookies.get("talabajoy_session")?.value);

  try {
    const body = await request.json();
    const payload = messageSchema.parse(body);

    await createSupportMessage({
      userId: sessionUser?.id,
      name: payload.name,
      email: payload.email,
      message: payload.message
    });

    return NextResponse.json({ message: "Xabaringiz qabul qilindi" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Ma'lumotlar to'liq emas" }, { status: 400 });
    }
    return NextResponse.json(
      { message: (error as Error).message || "Xabarni yuborishda xatolik" },
      { status: 400 }
    );
  }
}
