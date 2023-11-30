import { NextRequest, NextResponse } from "next/server";
import { httpExternal } from "@/lib/httpExternal";

export async function GET(request: NextRequest) {
  try {
    const { data } = await httpExternal.get("/users");
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ ok: "something went wrong" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data } = await httpExternal.post("/users", body);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ ok: "something went wrong" }, { status: 500 });
  }
}
