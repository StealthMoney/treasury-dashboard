"use server"

import { getAuthHeaders } from "../functions/auth_header"
import endpoints from "../config/endpoints"
import {
	Result,
	LoanType,
	InitiateLoanRepaymentDetails,
	RepaymentRecord,
	PaginatedLoanApplicationResponse,
} from "../types/general"

export const getCreditHistory = async (
	param?: string
): Promise<Result<PaginatedLoanApplicationResponse>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints(param).credit.getcredithistory

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

		return { success: true, data: response as PaginatedLoanApplicationResponse }
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

export const repayCreditInitiate = async (
	body: string
): Promise<Result<InitiateLoanRepaymentDetails>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints().credit["initiate-repay"]

		console.log(body)

		const res = await fetch(url, {
			method: "POST",
			headers: session,
			body: body,
		})

		console.log(res, "at initiate")

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

		return { success: true, data: response as InitiateLoanRepaymentDetails }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}

export const repayCreditFinish = async (
	body: string
): Promise<Result<RepaymentRecord>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints().credit["finish-repay"]

		console.log(body)

		const res = await fetch(url, {
			method: "POST",
			headers: session,
			body: body,
		})

		console.log(res, "at repay finish")

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

		return { success: true, data: response as RepaymentRecord }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}
