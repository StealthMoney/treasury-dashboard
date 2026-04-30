import { RiErrorWarningLine } from "react-icons/ri"

interface OutstandingCreditsProps {
	total?: string
	principal?: string
	interest?: string
	dueDate?: string
	daysLeft?: string
}

export default function OutstandingCredits({
	total = "₦ 100,842,500.00",
	principal = "₦ 100,000,000.00",
	interest = "₦ 842,500.00",
	dueDate = "17 Jun 2026",
	daysLeft = "45 days left",
}: OutstandingCreditsProps) {
	return (
		<div className="space-y-2 rounded-2xl bg-(--grey-4) p-2 text-center">
			<div className="bg-background rounded-2xl py-8">
				<div className="flex items-center justify-center gap-2">
					<span className="inline-flex gap-x-2 text-[14px] text-(--text-1)">
						<RiErrorWarningLine color="#707070" size={18} /> Outstanding Credit
					</span>
				</div>

				<h2 className="text-foreground text-[32px] font-bold">{total}</h2>

				<div className="mx-auto my-1 mb-2 h-4 max-w-[90%] border-b-3 border-b-(--grey-4)"></div>

				<div className="mt-4 flex justify-center gap-6 pt-2 text-[12px]">
					<span className="text-(--text-1)">
						Principal:{" "}
						<span className="text-foreground font-semibold">{principal}</span>
					</span>

					<span className="text-(--text-1)">
						Interest:{" "}
						<span className="text-foreground font-semibold">{interest}</span>
					</span>
				</div>
			</div>

			<div className="flex justify-center gap-2 pt-2 text-[12px]">
				<span className="flex items-center gap-1 text-(--text-1)">
					<RiErrorWarningLine color="#F18B38" size={18} /> Due:{" "}
					<span className="text-foreground font-semibold">{dueDate}</span>
				</span>

				<span className="text-foreground flex items-center">
					(<span className="text-(--text-1)">{daysLeft}</span>)
				</span>
			</div>
		</div>
	)
}
