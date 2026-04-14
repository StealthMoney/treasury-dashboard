import Image from "next/image"

export default function LeftPanel() {
	return (
		<div className="hidden w-1/2 flex-col bg-white md:flex">
			<div className="flex flex-1 items-center justify-center overflow-hidden bg-[#f5f5f3]">
				<div className="relative h-105 w-full md:h-130 lg:h-75">
					<Image
						src="/images/treasury.svg"
						alt="treasury dashboard"
						fill
						priority
						className="object-cover object-center"
					/>
				</div>
			</div>

			<div className="space-y-6 bg-[#FBFBFB] p-10">
				<div>
					<h3 className="text-foreground mb-1 text-[16px] font-medium">
						Modern Treasury Infrastructure
					</h3>
					<p className="text-[16px] leading-relaxed text-(--text-1)">
						Earn attractive returns while maintaining liquidity and control over your
						capital.
					</p>
				</div>
				<div>
					<h3 className="text-foreground mb-1 text-[16px] font-medium">
						Access to Affordable Credit
					</h3>
					<p className="text-[16px] leading-relaxed text-(--text-1)">
						Unlock flexible financing tied to your receivable. Convert your unpaid
						invoices into instant working capital.
					</p>
				</div>
				<div>
					<h3 className="text-foreground mb-1 text-[16px] font-medium">
						Seamless Dashboard Experience
					</h3>
					<p className="text-[16px] leading-relaxed text-(--text-1)">
						Monitor performance, and stay audit-ready with a transparent suite of
						treasury dashboards. Our easy to use and intuitive dashboards provide
						simple reports.
					</p>
				</div>
			</div>

			<div className="flex items-center gap-4 bg-[#FBFBFB] px-10 py-4 text-xs text-(--text-1)">
				<span>© Stealth Treasury</span>
				<span>·</span>
				<a href="#" className="transition-colors hover:cursor-pointer">
					Privacy & Terms
				</a>
				<span>·</span>
				<a href="#" className="transition-colors hover:cursor-pointer">
					Support
				</a>
			</div>
		</div>
	)
}
