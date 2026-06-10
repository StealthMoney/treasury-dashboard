"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { StatsSection } from "../reusables/stats_section"
import { KYBStepWrapper } from "../reusables/kybstepwraper"
import { Table, TableColumn } from "@/app/components/reusables/table"
import DocumentReviewModal from "@/app/components/reusables/modals/review_modal"
import DocumentHistoryModal from "@/app/components/reusables/modals/history_modal"
import ApprovalModal from "@/app/components/reusables/modals/approval_modal"
import RejectionModal from "@/app/components/reusables/modals/rejection_modal"
import DirectorDetailModal from "@/app/components/reusables/modals/director_modal"
import { getFileBgClass, getFileIconFromName } from "../reusables/file_icons"
import {
	BusinessDocument,
	BusinessDirector,
	ActivityLog,
	Transaction,
} from "@/app/types/general"
import {
	useBusinessesDetails,
	useBusinessesDirectors,
	useBusinessesDocuments,
	useBusinessesStats,
} from "@/app/hooks/use_businesses"
import PageSkeleton from "../reusables/page_skeleton"
import SectionSkeleton from "../reusables/sectionSkeleton"
import {
	updateBusinessDirectors,
	updateBusinessDocuments,
} from "@/app/server/business"
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"
import { ActivityIcon } from "../reusables/activity_icon"
import { FilterDropdown } from "../reusables/filterdropdown"
import { FaRegClock } from "react-icons/fa6"
import { resolveActivityIconType } from "@/app/functions/helpers/activity_icon_resolver"
import { AiOutlineDeliveredProcedure } from "react-icons/ai"

export default function BusinessDetailPage({ id }: { id: string }) {
	const [loading, setLoading] = useState<boolean>(false)
	const [approvalMessage, setApprovalMessage] = useState<{
		type: "success" | "failed"
		title: string
		message: string
	} | null>(null)

	const [transactionFilter, setTransactionFilter] = useState("all")
	const [activityFilter, setActivityFilter] = useState("all")
	const [activityPage, setActivityPage] = useState(1)
	const itemsPerPage = 10

	const [transactionPage, setTransactionPage] = useState(1)

	const tabs = [
		{ id: "overview", label: "Overview" },
		{ id: "documents", label: "Documents" },
		{ id: "directors", label: "Directors" },
		{ id: "activities", label: "Activities" },
		{ id: "transactions", label: "Transactions" },
	]

	const { data: business, isLoading } = useBusinessesDetails(id)
	const { data: businessStatsData, isLoading: businessStatsLoading } =
		useBusinessesStats(id)

	const activities = businessStatsData?.recentActivities

	const transactions = businessStatsData?.transactions

	const businessFinancialStats = businessStatsData?.stats
		? [
				{
					label: "Annual Revenue",
					valueRow: {
						main: businessStatsData.stats.annualRevenue,
						suffix: "₦",
					},
				},
				{
					label: "Active Loans",
					valueRow: {
						main: businessStatsData.stats.activeLoan,
						suffix: "",
					},
				},
				{
					label: "Cash Flow",
					valueRow: {
						main: businessStatsData.stats.cashFlow,
						suffix: "₦",
					},
				},
				{
					label: "Existing Liabilities",
					valueRow: {
						main: businessStatsData.stats.existingLiabilities,
						suffix: "₦",
					},
				},
			]
		: []

	const {
		data: directors,
		isLoading: directorsLoading,
		refetch: refetchDirectors,
	} = useBusinessesDirectors(id)

	const {
		data: documents,
		isLoading: documentLoading,
		refetch: refetchDocuments,
	} = useBusinessesDocuments({ "ownerId.equals": id }, !!id)

	const [activeTab, setActiveTab] = useState("overview")

	const actionFilterOptions = [
		{
			label: activeTab === "activities" ? "All Activities" : "All Transactions",
			value: "all",
		},
		{ label: "Most Recent", value: "recent" },
		{ label: "Oldest", value: "oldest" },
	]

	// Document modal state
	const [reviewModalOpen, setReviewModalOpen] = useState(false)
	const [historyModalOpen, setHistoryModalOpen] = useState(false)
	const [selectedDocument, setSelectedDocument] =
		useState<BusinessDocument | null>(null)

	// Director modal state
	const [directorModalOpen, setDirectorModalOpen] = useState(false)
	const [selectedDirector, setSelectedDirector] =
		useState<BusinessDirector | null>(null)

	// Shared approval / rejection modal state
	const [approvalModalOpen, setApprovalModalOpen] = useState(false)
	const [rejectionSubject, setRejectionSubject] = useState<
		"document" | "director"
	>("document")

	function toAbsoluteUrl(url: string): string {
		if (!url) return url
		if (url.startsWith("http://") || url.startsWith("https://")) return url
		return `https://${url}`
	}

	const handleReviewDocument = (doc: BusinessDocument) => {
		setSelectedDocument(doc)
		setReviewModalOpen(true)
	}

	const handleViewHistory = (doc: BusinessDocument) => {
		setSelectedDocument(doc)
		setHistoryModalOpen(true)
	}

	const handleApproveDocument = async () => {
		if (!id || !selectedDocument) return

		const payload = {
			status: "VERIFIED",
		}
		setLoading(true)
		try {
			const req = await updateBusinessDocuments(
				JSON.stringify(payload),
				String(selectedDocument.publicId)
			)

			if (req.success) {
				setSelectedDocument((prev) =>
					prev ? { ...prev, status: "VERIFIED" } : prev
				)
				setApprovalMessage({
					type: "success",
					title: "Document Approved Successfully!",
					message:
						"Your request to approve this document has been successfully processed!",
				})
			} else {
				setApprovalMessage({
					type: "failed",
					title: "Failed To Approve Document",
					message: req.error,
				})
			}
		} catch (err) {
			console.error(err)
			setApprovalMessage({
				type: "failed",
				title: "Failed To Approve Document",
				message: err instanceof Error ? err.message : "An unknown error occurred",
			})
		} finally {
			setLoading(false)
			setReviewModalOpen(false)
			setApprovalModalOpen(true)
			await refetchDocuments()
		}
	}

	const handleViewDirector = (director: BusinessDirector) => {
		setSelectedDirector(director)
		setDirectorModalOpen(true)
	}

	// const handleApproveDirector = () => {
	// 	setDirectorModalOpen(false)
	// 	setApprovalModalOpen(true)
	// }

	const handleApproveDirector = async () => {
		if (!id || !selectedDirector) return

		const payload = {
			status: "VERIFIED",
		}
		setLoading(true)
		try {
			const req = await updateBusinessDirectors(
				JSON.stringify(payload),
				id,
				String(selectedDirector.id)
			)

			if (req.success) {
				setSelectedDirector((prev) =>
					prev ? { ...prev, status: "VERIFIED" } : prev
				)
				setApprovalMessage({
					type: "success",
					title: "Director Approved Successfully!",
					message:
						"Your request to approve this business director has been successfully processed!",
				})
			} else {
				setApprovalMessage({
					type: "failed",
					title: "Failed To Approve Director",
					message: req.error,
				})
			}
		} catch (err) {
			console.error(err)
			setApprovalMessage({
				type: "failed",
				title: "Failed To Approve Director",
				message: err instanceof Error ? err.message : "An unknown error occurred",
			})
		} finally {
			setLoading(false)
			setDirectorModalOpen(false)
			setApprovalModalOpen(true)
			await refetchDirectors()
		}
	}

	const handleRejectDirector = () => {
		setDirectorModalOpen(true)
		setRejectionSubject("director")
	}

	const handleRejectionConfirm = async (reason: string) => {
		if (rejectionSubject === "director") {
			if (!id || !selectedDirector) return

			setLoading(true)
			try {
				const req = await updateBusinessDirectors(
					JSON.stringify({ status: "REJECTED", rejectionReason: reason }),
					id,
					String(selectedDirector.id)
				)

				if (req.success) {
					setDirectorModalOpen(false)
					setSelectedDirector((prev) =>
						prev ? { ...prev, status: "REJECTED", rejectionReason: reason } : prev
					)
					setApprovalMessage({
						type: "success",
						title: "Director Rejected",
						message: "The director's status has been updated to rejected.",
					})
				} else {
					setDirectorModalOpen(false)
					setApprovalMessage({
						type: "failed",
						title: "Failed to reject director",
						message: req.error,
					})
				}
			} catch (err) {
				setDirectorModalOpen(false)
				setApprovalMessage({
					type: "failed",
					title: "Failed to reject director",
					message: err instanceof Error ? err.message : "An unknown error occurred",
				})
			} finally {
				setLoading(false)
				if (rejectionSubject === "director") {
					setDirectorModalOpen(false)
					await refetchDirectors()
				} else {
					setReviewModalOpen(false)
					await refetchDocuments()
				}
				setApprovalModalOpen(true)
			}
		} else if (rejectionSubject === "document") {
			if (!id || !setSelectedDocument) return

			setLoading(true)
			try {
				const req = await updateBusinessDocuments(
					JSON.stringify({ status: "REJECTED", rejectionReason: reason }),
					String(selectedDocument?.publicId)
				)

				if (req.success) {
					setReviewModalOpen(false)
					setSelectedDocument((prev) =>
						prev ? { ...prev, status: "REJECTED", rejectionReason: reason } : prev
					)
					setApprovalMessage({
						type: "success",
						title: "Document Rejected",
						message: "The document status has been updated to rejected.",
					})
				} else {
					setReviewModalOpen(false)
					setApprovalMessage({
						type: "failed",
						title: "Failed to reject document",
						message: req.error,
					})
				}
			} catch (err) {
				setReviewModalOpen(false)
				setApprovalMessage({
					type: "failed",
					title: "Failed to reject document",
					message: err instanceof Error ? err.message : "An unknown error occurred",
				})
			} finally {
				setLoading(false)
				setApprovalModalOpen(true)
				await refetchDocuments()
			}
		}
	}

	const processedActivities = useMemo(() => {
		const data = activities ? [...activities] : []

		switch (activityFilter) {
			case "recent":
				return data.sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
				)

			case "oldest":
				return data.sort(
					(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
				)

			case "all":
			default:
				return data
		}
	}, [activities, activityFilter])

	const processedTransactions = useMemo(() => {
		const data = transactions ? [...transactions] : []

		switch (transactionFilter) {
			case "recent":
				return data.sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
				)

			case "oldest":
				return data.sort(
					(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
				)

			case "all":
			default:
				return data
		}
	}, [transactions, transactionFilter])

	const resetPage = () => {
		setActivityPage(1)
	}

	const resetTransactionPage = () => {
		setTransactionPage(1)
	}

	useEffect(() => {
		resetTransactionPage()
	}, [transactionFilter])

	useEffect(() => {
		resetPage()
	}, [activityFilter])

	// frontend pagination for activities
	const paginatedActivities = useMemo(() => {
		const start = (activityPage - 1) * itemsPerPage
		const end = start + itemsPerPage

		return processedActivities.slice(start, end)
	}, [processedActivities, activityPage])

	const totalActivityItems = processedActivities.length

	// frontend pagination for transactions
	const paginatedTransactions = useMemo(() => {
		const start = (transactionPage - 1) * itemsPerPage
		const end = start + itemsPerPage

		return processedTransactions.slice(start, end)
	}, [processedTransactions, transactionPage])

	const totalTransactionItems = processedTransactions.length

	// ── Document columns ───────────────────────────────────────────────────────
	const documentColumns: TableColumn<BusinessDocument>[] = [
		{
			header: "Documents",
			accessor: (row) => (
				<div className="flex items-center gap-3">
					<span
						className={`shrink-0 rounded-lg px-2 py-2 ${getFileBgClass(row.fileName)}`}>
						{getFileIconFromName(row.fileName, true)}
					</span>
					<div className="flex flex-col">
						<p className="text-foreground max-w-50 truncate text-[14px] font-semibold">
							{row.fileName}
						</p>
						<p className="text-xs tracking-wide text-(--text-1) uppercase">
							{row.documentType.replace(/_/g, " ")}
						</p>
					</div>
				</div>
			),
		},
		{
			header: "Date",
			accessor: (row) => (
				<div>
					<p className="text-foreground">
						{new Date(row.uploadedAt).toLocaleDateString("en-GB").replace(/\//g, "-")}
					</p>
					<p className="text-xs text-(--text-1)">
						{new Date(row.uploadedAt).toLocaleTimeString("en-GB", {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				</div>
			),
		},
		{
			header: "Status",
			accessor: (row) => (
				<div
					className={`inline-flex items-center gap-2 rounded-full bg-(--grey-1) px-3 py-1.5 text-xs font-medium text-(--text-1)`}>
					{row.status === "VERIFIED" ? (
						<IoMdCheckmarkCircle size={16} className="text-(--green-1)" />
					) : row.status === "REJECTED" ? (
						<IoMdCloseCircle size={16} className="text-(--red-1)" />
					) : (
						<FaRegClock size={14} className="text-orange-500" />
					)}

					{row.status === "VERIFIED"
						? "Approved"
						: row.status === "REJECTED"
							? "Rejected"
							: "Pending Review"}
				</div>
			),
		},
		{
			header: "Action",
			accessor: (row) => (
				<div className="flex items-center gap-4">
					<button
						onClick={() => handleReviewDocument(row)}
						className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-(--grey-1) px-2 py-2 text-sm text-[16px] font-medium text-(--text-1) transition">
						<svg
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Review
					</button>
					<button
						onClick={() => handleViewHistory(row)}
						className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-(--grey-1) px-2 py-2 text-sm text-[16px] font-medium text-(--text-1) transition">
						<svg
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
							/>
						</svg>
						History
					</button>
				</div>
			),
		},
	]

	// ── Director columns ───────────────────────────────────────────────────────
	const directorColumns: TableColumn<BusinessDirector>[] = [
		{
			header: "Director",
			accessor: (row) => (
				<div className="flex flex-col">
					<p className="text-foreground font-semibold">
						{row.firstName} {row.lastName}
					</p>
					<p className="text-xs tracking-wide text-(--text-1) uppercase">
						{row.role.replace(/_/g, " ")}
					</p>
				</div>
			),
		},
		{
			header: "Ownership",
			accessor: (row) => (
				<p className="text-foreground font-medium">{row.ownershipPercentage}%</p>
			),
		},
		{
			header: "PEP",
			accessor: (row) =>
				row.isPep ? (
					<div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
						<svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
						Yes
					</div>
				) : (
					<span className="text-xs text-(--text-1)">No</span>
				),
		},
		{
			header: "Status",
			accessor: (row) => (
				<div
					className={`inline-flex items-center gap-2 rounded-full bg-(--grey-1) px-3 py-1.5 text-xs font-medium text-(--text-1)`}>
					{row.status === "VERIFIED" ? (
						<IoMdCheckmarkCircle size={16} className="text-(--green-1)" />
					) : row.status === "REJECTED" ? (
						<IoMdCloseCircle size={16} className="text-(--red-1)" />
					) : (
						<FaRegClock size={14} className="text-orange-500" />
					)}

					{row.status === "VERIFIED"
						? "Approved"
						: row.status === "REJECTED"
							? "Rejected"
							: "Pending"}
				</div>
			),
		},
		{
			header: "Action",
			accessor: (row) => (
				<button
					onClick={() => handleViewDirector(row)}
					className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-(--green-1) transition hover:underline">
					<svg
						className="h-4 w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						/>
					</svg>
					View
				</button>
			),
		},
	]

	const activityColumns: TableColumn<ActivityLog>[] = [
		{
			header: "Activity:",
			accessor: (row) => (
				<div className="flex items-center gap-3">
					<ActivityIcon type={resolveActivityIconType(row.title)} />
					<div className="flex flex-col">
						<p className="text-foreground text-[14px] font-semibold">{row.title}</p>
						<p className="max-w-90 truncate text-xs text-(--text-1)">
							{row.description}
						</p>
					</div>
				</div>
			),
		},
		{
			header: "Action By:",
			accessor: (row) => (
				<div className="flex flex-col">
					<p className="text-foreground text-[14px]">
						By: <span className="font-semibold">{row.performedBy}</span>
					</p>
					<p className="text-xs text-(--text-1)">{row.email}</p>
				</div>
			),
		},
		{
			header: "Date:",
			accessor: (row) => (
				<div className="flex flex-col">
					<p className="text-foreground min-w-20 text-[14px] font-medium">
						{new Date(row.date).toLocaleDateString("en-GB").replace(/\//g, "-")}
					</p>
					<p className="text-xs text-(--text-1)">
						{new Date(row.date).toLocaleTimeString("en-GB", {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				</div>
			),
		},
	]

	function formatNaira(value: number): string {
		return "₦" + value.toLocaleString("en-NG", { minimumFractionDigits: 2 })
	}

	const transactionColumns: TableColumn<Transaction>[] = [
		{
			header: "Date",
			accessor: (row) => (
				<div className="flex flex-col">
					<p className="text-foreground text-[14px] font-medium">
						{new Date(row.date).toLocaleDateString("en-GB").replace(/\//g, "-")}
					</p>
					<p className="text-xs text-(--text-1)">
						{new Date(row.date).toLocaleTimeString("en-GB", {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				</div>
			),
		},
		{
			header: "Amount",
			accessor: (row) => (
				<div className="flex flex-col">
					<p className="text-foreground text-[14px] font-semibold">
						{formatNaira(row.amount)}
					</p>
				</div>
			),
		},
		{
			header: "Transaction Type",
			accessor: (row) => (
				<div className="flex flex-col">
					<p className="text-foreground text-[14px] font-semibold">
						{row.transactionType?.split("_")?.join(" ")}
					</p>
				</div>
			),
		},
		{
			header: "Status",
			accessor: (row) => (
				<div className="inline-flex items-center gap-2 rounded-full bg-(--grey-1) px-3 py-1.5 text-xs font-medium text-(--text-1)">
					{row.status === "APPROVED" || row.status === "REPAID" ? (
						<IoMdCheckmarkCircle size={16} className="text-(--green-1)" />
					) : row.status === "REJECTED" ? (
						<IoMdCloseCircle size={16} className="text-(--red-1)" />
					) : row.status === "REVIEW" ? (
						<FaRegClock size={14} className="text-orange-500" />
					) : row.status === "DISBURSED" ? (
						<AiOutlineDeliveredProcedure size={14} className="text-blue-700" />
					) : (
						<span className="h-2 w-2 rounded-full bg-orange-500" />
					)}

					{row.status === "APPROVED"
						? "Approved"
						: row.status === "REJECTED"
							? "Rejected"
							: row.status === "DISBURSED"
								? "Disbursed"
								: row.status === "REPAID"
									? "Repaid"
									: "Review"}
				</div>
			),
		},
	]

	return (
		<div className="bg-background min-h-screen w-full px-6">
			<div className="w-full overflow-x-auto md:max-w-[80%]">
				<div className="mx-auto px-4 py-8 sm:px-6 lg:px-6">
					{/* Back */}
					<Link
						href="/admin/manage-business"
						className="hover:text-foreground mb-8 inline-flex items-center gap-2 font-medium text-(--text-1) transition">
						<svg
							className="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Go Back to Businesses
					</Link>

					{/* Business Header */}
					{isLoading ? (
						<div className="mb-6 w-full lg:w-2/4">
							<SectionSkeleton />
						</div>
					) : business ? (
						<div className="mb-8 flex items-start justify-between">
							<div>
								<div className="flex flex-row items-center justify-start gap-x-2">
									<h1 className="text-foreground mb-2 text-2xl font-bold">
										{business?.businessName}
									</h1>

									<div
										className={`inline-flex items-center justify-center gap-2 gap-x-1 rounded-full bg-(--grey-1) px-2 py-1.5 text-xs font-medium text-(--text-1)`}>
										{business?.status === "ACTIVE" ? (
											<IoMdCheckmarkCircle size={16} className="text-(--green-1)" />
										) : business?.status === "PENDING_REVIEW" ? (
											<FaRegClock size={14} className="text-orange-500" />
										) : (
											<IoMdCloseCircle size={16} className="text-(--red-1)" />
										)}
										{business?.status === "ACTIVE" ? "COMPLETED" : business?.status}
									</div>
								</div>
								<p className="text-(--text-1)">{business?.cacNumber}</p>
							</div>
						</div>
					) : null}

					{/* Tabs */}
					<div className="mb-8 flex h-14 w-full items-center gap-2 overflow-x-auto rounded-lg bg-[#F5F5F5] p-1">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`shrink-0 cursor-pointer rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
									activeTab === tab.id
										? "bg-background text-foreground shadow-sm"
										: "hover:text-foreground text-(--text-1)"
								}`}>
								{tab.label}
							</button>
						))}
					</div>

					{/* Overview */}
					{activeTab === "overview" &&
						(isLoading ? (
							<div className="bg-background -mt-6">
								<PageSkeleton />
							</div>
						) : (
							<div className="space-y-6">
								{businessStatsData?.stats && (
									<KYBStepWrapper title="Financial Summary">
										<div className="grid grid-cols-1 gap-4 gap-y-0 rounded-lg px-4 sm:grid-cols-2 lg:flex lg:flex-nowrap lg:gap-x-6 lg:overflow-x-auto">
											{businessFinancialStats.map((stat, index) => (
												<div key={index} className="flex px-4 py-2 lg:items-start">
													<div className="flex-1">
														<div className="bg-background rounded-lg">
															<p className="mb-2 text-[16px] text-(--text-1)">{stat.label}</p>

															<div className="text-foreground mb-2 flex items-baseline gap-2">
																{stat.valueRow?.suffix && (
																	<span className="text-[24px] font-medium">
																		{stat.valueRow.suffix}
																	</span>
																)}
																<h2 className="text-[24px] font-bold">
																	{typeof stat.valueRow?.main === "number"
																		? stat.valueRow.main.toLocaleString()
																		: stat.valueRow?.main}
																</h2>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</KYBStepWrapper>
								)}

								<KYBStepWrapper title="Business Information" NoHorizontalPad>
									<div className="space-y-6">
										<div className="flex flex-col gap-4 border-b border-(--grey-1) px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
											<p className="mb-1 text-sm text-(--text-1)">Industry:</p>
											<p className="text-foreground font-medium">
												{business?.industry || "N/A"}
											</p>
										</div>

										<div className="flex flex-col gap-4 border-b border-(--grey-1) px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
											<p className="mb-1 text-sm text-(--text-1)">Business ID:</p>
											<p className="text-foreground font-medium">{business?.id}</p>
										</div>

										<div className="flex flex-col gap-4 border-b border-(--grey-1) px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
											<p className="mb-1 text-sm text-(--text-1)">Address:</p>
											<p className="text-foreground max-w-lg font-medium">
												{business?.addressLine1 || "N/A"}
											</p>
										</div>

										<div className="flex flex-col gap-4 border-b border-(--grey-1) px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
											<p className="mb-1 text-sm text-(--text-1)">Business Type:</p>
											<p className="text-foreground font-medium">
												{business?.businessType || "N/A"}
											</p>
										</div>

										<div className="flex flex-col gap-4 border-b border-(--grey-1) px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
											<p className="mb-1 text-sm text-(--text-1)">Website:</p>
											{business?.website && business?.website !== "" && (
												<Link
													href={toAbsoluteUrl(business?.website || "")}
													target="_blank"
													className="font-medium text-(--green-1) hover:underline">
													{business?.website || "N/A"}
												</Link>
											)}
										</div>

										<div className="flex flex-col gap-4 border-b border-(--grey-1) px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
											<p className="mb-1 text-sm text-(--text-1)">Email Address:</p>
											{business?.email && business?.email !== "" && (
												<Link
													href={`mailto:${business.email}`}
													target="_blank"
													className="font-medium text-(--green-1) hover:underline">
													{business?.email || "N/A"}
												</Link>
											)}
										</div>

										<div className="flex flex-col gap-4 border-b border-(--grey-1) px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
											<p className="mb-1 text-sm text-(--text-1)">Phone Number:</p>
											<p className="text-foreground font-medium">
												{business?.phoneNumber || "N/A"}
											</p>
										</div>

										<div className="flex flex-col gap-4 border-b border-(--grey-1) px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
											<p className="mb-1 text-sm text-(--text-1)">Linkedin:</p>
											{business?.linkedIn && business?.linkedIn !== "" && (
												<Link
													href={toAbsoluteUrl(business?.linkedIn || "")}
													target="_blank"
													className="font-medium text-(--green-1) hover:underline">
													{business?.linkedIn || "N/A"}
												</Link>
											)}
										</div>

										<div className="flex flex-col gap-4 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
											<p className="mb-1 text-sm text-(--text-1)">Support Email:</p>
											{business?.supportEmail && business?.supportEmail !== "" && (
												<Link
													href={`mailto:${business.supportEmail}`}
													target="_blank"
													className="font-medium text-(--green-1) hover:underline">
													{business?.supportEmail || "N/A"}
												</Link>
											)}
										</div>
									</div>
								</KYBStepWrapper>
							</div>
						))}

					{/* Documents */}
					{activeTab === "documents" &&
						(documentLoading ? (
							<div className="bg-background min-h-screen w-full px-6">
								<div className="w-full overflow-x-auto">
									<PageSkeleton />
								</div>
							</div>
						) : (
							<div className="space-y-6">
								<Table
									extraHeader="Documents"
									data={documents?.content || []}
									columns={documentColumns}
								/>
							</div>
						))}

					{/* Directors */}
					{activeTab === "directors" &&
						(directorsLoading ? (
							<div className="bg-background min-h-screen w-full px-6">
								<div className="w-full overflow-x-auto">
									<PageSkeleton />
								</div>
							</div>
						) : (
							<div className="space-y-6">
								<Table
									extraHeader="Directors"
									data={directors ?? []}
									columns={directorColumns}
								/>
							</div>
						))}
				</div>

				{/* Activities */}
				{activeTab === "activities" && (
					<div className="space-y-6">
						<Table
							extraHeader="Activities"
							data={paginatedActivities || []}
							columns={activityColumns}
							pagination={{
								currentPage: activityPage,
								totalItems: totalActivityItems,
								itemsPerPage: itemsPerPage,
								onPageChange: () => {},
							}}
							extraHeaderActions={
								<FilterDropdown
									options={actionFilterOptions}
									selected={activityFilter}
									onChange={(val) => {
										setActivityFilter(val)
									}}
								/>
							}
						/>
					</div>
				)}

				{/* Transactions */}
				{activeTab === "transactions" && (
					<div className="space-y-6">
						<Table
							extraHeader="Transactions"
							data={paginatedTransactions || []}
							columns={transactionColumns}
							extraHeaderActions={
								<FilterDropdown
									options={actionFilterOptions}
									selected={transactionFilter}
									onChange={(val) => {
										setTransactionFilter(val)
									}}
								/>
							}
							pagination={{
								currentPage: transactionPage,
								totalItems: totalTransactionItems,
								itemsPerPage: itemsPerPage,
								onPageChange: () => {},
							}}
						/>
					</div>
				)}

				{/* ── Document modals ── */}
				<DocumentReviewModal
					loading={loading}
					isOpen={reviewModalOpen}
					document={selectedDocument}
					onClose={() => setReviewModalOpen(false)}
					onApprove={handleApproveDocument}
					onReject={(reason) => handleRejectionConfirm(reason)}
				/>
				<DocumentHistoryModal
					isOpen={historyModalOpen}
					document={selectedDocument}
					onClose={() => setHistoryModalOpen(false)}
				/>

				{/* ── Director modal ── */}
				<DirectorDetailModal
					loading={loading}
					isOpen={directorModalOpen}
					director={selectedDirector}
					onClose={() => setDirectorModalOpen(false)}
					onApprove={handleApproveDirector}
					onReject={(reason) => handleRejectionConfirm(reason)}
					onRejectInitiate={handleRejectDirector}
				/>

				{/* ── Shared approval / rejection modals ── */}
				<ApprovalModal
					approvalMessage={approvalMessage}
					isOpen={approvalModalOpen}
					onClose={() => setApprovalModalOpen(false)}
				/>
			</div>
		</div>
	)
}
