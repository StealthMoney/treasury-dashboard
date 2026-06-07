const KEYFRAMES = `
  @keyframes skel-sweep {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
`

const shimmer: React.CSSProperties = {
	background: `linear-gradient(
    100deg,
    var(--skel-base) 0%,
    var(--skel-base) 35%,
    var(--skel-shine) 50%,
    var(--skel-base) 65%,
    var(--skel-base) 100%
  )`,
	backgroundSize: "300% 100%",
	animationName: "skel-sweep",
	animationDuration: "2s",
	animationTimingFunction: "ease",
	animationIterationCount: "infinite",
	flexShrink: 0,
}

function Bar({
	w = "100%",
	h,
	d = 0,
	pill = false,
	style,
}: {
	w?: string | number
	h: number
	d?: number
	pill?: boolean
	style?: React.CSSProperties
}) {
	return (
		<div
			style={{
				...shimmer,
				width: w,
				height: h,
				borderRadius: pill ? 999 : 6,
				animationDelay: `${d}s`,
				...style,
			}}
		/>
	)
}

function Circle({ size, d = 0 }: { size: number; d?: number }) {
	return (
		<div
			style={{
				...shimmer,
				width: size,
				height: size,
				borderRadius: "50%",
				animationDelay: `${d}s`,
			}}
		/>
	)
}

export default function SectionSkeleton({ rows = 2 }: { rows?: number }) {
	return (
		<>
			<style>{`:root{--skel-base:rgba(128,128,128,0.12);--skel-shine:rgba(255,255,255,0.20);}
      @media(prefers-color-scheme:dark){:root{--skel-base:rgba(255,255,255,0.07);--skel-shine:rgba(255,255,255,0.04);}}
      ${KEYFRAMES}`}</style>

			<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
				{/* section label */}
				<Bar w={100} h={9} d={0} style={{ marginBottom: 4 }} />

				{/* rows */}
				{Array.from({ length: rows }).map((_, i) => (
					<div
						key={i}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							padding: "10px 12px",
							background: "var(--background)",
							border: "1px solid var(--grey-1, rgba(120,120,120,0.18))",
							borderRadius: 10,
						}}>
						<Circle size={30} d={0.05 + i * 0.06} />
						<div
							style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
							<Bar w="50%" h={10} d={0.08 + i * 0.06} />
							<Bar w="32%" h={8} d={0.11 + i * 0.06} />
						</div>
						<Bar w={48} h={10} d={0.1 + i * 0.06} pill />
					</div>
				))}
			</div>
		</>
	)
}
