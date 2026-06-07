import { getCreditHistoryAdmin } from "@/app/server/credits"

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)

	const query = searchParams.toString()
	const res = await getCreditHistoryAdmin(query)

	if (!res.success) {
		return Response.json({ error: res.error }, { status: 400 })
	}

	return Response.json(res.data)
}
