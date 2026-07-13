import { useQuery } from "@tanstack/react-query"

export const useAdminStats = (params?: string) => {
	return useQuery({
		queryKey: ["admin", params],
		queryFn: async () => {
			const res = await fetch(`/api/admin?${params}`)
			const data = await res.json()

			if (!res.ok) throw new Error(data.error)

			return data
		},
	})
}
