"use server"
import { getAuthHeaders } from "../functions/auth_header"
import endpoints from "../config/endpoints"
import { Result } from "../types/general"

export const changePassword = async (
	body: string
): Promise<Result<{ message: string }>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints().auth["change-password"]

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

		return { success: true, data: response }
	} catch (err) {
		console.error("change password error", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}
