"use client"
import { HiPlus } from "react-icons/hi"

// ---- API / endpoint shape ----
export interface StatValueRow {
	main: string | number
	suffix?: "USDC" | "USDT"
}

export interface StatData {
	label: string
	value?: string | number
	valueRow?: StatValueRow
	footer?: string
}

// ---- UI-only config ----
export interface StatUIConfig {
	index: number
	footerClass?: string
	showButton?: boolean
}

export interface StatsSectionProps {
	actionDisabled: boolean
	stats: StatData[]
	uiConfig?: StatUIConfig[]
	buttonLabel?: string
	onButtonClick?: () => void
	showPlus?: boolean
}

export const StatsSection = ({
	actionDisabled,
	stats,
	uiConfig = [],
	buttonLabel = "Fund Treasury",
	onButtonClick,
	showPlus,
}: StatsSectionProps) => {
	return (
		<div className="mb-8 grid grid-cols-1 gap-4 rounded-lg border border-(--grey-1) px-4 sm:grid-cols-2 lg:flex lg:flex-nowrap lg:gap-6 lg:overflow-x-auto">
			{stats.map((stat, index) => {
				const isLast = index === stats.length - 1
				const ui = uiConfig.find((c) => c.index === index)
				return (
					<div key={index} className="flex lg:flex-1 lg:items-center">
						{/* Card */}
						<div
							className={`flex-1 ${ui?.showButton ? "lg:flex lg:items-center" : ""}`}>
							<div className="bg-background rounded-lg p-4 sm:p-6">
								<p className="mb-2 text-[16px] text-(--text-1)">{stat.label}</p>
								{stat.valueRow ? (
									<div className="mb-2 flex items-baseline gap-2">
										<h2 className="text-foreground text-[24px] font-bold">
											{stat.valueRow.main}
										</h2>
										{stat.valueRow.suffix && (
											<span className="text-[24px] font-medium text-(--text-1)">
												{stat.valueRow.suffix}
											</span>
										)}
									</div>
								) : (
									<h2 className="text-foreground mb-2 text-[24px] font-bold text-nowrap">
										{stat.value}
									</h2>
								)}
								{stat.footer && (
									<p
										className={`text-[16px] text-nowrap ${ui?.footerClass ?? "text-(--grey-3)"}`}>
										{index === 0 && "Start Date:"} {stat.footer}
									</p>
								)}
							</div>
							{/* Optional Button — UI-only */}
							{ui?.showButton && (
								<div className="mt-4">
									<button
										disabled={actionDisabled}
										onClick={onButtonClick}
										className="bg-foreground text-background flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-[16px] whitespace-nowrap transition hover:bg-gray-800 sm:px-8 sm:py-3">
										{showPlus && <HiPlus className="h-4 w-4 sm:h-5 sm:w-5" />}
										<span>{buttonLabel}</span>
									</button>
								</div>
							)}
						</div>
						{/* Divider — laptop and up */}
						{!isLast && (
							<div className="ml-6 hidden h-[80%] w-2 border-r border-r-(--grey-1) lg:flex"></div>
						)}
					</div>
				)
			})}
		</div>
	)
}
