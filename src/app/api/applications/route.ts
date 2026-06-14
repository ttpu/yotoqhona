import { NextRequest, NextResponse } from "next/server";
import { createApplication, getApplications } from "@/lib/data";

export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get("studentId") ?? undefined;
  return NextResponse.json({ data: getApplications(studentId) });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { studentId: string; housingId: string };
    const application = createApplication(body.studentId, body.housingId);
    return NextResponse.json({ data: application }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
