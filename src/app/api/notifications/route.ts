import { NextRequest, NextResponse } from "next/server";
import { getNotifications } from "@/lib/data";

export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get("studentId") ?? undefined;
  return NextResponse.json({ data: getNotifications(studentId) });
}
