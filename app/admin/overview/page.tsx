"use client"

import { useState } from "react"
import { Table, TableColumn } from "@/app/components/reusables/table"
import { StatsSection } from "@/app/components/reusables/stats_section"
import {
	TextField,
	SelectField,
} from "@/app/components/reusables/general_inputs"
import {
	formatDateWithSuffix,
	formatTimeFromISO,
} from "@/app/functions/helpers/formatted_date"
import { ActivityIcon } from "@/app/components/reusables/activity_icon"
import { resolveActivityIconType } from "@/app/functions/helpers/activity_icon_resolver"
import { useAdminStats } from "@/app/hooks/use_admin"
import {
	RecentActivity2,
	PendingAction,
	RecentBusiness,
} from "@/app/types/general"
import SectionSkeleton from "@/app/components/reusables/sectionSkeleton"
import getAccountStatusTag from "@/app/components/reusables/status_tag"

export default function AdminOverviewPage() {
	const [searchValue, setSearchValue] = useState("")
	const [timeFilter, setTimeFilter] = useState("")

	const { data: adminStats, isLoading } = useAdminStats()

	const stats = adminStats?.stats
	const pendingActions = adminStats?.pendingActions ?? []
	const recentActivities = adminStats?.recentActivities ?? []
	const recentBusinesses = adminStats?.recentBusinesses ?? []

	function exportCSV() {
		const headers = [
			"ID",
			"Business Name",
			"RC Number",
			"Email",
			"Status",
			"Annual Revenue",
			"Currency",
			"Created At",
			"Updated At",
		]
		const rows = recentBusinesses.map((bs: RecentBusiness) => [
			bs.id,
			bs.businessName,
			bs.rcNumber,
			formatDateWithSuffix(bs.createdAt),
			bs.email,
			bs.status,
			bs.annualRevenue,
			bs.annualRevenueCurrency,
			bs.createdAt,
			bs.updatedAt,
		])
		const csv = [headers, ...rows]
			.map((row) =>
				row
					.map((v: RecentBusiness) => `"${String(v).replace(/"/g, '""')}"`)
					.join(",")
			)
			.join("\n")
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = "business.csv"
		a.click()
		URL.revokeObjectURL(url)
	}

	// Stats
	const overviewStats = [
		{
			label: "Total Businesses",
			value: (stats?.totalBusinesses ?? 0).toLocaleString("en-US"),
		},
		{
			label: "Pending Reviews",
			value: (stats?.pendingReviews ?? 0).toLocaleString("en-US"),
		},
		{
			label: "Approved Credit Lines",
			value: `${(stats?.approvedCreditLines ?? 0).toLocaleString("en-US")}`,
		},
		{
			label: "Flagged Businesses",
			value: (stats?.flaggedBusinesses ?? 0).toLocaleString("en-US"),
		},
	]

	const timeOptions = [
		{ label: "All time", value: "" },
		{ label: "Today", value: "today" },
		{ label: "This week", value: "week" },
		{ label: "This month", value: "month" },
	]

	// Business columns — Date, Business, KYB Status, Action only
	const businessColumns: TableColumn<RecentBusiness>[] = [
		{
			header: "Date",
			accessor: (row) => (
				<div>
					<p className="text-foreground min-w-20 text-[13px]">
						{formatDateWithSuffix(row.createdAt)}
					</p>
					<p className="text-xs text-(--text-1)">
						{formatTimeFromISO(row.createdAt)}
					</p>
				</div>
			),
		},
		{
			header: "Business",
			accessor: (row) => (
				<div className="flex flex-col">
					<p className="text-foreground text-[13px] font-semibold">
						{row.businessName}
					</p>
					<p className="text-xs text-(--text-1)">{row.rcNumber}</p>
				</div>
			),
		},
		{
			header: "KYB Status",
			accessor: (row) => getAccountStatusTag(row.status.split("_").join(" ")),
		},
		{
			header: "",
			accessor: () => (
				<button
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

	// Activity columns
	const activityColumns: TableColumn<RecentActivity2>[] = [
		{
			header: "Activity:",
			accessor: (row) => (
				<div className="flex items-center gap-3">
					<ActivityIcon type={resolveActivityIconType(row.activities ?? "")} />
					<div className="flex flex-col">
						<p className="text-foreground max-w-80 text-[14px] font-semibold">
							{row.activities}
						</p>
						{/* <p className="max-w-90 truncate text-xs text-(--text-1)">
							{row.description}
						</p> */}
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

	return (
		<div className="bg-background min-h-screen w-full px-6">
			{/* ── Top bar ── */}
			<div className="w-full overflow-x-auto md:max-w-[80%]">
				<div className="mx-auto px-4 sm:px-6 lg:px-1">
					<div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
						{/* Title */}
						<div className="max-w-full lg:max-w-100">
							<h1 className="text-foreground text-xl font-bold">Overview</h1>
							<small className="text-[14px] text-(--text-1) sm:text-[15px] lg:text-[16px]">
								Manage and monitor business activities and platform insights
							</small>
						</div>

						{/* Controls */}
						<div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:flex-nowrap lg:justify-end">
							{/* <TextField
								id="overview-search"
								label="Search"
								placeholder="Search..."
								value={searchValue}
								onChange={(value) => setSearchValue(value)}
								compact
								searchIcon
							/>

							<SelectField
								id="time-filter"
								label="Time"
								value={timeFilter}
								onChange={(value) => setTimeFilter(value)}
								options={timeOptions}
								placeholder="All time"
								compact
							/> */}

							{/* <button
								onClick={exportCSV}
								className="bg-foreground text-background flex w-full cursor-pointer items-center justify-center gap-2 truncate rounded-lg px-4 py-2 text-sm font-medium transition hover:opacity-90 sm:w-auto">
								<span>Export CSV</span>
								<svg
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button> */}
						</div>
					</div>

					{/* ── Content ── */}
					<div className="w-full">
						{/* Stats */}
						<StatsSection stats={overviewStats} />

						<div className="mb-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_1fr]">
							{/* Recent businesses */}
							{isLoading ? (
								<div className="bg-background min-h-screen w-full">
									<div className="w-full overflow-x-auto">
										<SectionSkeleton />
									</div>
								</div>
							) : (
								<div className="max-h-125 w-full overflow-hidden overflow-y-auto">
									<Table<RecentBusiness>
										data={recentBusinesses}
										columns={businessColumns}
										extraHeader="Recent businesses"
									/>
								</div>
							)}

							{/* Pending actions */}
							{isLoading ? (
								<div className="bg-background min-h-screen w-full">
									<div className="w-full overflow-x-auto">
										<SectionSkeleton />
									</div>
								</div>
							) : (
								<div className="bg-background max-h-125 overflow-hidden overflow-y-auto rounded-lg border border-(--grey-1)">
									{/* Header */}
									<div className="border-b border-(--grey-1) bg-(--grey-4) px-4 py-4 sm:px-6">
										<h3 className="text-foreground text-[14px] font-semibold sm:text-[16px]">
											Pending actions
										</h3>
									</div>

									{/* List */}
									<div className="divide-y divide-(--grey-1)">
										{pendingActions.map((action: PendingAction) => (
											<div
												key={action.publicId ?? action.time}
												className="flex items-center justify-between gap-4 px-4 py-4 transition hover:bg-(--grey-4) sm:px-6">
												<div className="flex flex-col">
													<p className="text-foreground text-[14px] font-semibold">
														{action.title}
													</p>
													<p className="max-w-50 truncate text-xs text-(--text-1)">
														{action.description}
													</p>
												</div>

												<p className="text-foreground min-w-15 text-right text-[13px] font-medium">
													{formatDateWithSuffix(action.time)}
												</p>
											</div>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Recent activities */}
						<Table<RecentActivity2 & { id: string | number }>
							data={recentActivities.map((a: RecentActivity2, i: number) => ({
								...a,
								id: i,
							}))}
							columns={activityColumns}
							extraHeader="Recent activities"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
