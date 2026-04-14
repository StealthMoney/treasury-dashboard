import endpoints from "@/app/config/endpoints"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
	const url = endpoints().auth["reset-password"]

	let payload
	try {
		payload = await request.json()
	} catch {
		return NextResponse.json(
			{ success: false, message: "Bad input" },
			{ status: 400 }
		)
	}

	try {
		const res = await fetch(url, {
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		})

		let data = null
		try {
			data = await res.json()
		} catch {
			data = null
		}

		if (!res.ok) {
			return NextResponse.json(
				{
					success: false,
					message: data?.message || "Request failed",
					error: data?.error,
				},
				{ status: res.status }
			)
		}

		return NextResponse.json(
			{ success: true, message: "User created" },
			{ status: 200 }
		)
	} catch (error) {
		console.error("Reset password error:", error)
		return NextResponse.json(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "Error resetting password",
			},
			{ status: 500 }
		)
	}
}
