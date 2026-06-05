"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Table, TableColumn } from "@/app/components/reusables/table"
import {
	TextField,
	SelectField,
} from "@/app/components/reusables/general_inputs"
import { Modal } from "@/app/components/reusables/modals/modal"
import {
	Business,
	BusinessDocument,
	DisplayBusiness,
} from "@/app/types/general"
import {
	useBusinesses,
	useBusinessesDocuments,
} from "@/app/hooks/use_businesses"
import PageSkeleton from "@/app/components/reusables/page_skeleton"
import ApprovalModal from "@/app/components/reusables/modals/approval_modal"
import { activateBusiness } from "@/app/server/business"
import { formatDateWithSuffix } from "@/app/functions/helpers/formatted_date"
import { StatsSection } from "@/app/components/reusables/stats_section"

const transformBusinessForDisplay = (business: Business): DisplayBusiness => ({
	id: business.id.toString(),
	name: business.businessName,
	rc: business.cacNumber,
	dateJoined: business.createdAt,
	time: new Date(business.createdAt).toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	}),
	joinedVia: "Desktop",
	browser: "Chrome OS",
	kybStatus: (business.status === "ACTIVE"
		? "Completed"
		: business.status === "REJECTED"
			? "Rejected"
			: "Pending") as DisplayBusiness["kybStatus"],
	status: (business.status === "ACTIVE"
		? "Active"
		: "Inactive") as DisplayBusiness["status"],
	industry: business.industry,
	address: `${business.addressLine1}, ${business.city}, ${business.state}`,
	contactPerson: "",
	contactRole: "",
	email: business.email,
	phone: business.phoneNumber,
	financialStats: [],
	documents: [],
})

export default function BusinessListPage() {
	const [currentPage, setCurrentPage] = useState(1)
	const [searchValue, setSearchValue] = useState("")
	const [selectedStatus, setSelectedStatus] = useState("")
	const [selectedBusiness, setSelectedBusiness] =
		useState<DisplayBusiness | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [businesses, setBusinesses] = useState<DisplayBusiness[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [approvalMessage, setApprovalMessage] = useState<{
		type: "success" | "failed"
		title: string
		message: string
	} | null>(null)

	const [approvalModalOpen, setApprovalModalOpen] = useState(false)

	const { data: documents } = useBusinessesDocuments(
		selectedBusiness?.id ? { "ownerId.equals": selectedBusiness.id } : {},
		!!selectedBusiness?.id
	)

	const areAllDocumentsVerified = () => {
		if (!documents?.content?.length) return false

		return documents.content.every(
			(document: BusinessDocument) => document.status?.toLowerCase() === "verified"
		)
	}

	const params = {
		page: String(currentPage - 1),

		...(selectedStatus && {
			"status.equals":
				selectedStatus === "Completed"
					? "ACTIVE"
					: selectedStatus === "Rejected"
						? "REJECTED"
						: "PENDING_REVIEW",
		}),

		...(searchValue !== "" && {
			"businessName.contains": searchValue,
		}),
	}

	const {
		data: rawBusinesses,
		isLoading,
		refetch: refetchBusiness,
	} = useBusinesses(params)

	useEffect(() => {
		const data = rawBusinesses?.content?.map(transformBusinessForDisplay) || []

		setBusinesses(data)
	}, [rawBusinesses])

	const statusOptions = [
		{ label: "All Status", value: "" },
		{ label: "Completed", value: "Completed" },
		{ label: "Pending", value: "Pending" },
		{ label: "Rejected", value: "Rejected" },
	]

	const handleOpenModal = (business: DisplayBusiness) => {
		setSelectedBusiness(business)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setTimeout(() => setSelectedBusiness(null), 300)
	}

	const handleApproveBusiness = async () => {
		if (!selectedBusiness) return

		setLoading(true)
		try {
			const res = await activateBusiness(selectedBusiness.id)
			if (res.success) {
				setApprovalMessage({
					type: "success",
					title: "Business Activation Successful!",
					message: "Your request to activate this business has been successful!",
				})
			} else {
				setApprovalMessage({
					type: "failed",
					title: "Business Activation Failed!",
					message: res.error,
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
			handleCloseModal()
			setApprovalModalOpen(true)
			await refetchBusiness()
		}
	}

	const getKYBStatusBadge = (status: string) => {
		const baseClass =
			"inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"

		if (status === "Completed") {
			return (
				<div className={`${baseClass} bg-green-50 text-(--green-1)`}>
					<span className="h-2 w-2 rounded-full bg-(--green-1)" />
					{status}
				</div>
			)
		}

		if (status === "Pending") {
			return (
				<div className={`${baseClass} bg-orange-50 text-orange-600`}>
					<span className="h-2 w-2 rounded-full bg-orange-500" />
					{status}
				</div>
			)
		}

		if (status === "Rejected") {
			return (
				<div className={`${baseClass} bg-red-50 text-(--red-1)`}>
					<span className="h-2 w-2 rounded-full bg-(--red-1)" />
					{status}
				</div>
			)
		}

		return (
			<div className={`${baseClass} bg-gray-50 text-(--text-1)`}>
				<span className="h-2 w-2 rounded-full bg-(--text-1)" />
				{status}
			</div>
		)
	}

	const getAccountStatusTag = (status: string) => {
		if (status === "Active") {
			return (
				<div className="inline-block rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-(--green-1)">
					{status}
				</div>
			)
		}

		if (status === "Suspended") {
			return (
				<div className="inline-block rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-600">
					{status}
				</div>
			)
		}

		return (
			<div className="inline-block rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-(--text-1)">
				{status}
			</div>
		)
	}

	const columns: TableColumn<DisplayBusiness>[] = [
		{
			header: "Business",
			accessor: (row) => (
				<div className="flex flex-col">
					<p className="text-foreground font-semibold">{row.name}</p>
					<p className="text-xs text-(--text-1)">{row.rc}</p>
				</div>
			),
		},
		{
			header: "Date Joined",
			accessor: (row) => (
				<div>
					<p>{formatDateWithSuffix(row.dateJoined)}</p>
					<p className="text-xs text-(--text-1)">{row.time}</p>
				</div>
			),
		},
		{
			header: "KYB",
			accessor: (row) => getKYBStatusBadge(row.kybStatus),
		},
		{
			header: "Status",
			accessor: (row) => getAccountStatusTag(row.status),
		},
		{
			header: "Action",
			accessor: (row) => (
				<button
					onClick={() => handleOpenModal(row)}
					title="More options"
					className="hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg text-(--text-1) transition hover:bg-(--grey-4)">
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<circle cx="5" cy="12" r="2" />
						<circle cx="12" cy="12" r="2" />
						<circle cx="19" cy="12" r="2" />
					</svg>
				</button>
			),
		},
	]

	const businessStats = [
		{
			label: "Total Businesses",
			value: 1280,
			// footer: "All registered businesses",
		},
		{
			label: "Active Businesses",
			value: 945,
			// footer: "Currently active on platform",
		},
		{
			label: "Inactive Businesses",
			value: 335,
			// footer: "Dormant or suspended accounts",
		},
	]

	return (
		<div className="bg-background min-h-screen w-full px-6">
			<div className="w-full overflow-x-auto md:max-w-[80%]">
				<div className="mx-auto px-4 py-8 sm:px-6 lg:px-6">
					<div className="mb-8 flex items-center justify-between gap-4">
						<div className="max-w-100">
							<h1 className="text-foreground text-xl font-bold">Business List</h1>
							<small className="text-[16px] text-(--text-1)">
								Manage and review all businesses and keep track of their activities here
							</small>
						</div>

						<div className="flex items-center gap-2">
							<TextField
								id="business-search"
								label="Search"
								placeholder="Search by business name, website or email..."
								value={searchValue}
								onChange={(value) => {
									setCurrentPage(1)
									setSearchValue(value)
								}}
								compact
								searchIcon
							/>

							<SelectField
								id="business-status"
								label="Status"
								value={selectedStatus}
								onChange={(value) => {
									setCurrentPage(1)
									setSelectedStatus(value)
								}}
								options={statusOptions}
								placeholder="All Status"
								compact
							/>
						</div>
					</div>

					<StatsSection stats={businessStats} />

					{isLoading ? (
						<div className="bg-background min-h-screen w-full">
							<div className="w-full overflow-x-auto">
								<PageSkeleton />
							</div>
						</div>
					) : (
						<Table
							data={businesses}
							columns={columns}
							extraHeader="Registered Businesses"
							pagination={{
								currentPage,
								totalItems: rawBusinesses?.totalElements || 0,
								itemsPerPage: rawBusinesses?.size || 15,
								onPageChange: setCurrentPage,
							}}
						/>
					)}
				</div>
			</div>

			<ApprovalModal
				approvalMessage={approvalMessage}
				isOpen={approvalModalOpen}
				onClose={() => setApprovalModalOpen(false)}
			/>

			<Modal
				isOpen={isModalOpen}
				title="Business Details"
				onClose={handleCloseModal}
				variant="slide">
				{selectedBusiness && (
					<div className="flex h-full flex-col">
						<div className="flex flex-1 flex-col gap-5">
							<div className="flex flex-col gap-1 border-b border-(--grey-1) pb-5">
								<p className="text-xs font-medium tracking-wide text-(--text-1) uppercase">
									Business
								</p>

								<p className="text-foreground text-base font-semibold">
									{selectedBusiness.name}
								</p>

								<p className="text-xs text-(--text-1)">{selectedBusiness.rc}</p>
							</div>

							<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
								<p className="text-sm text-(--text-1)">Industry</p>

								<p className="text-foreground text-sm font-medium">
									{selectedBusiness.industry}
								</p>
							</div>

							<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
								<p className="text-sm text-(--text-1)">Date Joined</p>

								<div className="text-right">
									<p className="text-foreground text-sm font-medium">
										{formatDateWithSuffix(selectedBusiness.dateJoined)}
									</p>

									<p className="text-xs text-(--text-1)">{selectedBusiness.time}</p>
								</div>
							</div>

							<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
								<p className="text-sm text-(--text-1)">KYB Status</p>

								{getKYBStatusBadge(selectedBusiness.kybStatus)}
							</div>

							<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
								<p className="text-sm text-(--text-1)">Account Status</p>

								{getAccountStatusTag(selectedBusiness.status)}
							</div>

							<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
								<p className="text-sm text-(--text-1)">Contact Email</p>

								<p className="text-foreground max-w-50 text-sm font-medium">
									{selectedBusiness.email}
								</p>
							</div>

							<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
								<p className="text-sm text-(--text-1)">Phone Number</p>

								<p className="text-foreground text-sm font-medium">
									{selectedBusiness.phone}
								</p>
							</div>

							<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
								<p className="text-sm text-(--text-1)">Address</p>

								<p className="text-foreground max-w-50 text-right text-sm font-medium">
									{selectedBusiness.address}
								</p>
							</div>

							<Link
								href={`/admin/manage-business/${selectedBusiness.id}`}
								className="mt-1 flex items-center gap-2 text-sm font-medium text-(--green-1) hover:underline"
								onClick={handleCloseModal}>
								<svg
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									/>
								</svg>
								View Full Details
							</Link>
						</div>

						{selectedBusiness.kybStatus === "Pending" && (
							<div className="-mx-6 mt-6 border-t border-(--grey-1) px-6 pt-6 pb-0">
								<button
									title={
										!areAllDocumentsVerified()
											? "Some documents are yet to be verified or has been rejected"
											: "Approve business"
									}
									disabled={!areAllDocumentsVerified()}
									onClick={handleApproveBusiness}
									className={`w-full rounded-xl ${areAllDocumentsVerified() ? "cursor-pointer bg-(--green-1)" : "cursor-not-allowed bg-(--green-1)/60"} py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.99]`}>
									{loading ? "Approving Business..." : "Approve Business"}
								</button>
							</div>
						)}
					</div>
				)}
			</Modal>
		</div>
	)
}
