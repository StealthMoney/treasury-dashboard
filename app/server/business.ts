"use server"

import { getAuthHeaders } from "../functions/auth_header"
import endpoints from "../config/endpoints"
import {
	Business,
	BusinessDirector,
	BusinessDocument,
	BusinessDocumentPageResponse,
	BusinessOverviewResponse,
	BusinessResponse,
	BusinessStats,
	DocumentStats,
} from "../types/general"
import { Result } from "../types/general"

export const getBusinesses = async (
	param?: string
): Promise<Result<BusinessResponse>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints(param).businesses.list

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

		return { success: true, data: response as BusinessResponse }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}

export const getBusinessesDetails = async (
	param: string
): Promise<Result<BusinessResponse>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints(param).businesses["business-details"]

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

		return { success: true, data: response as BusinessResponse }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}

export const updateBusinessStatus = async (
	param: string,
	payload: string
): Promise<Result<Business>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints(param).businesses["update-business-status"]

		const res = await fetch(url, {
			method: "POST",
			headers: session,
			body: payload,
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

		return { success: true, data: response as Business }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}

export const getBusinessesDirectors = async (
	param: string
): Promise<Result<BusinessDirector[]>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints(param).businesses["business-directors"]

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

		return { success: true, data: response as BusinessDirector[] }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}

export const updateBusinessDirectors = async (
	body: string,
	param: string,
	param2: string
): Promise<Result<BusinessDirector>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints(param, param2).businesses["update-business-directors"]

		const res = await fetch(url, {
			method: "POST",
			headers: session,
			body: body,
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

		return { success: true, data: response as BusinessDirector }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}

export const getBusinessesDocuments = async (
	param: string
): Promise<Result<BusinessDocumentPageResponse>> => {
	try {
		const session = await getAuthHeaders(false)

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints(param).businesses["business-documents"]

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

		return { success: true, data: response as BusinessDocumentPageResponse }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}

export const getBusinessesDocumentsStats = async (): Promise<
	Result<DocumentStats>
> => {
	try {
		const session = await getAuthHeaders(false)

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints().businesses["business-documents-stats"]

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

		return { success: true, data: response as DocumentStats }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}

export const getBusinessStats = async (): Promise<Result<BusinessStats>> => {
	try {
		const session = await getAuthHeaders(false)

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints().businesses["business-stats"]

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

		return { success: true, data: response as BusinessStats }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}

export const updateBusinessDocuments = async (
	body: string,
	param: string
): Promise<Result<BusinessDocument>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints(param).businesses["update-business-document"]

		const res = await fetch(url, {
			method: "POST",
			headers: session,
			body: body,
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

		return { success: true, data: response as BusinessDocument }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}

export const updateBusinessesLimit = async (
	payload: string,
	param: string
): Promise<Result<BusinessResponse>> => {
	try {
		const session = await getAuthHeaders()

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints(param).businesses["update-business-limit"]

		const res = await fetch(url, {
			method: "PATCH",
			headers: session,
			body: payload,
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

		return { success: true, data: response as BusinessResponse }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}

export const getBusinessesStats = async (
	param: string
): Promise<Result<BusinessOverviewResponse>> => {
	try {
		const session = await getAuthHeaders(false)

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints(param).businesses["business-overview"]

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

		return { success: true, data: response as BusinessOverviewResponse }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}

export const showBusinessesDocuments = async (
	param: string
): Promise<Result<Blob>> => {
	try {
		const session = await getAuthHeaders(false)

		if (!session) {
			return { success: false, error: "No session found" }
		}

		const url = endpoints(param).businesses["view-document"]

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

		const response = await res.blob()

		return { success: true, data: response }
	} catch (err) {
		console.error("Something went wrong", err)
		return {
			success: false,
			error: err instanceof Error ? err.message : "An unknown error occurred",
		}
	}
}
