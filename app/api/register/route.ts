process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

import endpoints from "@/app/config/endpoints"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
	const url = endpoints().user.register

	let userData
	try {
		userData = await request.json()
	} catch {
		return NextResponse.json(
			{ success: false, message: "Bad input" },
			{ status: 400 }
		)
	}

	try {
		const res = await fetch(url, {
			body: JSON.stringify(userData),
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
			{ status: 201 }
		)
	} catch (error) {
		console.error("Register route error:", error)
		return NextResponse.json(
			{ success: false, message: "User not created" },
			{ status: 500 }
		)
	}
}
