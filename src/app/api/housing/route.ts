import { NextRequest, NextResponse } from "next/server";
import { getHousing } from "@/lib/data";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const result = getHousing({
    city: sp.get("city") ?? undefined,
    type: sp.get("type") ?? undefined,
    gender: sp.get("gender") ?? undefined,
    university: sp.get("university") ?? undefined,
    minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
    maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
    verified: sp.get("verified") ? sp.get("verified") === "true" : undefined
  });

  return NextResponse.json({ data: result });
}
