import { NextRequest, NextResponse } from "next/server";
import { parseSessionCookie } from "@/lib/session";
import { getListingById, toggleFavorite } from "@/lib/listings-store";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const sessionUser = parseSessionCookie(request.cookies.get("talabajoy_session")?.value);
  if (!sessionUser) {
    return NextResponse.json({ message: "Tizimga kiring" }, { status: 401 });
  }

  const listing = await getListingById(params.id);
  if (!listing) return NextResponse.json({ message: "E'lon topilmadi" }, { status: 404 });

  const favorited = await toggleFavorite(sessionUser.id, params.id);
  return NextResponse.json({ favorited });
}
