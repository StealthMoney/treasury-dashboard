"use client"
import { AuthHeaders, Result } from "../types/general"
import endpoints from "../config/endpoints"

export const requestNewCredit = async (
	session: AuthHeaders | null,
	body: string
): Promise<Result<string>> => {
	try {
		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints().credit.requestnewcredit

		const res = await fetch(url, {
			method: "POST",
			headers: session,
			body: body,
		})

		if (!res.ok) {
			let errorMessage = "could not process request"
			try {
				const data = await res.json()
				errorMessage = data?.message || errorMessage
			} catch (_) {
				console.log(_)
			}

			return {
				success: false,
				error: errorMessage,
			}
		}

		const response = await res.json()

		return { success: true, data: response?.message || "Request successful" }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}
