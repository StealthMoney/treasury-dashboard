"use client"

type Stable = "USDC" | "USDT"

export default function StableSwitch({
	value,
	onChange,
}: {
	value: Stable
	onChange: (v: Stable) => void
}) {
	const isUSDC = value === "USDC"

	return (
		<div className="relative flex w-fit rounded-xl bg-(--grey-1) px-1 py-2">
			{/* Sliding pill */}
			<div
				className={`bg-background absolute top-1 left-1 h-[calc(100%-8px)] w-1/2 rounded-lg transition-transform duration-300 ease-out ${isUSDC ? "translate-x-0" : "translate-x-full"} `}
			/>

			{/* USDC */}
			<button
				onClick={() => onChange("USDC")}
				className={`relative z-10 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:px-6 ${isUSDC ? "text-foreground" : "text-(--text-1)"} `}>
				Buy USDC
			</button>

			{/* USDT */}
			<button
				onClick={() => onChange("USDT")}
				className={`relative z-10 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:px-6 ${!isUSDC ? "text-foreground" : "text-(--text-1)"} `}>
				Buy USDT
			</button>
		</div>
	)
}
