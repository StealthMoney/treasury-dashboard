import { getAuthHeaders } from "../functions/auth_header"
import endpoints from "../config/endpoints"
import { Result } from "../types/general"
import { Banklist, NameInquiryResponse } from "../types/general"

export const getBankLists = async (): Promise<Result<Banklist[]>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints().banks.list

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

		return { success: true, data: response as Banklist[] }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}

export const Verifybankdetails = async (
	accountNumber: string,
	bankCode: string
): Promise<Result<NameInquiryResponse>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints(accountNumber, bankCode).banks.verify

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

		return { success: true, data: response as NameInquiryResponse }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}
