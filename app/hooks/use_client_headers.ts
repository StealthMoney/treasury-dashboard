"use client"
import { useSession } from "next-auth/react"

export const useClientHeaders = () => {
	const { data: session } = useSession()

	const headers = session
		? {
				Authorization: `Bearer ${session.accessToken}`,
				"Content-Type": "application/json",
			}
		: null

	return headers
}
