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

function Card({
	children,
	style,
}: {
	children: React.ReactNode
	style?: React.CSSProperties
}) {
	return (
		<div
			style={{
				background: "var(--background)",
				border: "1px solid var(--grey-1, rgba(120,120,120,0.18))",
				borderRadius: 12,
				padding: "1rem 1.25rem",
				...style,
			}}>
			{children}
		</div>
	)
}

export default function PageSkeleton() {
	return (
		<>
			<style>{`:root{--skel-base:rgba(128,128,128,0.12);--skel-shine:rgba(255,255,255,0.20);}
      @media(prefers-color-scheme:dark){:root{--skel-base:rgba(255,255,255,0.07);--skel-shine:rgba(255,255,255,0.04);}}
      ${KEYFRAMES}`}</style>

			<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
				{/* top bar */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}>
					<Bar w={120} h={14} d={0} />
					<Circle size={32} d={0.05} />
				</div>

				{/* hero summary card */}
				<Card>
					<div
						style={{
							display: "flex",
							alignItems: "flex-start",
							justifyContent: "space-between",
							marginBottom: 12,
						}}>
						<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
							<Bar w={80} h={10} d={0.06} />
							<Bar w={150} h={18} d={0.1} />
						</div>
						<Bar w={64} h={28} d={0.08} pill />
					</div>
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
						{[0, 1].map((i) => (
							<div
								key={i}
								style={{ display: "flex", flexDirection: "column", gap: 5 }}>
								<Bar w="60%" h={9} d={0.12 + i * 0.02} />
								<Bar w="78%" h={13} d={0.15 + i * 0.02} />
							</div>
						))}
					</div>
				</Card>

				{/* stats block */}
				<Card>
					<Bar w={90} h={10} d={0.18} style={{ marginBottom: 12 }} />
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
						{[0, 1].map((i) => (
							<div
								key={i}
								style={{
									background: "var(--grey-4, rgba(120,120,120,0.07))",
									borderRadius: 8,
									padding: "10px 12px",
									display: "flex",
									flexDirection: "column",
									gap: 6,
								}}>
								<Bar w="50%" h={9} d={0.2 + i * 0.02} />
								<Bar w="68%" h={14} d={0.23 + i * 0.02} />
							</div>
						))}
					</div>
				</Card>

				{/* list section label */}
				<Bar w={100} h={10} d={0.28} />

				{/* list rows */}
				{[0, 1, 2].map((i) => (
					<Card
						key={i}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 12,
							padding: "0.85rem 1.25rem",
						}}>
						<Circle size={38} d={0.3 + i * 0.08} />
						<div
							style={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								gap: 6,
							}}>
							<Bar w="55%" h={11} d={0.32 + i * 0.08} />
							<Bar w="35%" h={9} d={0.36 + i * 0.08} />
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "flex-end",
								gap: 5,
							}}>
							<Bar w={58} h={11} d={0.34 + i * 0.08} />
							<Bar w={38} h={9} d={0.38 + i * 0.08} />
						</div>
					</Card>
				))}
			</div>
		</>
	)
}
