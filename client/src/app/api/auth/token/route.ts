import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { getToken } = getAuth(request);
  const token = await getToken();

  return NextResponse.json({ token });
}
