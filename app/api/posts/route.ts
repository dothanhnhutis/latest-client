import { httpExternal } from "@/lib/httpExternal";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = await httpExternal.post("/blogs", body);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log(error.response.data);
    return NextResponse.json({ ok: "something went wrong" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data } = await httpExternal.get("/blogs");
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ ok: "something went wrong" }, { status: 500 });
  }
}
