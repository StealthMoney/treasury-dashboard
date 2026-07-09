import { useQuery } from "@tanstack/react-query"

export const useCreditHistory = (params?: Record<string, string>) => {
	return useQuery({
		queryKey: ["credit-history", params?.page],
		queryFn: async () => {
			const queryString = params
				? `?${new URLSearchParams(params).toString()}`
				: ""

			const res = await fetch(`/api/credit${queryString}`)
			const data = await res.json()

			if (!res.ok) throw new Error(data.error)

			return data
		},
	})
}

export const useCreditTypes = () => {
	return useQuery({
		queryKey: ["credit-types"],
		queryFn: async () => {
			const res = await fetch("/api/credit/types")
			const data = await res.json()

			if (!res.ok) throw new Error(data.error)

			return data
		},
	})
}

export const useCreditAdmin = (params?: Record<string, string>) => {
	return useQuery({
		queryKey: ["credit-history-admin", params],
		queryFn: async () => {
			const queryString = params
				? `?${new URLSearchParams(params).toString()}`
				: ""

			const res = await fetch(`/api/admin/credit${queryString}`)
			const data = await res.json()

			if (!res.ok) throw new Error(data.error)

			return data
		},
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: true,
		refetchOnWindowFocus: true,
	})
}

export const useCreditAdminStats = () => {
	return useQuery({
		queryKey: ["credit-history-admin-stats"],
		queryFn: async () => {
			const res = await fetch(`/api/admin/credit/stats`)
			const data = await res.json()

			if (!res.ok) throw new Error(data.error)

			return data
		},
	})
}
