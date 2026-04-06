import { getCreditHistory } from "@/app/server/credits"

export async function GET() {
	const res = await getCreditHistory()

	if (!res.success) {
		return Response.json({ error: res.error }, { status: 400 })
	}

	return Response.json(res.data)
}
