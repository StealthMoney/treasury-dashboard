import { getAdminStats } from "@/app/server/admin_overview"

export async function GET(req: Request) {
	const res = await getAdminStats()
	if (!res.success) {
		return Response.json({ error: res.error }, { status: 400 })
	}

	return Response.json(res.data)
}
