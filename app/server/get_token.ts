"use server"

import endpoints from "../config/endpoints"
import { getAuthHeaders } from "../functions/auth_header"
import { Result, payloadProps, TokenProp } from "../types/general"

export const refreshToken = async (
	payload: payloadProps
): Promise<Result<TokenProp>> => {
	const session = await getAuthHeaders(true)

	const url = endpoints().auth["refresh-token"]

	console.log()

	if (!session) {
		return { success: false, error: "No session found" }
	}

	const res = await fetch(url, {
		headers: session,
		method: "POST",
		body: JSON.stringify(payload),
	})

	if (!res.ok) {
		return { success: false, error: "Failed to get token" }
	}

	const response = await res.json()

	return { success: true, data: response as TokenProp }
}
