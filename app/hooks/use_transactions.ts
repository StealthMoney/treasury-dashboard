import { useQuery } from "@tanstack/react-query"

export const useTransactions = (params?: Record<string, string>) => {
	return useQuery({
		queryKey: ["transactios__", params],
		queryFn: async () => {
			const queryString = params
				? `?${new URLSearchParams(params).toString()}`
				: ""

			const res = await fetch(`/api/admin/transactions${queryString}`)
			const data = await res.json()

			if (!res.ok) throw new Error(data.error)

			return data
		},
	})
}
