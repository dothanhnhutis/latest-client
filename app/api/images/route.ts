import { ImageRes } from "@/common.type";
import { authOptions } from "@/lib/auth";
import { httpExternal } from "@/lib/httpExternal";
import { isBase64DataURL } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.data && body.data.length > 0 && isBase64DataURL(body.data)) {
      const { data } = await httpExternal.post<ImageRes>(`/images`, body);
      return NextResponse.json(data, { status: 200 });
    }
    return NextResponse.json({ message: "upload image fail" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 }
    );
  }
}
