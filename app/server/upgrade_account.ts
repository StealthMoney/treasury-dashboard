"use client"

import { getAuthHeaders } from "../functions/auth_header"
import { AppuserProps } from "../types/app_user"
import { Result } from "../types/general"
import endpoints from "../config/endpoints"

type AuthHeaders = {
	Authorization: string
	"Content-Type": string
}

export const uploadKybDoc = async (
	session: AuthHeaders | null,
	body: string
): Promise<Result<AppuserProps>> => {
	try {
		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints().account["upgrade-account"]

		const res = await fetch(url, {
			method: "POST",
			headers: session,
			body: body,
		})

		if (!res.ok) {
			try {
				const data = await res.json()
				return {
					success: false,
					error: data.message || "Failed to upload documents",
				}
			} catch (_) {
				console.log(_)
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
