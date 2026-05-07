"use client"

import { Result } from "../types/general"

export const getUserIp = async (): Promise<Result<string>> => {
	try {
		const response = await fetch("/api/ip", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			let errorMessage = "could not process request"
			try {
				const data = await response.json()
				errorMessage = data?.message || errorMessage
			} catch (_) {
				console.log(_)
			}

			return {
				success: false,
				error: errorMessage,
			}
		}

		const data = await response.json()

		return {
			success: true,
			data: data.ip,
		}
	} catch (err) {
		console.error("Error fetching IP:", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "Request failed to process",
		}
	}
}
