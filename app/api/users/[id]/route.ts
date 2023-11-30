import { UserRes } from "@/common.type";
import { httpExternal } from "@/lib/httpExternal";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await request.json()) as UserRes;
    const { data } = await httpExternal.patch(`/users/${params.id}`, {
      address: body.address,
      avatarUrl: body.avatarUrl,
      bio: body.bio,
      email: body.email,
      isActive: body.isActive,
      phone: body.phone,
      role: body.role,
      username: body.username,
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ ok: "something went wrong" }, { status: 500 });
  }
}
