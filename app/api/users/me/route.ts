import { httpExternal } from "@/lib/httpExternal";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { data } = await httpExternal.get("/users/me");
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log(error.response);
    return NextResponse.json({ ok: "something went wrong" }, { status: 500 });
  }
}
