import { NextRequest, NextResponse } from "next/server";
import { getQueue, joinQueue, processVacancy } from "@/lib/data";

export async function GET(request: NextRequest) {
  const housingId = request.nextUrl.searchParams.get("housingId") ?? undefined;
  return NextResponse.json({ data: getQueue(housingId) });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as
    | { action: "join"; studentId: string; housingId: string; priorityScore: number }
    | { action: "vacancy"; housingId: string };

  if (body.action === "join") {
    const entry = joinQueue(body.studentId, body.housingId, body.priorityScore);
    return NextResponse.json({ data: entry }, { status: 201 });
  }

  const reserved = processVacancy(body.housingId);
  return NextResponse.json({ data: reserved, message: reserved ? "Reserved next candidate" : "Queue empty" });
}
