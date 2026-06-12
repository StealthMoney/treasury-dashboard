"use server"

import { getAuthHeaders } from "../functions/auth_header"
import endpoints from "../config/endpoints"
import { TransactionPageData } from "../types/general"
import { Result } from "../types/general"

export const getTransactionDetails = async (
	param?: string
): Promise<Result<TransactionPageData>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints(param).transactions["view-transactions"]

		const res = await fetch(url, {
			method: "GET",
			headers: session,
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

		return { success: true, data: response as TransactionPageData }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}
