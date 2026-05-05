import { NextResponse } from "next/server";
import { verifyAdminCredentials, setAdminSession } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (verifyAdminCredentials(username, password)) {
      await setAdminSession(username);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { ok: false, error: "INVALID_CREDENTIALS" },
      { status: 401 }
    );
  } catch (error) {
    console.error("[AdminLogin] Error:", error);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
