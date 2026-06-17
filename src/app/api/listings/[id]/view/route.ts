import { NextRequest, NextResponse } from "next/server";
import { getListingById, incrementViewCount } from "@/lib/listings-store";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const listing = await getListingById(params.id);
  if (!listing) return NextResponse.json({ message: "E'lon topilmadi" }, { status: 404 });

  const cookieName = `seen_${params.id}`;
  const alreadySeen = request.cookies.get(cookieName)?.value === "1";

  if (!alreadySeen) {
    await incrementViewCount(params.id);
  }

  const response = NextResponse.json({ counted: !alreadySeen });
  response.cookies.set(cookieName, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24
  });
  return response;
}
