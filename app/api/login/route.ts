import { NextRequest, NextResponse } from "next/server"
import endpoints from "@/app/config/endpoints"

export async function POST(request: NextRequest) {
	try {
		const { username, password } = await request.json()

		if (!username || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			)
		}

		const url = endpoints().auth.login
		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify({ username, password }),
			headers: {
				"Content-Type": "application/json",
			},
		})

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error("Login error:", error)
		return NextResponse.json(
			{ status: "error", message: "An unexpected error occurred" },
			{ status: 500 }
		)
	}
}
