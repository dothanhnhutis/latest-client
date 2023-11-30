import { httpExternal } from "@/lib/httpExternal";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = await httpExternal.post<{
      id: string;
      email: string;
      username: string;
      avatarUrl: string;
      role: string;
      status: string;
      token: string;
    }>("/auth/signin/provider", body);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ ok: "something went wrong" }, { status: 500 });
  }
}
