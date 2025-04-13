import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const token = await session.getToken();

  return NextResponse.json({ token });
}
