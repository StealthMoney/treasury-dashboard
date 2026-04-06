interface KYBStepWrapperProps {
	title: string | React.ReactNode
	children: React.ReactNode
	footer?: React.ReactNode
}

export function KYBStepWrapper({
	title,
	children,
	footer,
}: KYBStepWrapperProps) {
	return (
		<div className="space-y-6 rounded-lg border border-(--grey-1)">
			{/* Header */}
			<div className="rounded-tl-lg rounded-tr-lg bg-(--grey-4) px-4 py-4">
				<p className="text-foreground text-[14px] font-semibold">{title}</p>
			</div>

			{/* Body */}
			<div className="bg-background space-y-6 px-6 py-8">{children}</div>

			{/* Footer */}
			{footer && (
				<div className="flex justify-center gap-4 px-6 pt-6 pb-6">{footer}</div>
			)}
		</div>
	)
}
