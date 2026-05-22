import { getBusinesses } from "@/app/server/business"

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)

	const query = searchParams.toString()
	const res = await getBusinesses(query)

	if (!res.success) {
		return Response.json({ error: res.error }, { status: 400 })
	}

	return Response.json(res.data)
}
