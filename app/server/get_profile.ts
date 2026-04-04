"use server"

import { getAuthHeaders } from "../functions/auth_header"
import { AppuserProps } from "../types/app_user"
import { Result } from "../types/general"
import endpoints from "../config/endpoints"

export const getProfile = async (): Promise<Result<AppuserProps>> => {
	const session = await getAuthHeaders(false)

	if (!session) {
		return { success: false, error: "No session found" }
	}

	const url = endpoints().user.navMenu

	const res = await fetch(url, {
		headers: session,
	})

	console.log(res, "111")

	if (!res.ok) {
		return { success: false, error: "Failed to fetch user profile" }
	}

	const profile = await res.json()

	return { success: true, data: profile as AppuserProps }
}
