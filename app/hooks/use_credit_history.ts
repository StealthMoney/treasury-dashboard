import { useQuery } from "@tanstack/react-query"

export const useCreditHistory = () => {
	return useQuery({
		queryKey: ["credit-history"],
		queryFn: async () => {
			const res = await fetch("/api/credit")
			const data = await res.json()

			if (!res.ok) throw new Error(data.error)

			console.log(data, "new")

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
