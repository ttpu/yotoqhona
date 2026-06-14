import { NextRequest, NextResponse } from "next/server";
import { getStudentById } from "@/lib/data";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { oneIdToken?: string; studentId?: string };

  if (!body.oneIdToken && !body.studentId) {
    return NextResponse.json({ message: "oneIdToken or studentId is required" }, { status: 400 });
  }

  const student = getStudentById(body.studentId ?? "s1");
  if (!student) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      fullName: student.fullName,
      pinfl: student.pinfl,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      address: student.address,
      university: student.university,
      faculty: student.faculty,
      course: student.course,
      phoneNumber: student.phoneNumber,
      email: student.email
    }
  });
}
