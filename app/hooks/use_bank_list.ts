import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export const useBanklists = () => {
	return useQuery({
		queryKey: ["bank_lists"],
		queryFn: async () => {
			const res = await fetch("/api/banks/lists")
			const data = await res.json()

			if (!res.ok) throw new Error(data.error)

			return data
		},
	})
}

export const useBankverify = (
	enabled: boolean,
	setEnabled: (val: boolean) => void,
	accountNumber: string,
	bankCode: string
) => {
	const query = useQuery({
		queryKey: ["bank-verify", accountNumber, bankCode],

		queryFn: async () => {
			const params = new URLSearchParams({
				accountNumber,
				bankCode,
			})

			const res = await fetch(`/api/banks/verify?${params.toString()}`)
			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error || "Verification failed")
			}

			return data
		},

		enabled: enabled && !!accountNumber && !!bankCode,
		staleTime: Infinity,
	})

	useEffect(() => {
		if (query.isSuccess) {
			setEnabled(false)
		}
	}, [query.isSuccess, setEnabled])

	return query
}
