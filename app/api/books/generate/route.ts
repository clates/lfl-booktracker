import { NextResponse } from "next/server";
import { generateBookId } from "@/lib/id_generator";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const {
      location: { lat, long },
    } = await request.json();

    const code = await generateBookId(lat, long);

    return NextResponse.json({ code });
  } catch (error) {
    console.error("Error generating a book code:", error);
    return NextResponse.json(
      { error: "Failed to create code" },
      { status: 500 }
    );
  }
}
