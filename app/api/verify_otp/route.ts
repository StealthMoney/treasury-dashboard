import { NextRequest, NextResponse } from "next/server"
import endpoints from "@/app/config/endpoints"

export async function POST(request: NextRequest) {
	try {
		const { otp_challenge_id, code } = await request.json()

		if (!otp_challenge_id || !code) {
			return NextResponse.json(
				{ message: "otp_challenge_id and code are required" },
				{ status: 400 }
			)
		}

		const url = endpoints().auth["verify-otp"]
		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify({ otp_challenge_id, code }),
			headers: { "Content-Type": "application/json" },
		})

		const data = await response.json()
		return NextResponse.json(data, { status: response.status })
	} catch (error) {
		console.error("OTP verify error:", error)
		return NextResponse.json(
			{ status: "error", message: "An unexpected error occurred" },
			{ status: 500 }
		)
	}
}
