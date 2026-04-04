import { LineLoader } from "@/app/components/reusables/line_loader"

export default function Loading() {
	return (
		<div className="bg-background flex min-h-screen items-center justify-center">
			<LineLoader className="scale-125" />
		</div>
	)
}
