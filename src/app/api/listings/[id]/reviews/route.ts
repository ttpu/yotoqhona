import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseSessionCookie } from "@/lib/session";
import { addReview, getListingById, getReviewsForListing } from "@/lib/listings-store";

const reviewSchema = z.object({
  score: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(3).max(1000)
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const reviews = await getReviewsForListing(params.id);
  return NextResponse.json({ reviews });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const sessionUser = parseSessionCookie(request.cookies.get("talabajoy_session")?.value);
  if (!sessionUser) {
    return NextResponse.json({ message: "Tizimga kiring" }, { status: 401 });
  }

  const listing = await getListingById(params.id);
  if (!listing) return NextResponse.json({ message: "E'lon topilmadi" }, { status: 404 });

  try {
    const body = await request.json();
    const payload = reviewSchema.parse(body);

    const review = await addReview({
      listingId: params.id,
      userId: sessionUser.id,
      userName: sessionUser.displayName,
      score: payload.score as 1 | 2 | 3 | 4 | 5,
      comment: payload.comment
    });

    return NextResponse.json({ message: "Sharh qo'shildi", review }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Sharh ma'lumotlari noto'g'ri", issues: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: (error as Error).message || "Sharh qo'shishda xatolik" },
      { status: 500 }
    );
  }
}
