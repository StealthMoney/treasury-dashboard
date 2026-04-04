"use client"

export const LineLoader = ({ className = "" }: { className?: string }) => {
	return (
		<div className={`flex w-full justify-center ${className}`}>
			<div className="relative h-1 w-40 overflow-hidden rounded-full bg-(--grey-1)">
				<div className="bg-foreground animate-line-slide absolute inset-y-0 w-1/2" />
			</div>
		</div>
	)
}
