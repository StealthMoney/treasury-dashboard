"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import * as pdfjsLib from "pdfjs-dist"

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

export default function PdfPreview({ fileUrl }: { fileUrl: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [pageNum, setPageNum] = useState(1)
	const [totalPages, setTotalPages] = useState(0)

	const pdfRef = useRef<any>(null)
	const renderTaskRef = useRef<any>(null) // ← Added for cancellation

	const renderPage = useCallback(async (pdf: any, num: number) => {
		const canvas = canvasRef.current
		if (!canvas) return

		// Cancel previous render if still running
		if (renderTaskRef.current) {
			renderTaskRef.current.cancel()
			renderTaskRef.current = null
		}

		try {
			const page = await pdf.getPage(num)
			const viewport = page.getViewport({ scale: 1.5 })

			canvas.height = viewport.height
			canvas.width = viewport.width

			const context = canvas.getContext("2d")
			if (!context) return

			const renderTask = page.render({
				canvasContext: context,
				viewport,
			})

			renderTaskRef.current = renderTask

			await renderTask.promise
			renderTaskRef.current = null
		} catch (err: any) {
			// Ignore cancellation errors
			if (err.name === "RenderingCancelledException") {
				console.log("Render cancelled")
				return
			}
			console.error("Render error:", err)
		}
	}, [])

	const loadPdf = useCallback(async () => {
		try {
			setLoading(true)
			setError(false)
			setPageNum(1)

			const pdf = await pdfjsLib.getDocument(fileUrl).promise
			pdfRef.current = pdf
			setTotalPages(pdf.numPages)

			await renderPage(pdf, 1)
		} catch (err: any) {
			console.error("PDF Load Error:", err)
			setError(true)
		} finally {
			setLoading(false)
		}
	}, [fileUrl, renderPage])

	const changePage = useCallback(
		async (newPage: number) => {
			if (!pdfRef.current) return
			if (newPage < 1 || newPage > totalPages) return

			setPageNum(newPage)
			await renderPage(pdfRef.current, newPage)
		},
		[pdfRef, totalPages, renderPage]
	)

	useEffect(() => {
		loadPdf()

		// Cleanup on unmount
		return () => {
			if (renderTaskRef.current) {
				renderTaskRef.current.cancel()
			}
		}
	}, [loadPdf])

	if (error) {
		return (
			<div className="px-6 text-center">
				<p className="text-sm text-(--text-1)">Preview not available</p>
			</div>
		)
	}

	return (
		<div className="flex w-full flex-col items-center gap-3">
			{loading && <p className="text-sm text-(--text-1)">Loading preview...</p>}

			<canvas ref={canvasRef} className="max-w-full rounded shadow-sm" />

			{totalPages > 1 && (
				<div className="flex items-center gap-3 text-sm text-(--text-1)">
					<button
						disabled={pageNum <= 1}
						onClick={() => changePage(pageNum - 1)}
						className="hover:text-foreground cursor-pointer disabled:opacity-40">
						← Prev
					</button>
					<span>
						{pageNum} / {totalPages}
					</span>
					<button
						disabled={pageNum >= totalPages}
						onClick={() => changePage(pageNum + 1)}
						className="hover:text-foreground cursor-pointer disabled:opacity-40">
						Next →
					</button>
				</div>
			)}
		</div>
	)
}
