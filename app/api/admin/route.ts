import { getAdminStats } from "@/app/server/admin_overview"

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)

	const query = searchParams.toString()
	const res = await getAdminStats(query)
	if (!res.success) {
		return Response.json({ error: res.error }, { status: 400 })
	}

	return Response.json(res.data)
}
