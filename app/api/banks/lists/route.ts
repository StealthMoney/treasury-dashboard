import { getBankLists } from "@/app/server/bank_lists"
export async function GET() {
	const res = await getBankLists()

	if (!res.success) {
		return Response.json({ error: res.error }, { status: 400 })
	}

	return Response.json(res.data)
}
