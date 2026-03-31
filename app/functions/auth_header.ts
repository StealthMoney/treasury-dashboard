import { auth } from "../types/auth"

export const getAuthHeaders = async (isJson: boolean = true) => {
	const session = await auth()
	if (!session) return null

	const { accessToken } = session

	const baseHeaders: Record<string, string> = {
		Authorization: `Bearer ${accessToken}`,
	}

	if (isJson) baseHeaders["Content-Type"] = "application/json"

	return baseHeaders
}