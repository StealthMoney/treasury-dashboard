import { getBusinessStats } from "@/app/server/business"

export async function GET(req: Request) {
	const res = await getBusinessStats()
	if (!res.success) {
		return Response.json({ error: res.error }, { status: 400 })
	}

	return Response.json(res.data)
}
