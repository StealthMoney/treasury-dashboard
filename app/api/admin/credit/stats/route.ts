import { getCreditHistoryAdminStats } from "@/app/server/credits"

export async function GET(req: Request) {
	const res = await getCreditHistoryAdminStats()

	if (!res.success) {
		return Response.json({ error: res.error }, { status: 400 })
	}

	return Response.json(res.data)
}
