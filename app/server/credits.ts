"use server"

import { getAuthHeaders } from "../functions/auth_header"
import endpoints from "../config/endpoints"
import { Result, LoanType, LoanApplication } from "../types/general"

export const requestNewCredit = async (
	body: string
): Promise<Result<string>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints().credit.requestnewcredit

		console.log(body)

		const res = await fetch(url, {
			method: "POST",
			headers: session,
			body: body,
		})

		console.log(res, "at request credit")

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

export const getCreditHistory = async (): Promise<
	Result<LoanApplication[]>
> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints().credit.getcredithistory

		const res = await fetch(url, {
			method: "GET",
			headers: session,
		})

		console.log(res, "at request credit")

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

		return { success: true, data: response as LoanApplication[] }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}

export const getCreditTypes = async (): Promise<Result<LoanType[]>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints().credit["credit-type"]

		const res = await fetch(url, {
			method: "GET",
			headers: session,
		})

		console.log(res, "at request credit")

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

		return { success: true, data: response as LoanType[] }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}
