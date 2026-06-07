import { useQuery } from "@tanstack/react-query"

export const useBusinesses = (params?: Record<string, string>) => {
	return useQuery({
		queryKey: ["businesses", params],
		queryFn: async () => {
			const queryString = params
				? `?${new URLSearchParams(params).toString()}`
				: ""

			const res = await fetch(`/api/admin/businesses${queryString}`)
			const data = await res.json()

			if (!res.ok) throw new Error(data.error)

			return data
		},
	})
}

export const useBusinessesDetails = (params: string) => {
	return useQuery({
		queryKey: [params, params],
		queryFn: async () => {
			const res = await fetch(`/api/admin/business/${params}`)
			const data = await res.json()

			if (!res.ok) throw new Error(data.error)

			return data
		},
	})
}

export const useBusinessesDirectors = (params: string) => {
	return useQuery({
		queryKey: ["directors", params],
		queryFn: async () => {
			const res = await fetch(`/api/admin/business/directors/${params}`)
			const data = await res.json()

			if (!res.ok) throw new Error(data.error)

			return data
		},
	})
}

export const useBusinessesDocuments = (
	params: Record<string, string>,
	enabled: boolean
) => {
	return useQuery({
		queryKey: ["documents", params],
		enabled: enabled,
		queryFn: async () => {
			const queryString = params
				? `?${new URLSearchParams(params).toString()}`
				: ""
			const res = await fetch(`/api/admin/business/documents${queryString}`)
			const data = await res.json()

			if (!res.ok) throw new Error(data.error)

			return data
		},
	})
}
