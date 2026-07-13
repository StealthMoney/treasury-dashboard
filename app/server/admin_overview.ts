"use server"

import { getAuthHeaders } from "../functions/auth_header"
import endpoints from "../config/endpoints"
import { AdminOverviewResponse } from "../types/general"
import { Result } from "../types/general"

export const getAdminStats = async (
	param?: string
): Promise<Result<AdminOverviewResponse>> => {
	try {
		const session = await getAuthHeaders(false)

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints(param).admin.overview

		const res = await fetch(url, {
			method: "GET",
			headers: session,
		})

		if (!res.ok) {
			let errorMessage = "could not process request"
			try {
				const data = await res.json()
				errorMessage = data?.message || errorMessage
				console.log(errorMessage, "messa")
			} catch (_) {
				console.log(_)
			}

			return {
				success: false,
				error: errorMessage,
			}
		}

		const response = await res.json()

		return { success: true, data: response as AdminOverviewResponse }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}
