import { NextResponse } from "next/server"

export async function GET(req: Request) {
	const forwardedFor = req.headers.get("x-forwarded-for")
	const realIp = req.headers.get("x-real-ip")

	const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown"

	return NextResponse.json({ success: true, ip })
}
