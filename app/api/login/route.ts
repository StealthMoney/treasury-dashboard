import { NextRequest, NextResponse } from "next/server"
import endpoints from "@/app/config/endpoints"

export async function POST(request: NextRequest) {
	try {
		const { username, password } = await request.json()

		console.log(username, password, "body")

		if (!username || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			)
		}

		const url = endpoints().auth.login
		console.log(url, "is server url")
		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify({ username, password }),
			headers: {
				"Content-Type": "application/json",
			},
		})

		console.log(response, "is response")

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
