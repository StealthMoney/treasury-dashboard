"use client"

import { useState } from "react"
import { HiDownload } from "react-icons/hi"
import { StatsSection } from "../components/reusables/stats_section"
import { Table, TableColumn } from "../components/reusables/table"
import { StepModal } from "../components/reusables/modal"
import { baseInput, baseSelect } from "../components/reusables/classes"

interface ReportData {
	id: string
	reportType: string
	date: string
	time: string
	format: string
}

interface CreditStats {
	label: string
	value?: string | number
	valueRow?: {
		main: string | number
		suffix?: "USDC" | "USDT"
	}
	footer?: string
}

export default function ReportOverviewPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [currentStep, setCurrentStep] = useState(0)
	const [isSuccess, setIsSuccess] = useState(false)
	const [loading, setLoading] = useState(false)

	// Form state
	const [formData, setFormData] = useState({
		reportType: "Credit Report",
		fromDate: "",
		toDate: "",
		financialYear: "",
		format: "",
	})

	// Stats Section Data
	const creditStatsData: CreditStats[] = [
		{
			label: "Total Credit Used",
			value: "₦100,000,000",
		},
		{
			label: "Outstanding Balance",
			value: "₦100,842,500",
		},
		{
			label: "Total Repaid",
			value: "₦25,000,000",
		},
		{
			label: "Active Loans",
			value: "001",
		},
	]

	// Table Data
	const reportTableData: ReportData[] = [
		{
			id: "1",
			reportType: "Credit Report",
			date: "30-03-2026",
			time: "14:09 PM",
			format: "PDF",
		},
		{
			id: "2",
			reportType: "Credit Report",
			date: "30-03-2026",
			time: "14:09 PM",
			format: "PDF",
		},
		{
			id: "3",
			reportType: "Credit Report",
			date: "30-03-2026",
			time: "14:09 PM",
			format: "CSV",
		},
		{
			id: "4",
			reportType: "Credit Report",
			date: "30-03-2026",
			time: "14:09 PM",
			format: "PDF",
		},
		{
			id: "5",
			reportType: "Credit Report",
			date: "30-03-2026",
			time: "14:09 PM",
			format: "PDF",
		},
		{
			id: "6",
			reportType: "Credit Report",
			date: "30-03-2026",
			time: "14:09 PM",
			format: "CSV",
		},
	]

	// Table Columns
	const reportColumns: TableColumn<ReportData>[] = [
		{
			header: "Report Type",
			accessor: "reportType",
		},
		{
			header: "Date",
			accessor: "date",
		},
		{
			header: "Time",
			accessor: "time",
		},
		{
			header: "Format",
			accessor: "format",
		},
		{
			header: "Action",
			accessor: (row) => (
				<button
					title="download"
					className="text-foreground transition hover:opacity-80">
					<HiDownload size={20} />
				</button>
			),
		},
	]

	// Modal Handlers
	const handleGenerateReport = () => {
		setIsModalOpen(true)
		setCurrentStep(0)
		setIsSuccess(false)
	}

	const handleNextStep = () => {
		if (currentStep < 0) {
			setCurrentStep(currentStep + 1)
		} else {
			// Last step, submit
			handleSubmit()
		}
	}

	const handlePreviousStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1)
		}
	}

	const handleSubmit = async () => {
		setLoading(true)
		// Simulate API call
		setTimeout(() => {
			setLoading(false)
			setIsSuccess(true)
		}, 1500)
	}

	const handleModalClose = () => {
		setIsModalOpen(false)
		setIsSuccess(false)
		setCurrentStep(0)
	}

	// Modal Steps
	const reportSteps = [
		{
			title: "Report Details",
			description: "Fill in your report preferences",
			content: (
				<div className="space-y-5">
					{/* Report Type */}
					<div>
						<label hidden aria-label="report type"></label>
						<select
							title="select report type"
							value={formData.reportType}
							onChange={(e) =>
								setFormData({ ...formData, reportType: e.target.value })
							}
							className={baseSelect}>
							<option value="">Report Type</option>
							<option>Credit Report</option>
						</select>
					</div>

					{/* Date Range */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label hidden aria-label="date from"></label>
							<input
								placeholder="From"
								type="date"
								value={formData.fromDate}
								onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
								className={baseInput}
							/>
						</div>
						<div>
							<label hidden aria-label="date to"></label>
							<input
								placeholder="To"
								type="date"
								value={formData.toDate}
								onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
								className={baseInput}
							/>
						</div>
					</div>

					{/* Financial Year */}
					<div>
						<label hidden aria-label="financial year">
							Financial Year
						</label>
						<select
							title="select year"
							value={formData.financialYear}
							onChange={(e) =>
								setFormData({ ...formData, financialYear: e.target.value })
							}
							className={baseSelect}>
							<option value="">Financial Year</option>
							<option>2024</option>
							<option>2025</option>
							<option>2026</option>
						</select>
					</div>

					{/* Format */}
					<div>
						<label hidden aria-label="format"></label>
						<select
							title="select format"
							value={formData.format}
							onChange={(e) => setFormData({ ...formData, format: e.target.value })}
							className={baseSelect}>
							<option value="">Format</option>
							<option>PDF</option>
							<option>CSV</option>
							<option>Excel</option>
						</select>
					</div>
				</div>
			),
		},
	]

	return (
		<div className="bg-background min-h-screen w-full px-6">
			<div className="w-full overflow-x-auto md:max-w-[80%]">
				<div className="mx-auto px-4 py-8 sm:px-6 lg:px-6">
					<div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
						<div>
							<h1 className="text-foreground text-2xl font-bold sm:text-3xl">
								Report Overview
							</h1>
							<p className="mt-1 text-sm text-(--text-1)">
								You can generate a report of your previous credit transactions
							</p>
						</div>
						{!true && (
							<button
								onClick={handleGenerateReport}
								className="bg-foreground cursor-pointer rounded-full px-6 py-2.5 font-semibold whitespace-nowrap text-white transition hover:opacity-90">
								Generate Report
							</button>
						)}
					</div>

					{/* Stats Section */}
					{!true && (
						<StatsSection
							actionDisabled={false}
							stats={creditStatsData}
							uiConfig={[]}
							buttonLabel="Repay Credit"
							onButtonClick={() => {}}
						/>
					)}

					{/* Table Section */}
					<Table
						data={[]}
						columns={reportColumns}
						kybStatus={null}
						tableButtonClick={() => {}}
					/>
				</div>

				{/* Generate Report Modal */}
				<StepModal
					isOpen={isModalOpen}
					onClose={handleModalClose}
					title="Generate report"
					subtitle=""
					steps={reportSteps}
					currentStep={currentStep}
					onNextStep={handleNextStep}
					onPreviousStep={() => {}}
					onSubmit={handleSubmit}
					isSuccess={isSuccess}
					loading={loading}
					imagePath="/images/success.svg"
					successTitle="Report Generated Successfully"
					successMessage="Your report has been generated and is ready for download."
					successButtonLabel="Go to Report"
				/>
			</div>
		</div>
	)
}
