import { NextResponse } from "next/server";

function clearSession(response: NextResponse) {
  response.cookies.set("talabajoy_session", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  return response;
}

export async function GET(request: Request) {
  return clearSession(NextResponse.redirect(new URL("/", request.url)));
}

export async function POST() {
  return clearSession(NextResponse.json({ message: "Chiqildi" }, { status: 200 }));
}