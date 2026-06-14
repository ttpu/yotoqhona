import { NextRequest, NextResponse } from "next/server";
import { createPayment, getPayments } from "@/lib/data";

export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get("studentId") ?? undefined;
  const data = getPayments(studentId).map((p) => ({
    ...p,
    receiptUrl: `/api/payments/receipt/${p.paymentId}`
  }));

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    studentId: string;
    amount: number;
    provider: "CLICK" | "PAYME" | "UZUM" | "PAYNET";
  };

  const payment = createPayment(body);
  return NextResponse.json({ data: payment }, { status: 201 });
}
