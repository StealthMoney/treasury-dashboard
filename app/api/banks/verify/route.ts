import { Verifybankdetails } from "@/app/server/bank_lists"

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)

	const accountNumber = searchParams.get("accountNumber")
	const bankCode = searchParams.get("bankCode")

	if (!accountNumber || !bankCode) {
		return Response.json({
			status: 400,
			error: "account number and associated code required",
		})
	}
	const res = await Verifybankdetails(accountNumber, bankCode)

	if (!res.success) {
		return Response.json({ error: res.error }, { status: 400 })
	}

	return Response.json(res.data)
}
