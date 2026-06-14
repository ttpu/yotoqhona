import { NextResponse } from "next/server";
import { getHousingById } from "@/lib/data";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const item = getHousingById(params.id);
  if (!item) {
    return NextResponse.json({ message: "Housing not found" }, { status: 404 });
  }
  return NextResponse.json({ data: item });
}
