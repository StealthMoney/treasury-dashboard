"use client"

import { useState } from "react"
import { AiOutlinePlus, AiOutlineMore } from "react-icons/ai"
import { KYBStepWrapper } from "../reusables/kybstepwraper"

interface TeamMember {
	id: string
	name: string
	email: string
	role: string
	dateJoined: string
	status: "Active" | "Inactive"
}

export function TeamTab() {
	const [members, setMembers] = useState<TeamMember[]>([
		{
			id: "1",
			name: "John F Doe",
			email: "johnfdoe@gmail.com",
			role: "Chief Admin",
			dateJoined: "09-10-2025",
			status: "Active",
		},
		{
			id: "2",
			name: "John F Doe",
			email: "johnfdoe@gmail.com",
			role: "Chief Admin",
			dateJoined: "09-10-2025",
			status: "Active",
		},
		{
			id: "3",
			name: "John F Doe",
			email: "johnfdoe@gmail.com",
			role: "Chief Admin",
			dateJoined: "09-10-2025",
			status: "Active",
		},
		{
			id: "4",
			name: "John F Doe",
			email: "johnfdoe@gmail.com",
			role: "Chief Admin",
			dateJoined: "09-10-2025",
			status: "Active",
		},
		{
			id: "5",
			name: "John F Doe",
			email: "johnfdoe@gmail.com",
			role: "Chief Admin",
			dateJoined: "09-10-2025",
			status: "Active",
		},
	])

	const handleAddMember = () => {
		alert("Not functional yet")
	}

	return (
		<KYBStepWrapper title="Team">
			<div className="space-y-6">
				<div className="-mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="px-4">
						<h3 className="text-[20px] font-semibold text-[#171717]">Team members</h3>
					</div>
					<button
						onClick={handleAddMember}
						className="bg-foreground text-background flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors hover:cursor-pointer sm:w-auto sm:justify-start">
						<AiOutlinePlus size={18} />
						<span>Add Member</span>
					</button>
				</div>

				{/* Table - Desktop View */}
				<div className="hidden overflow-x-auto md:block">
					<table className="w-full">
						<thead>
							<tr className="bg-(--grey-4)">
								<th className="px-4 py-5 text-left text-[16px] font-medium text-(--text-1)">
									Name
								</th>
								<th className="px-4 py-5 text-left text-[16px] font-medium text-(--text-1)">
									Role
								</th>
								<th className="px-4 py-5 text-left text-[16px] font-medium text-(--text-1)">
									Date Joined
								</th>
								<th className="px-4 py-5 text-left text-[16px] font-medium text-(--text-1)">
									Status
								</th>
								<th className="px-4 py-5 text-left text-[16px] font-medium text-(--text-1)">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{members.map((member) => (
								<tr
									key={member.id}
									className="hover:bg-muted/50 border-b border-(--grey-1)">
									<td className="px-4 py-4">
										<div>
											<p className="text-foreground font-medium">{member.name}</p>
											<p className="text-sm text-(--text-1)">{member.email}</p>
										</div>
									</td>
									<td className="px-4 py-4 text-sm">
										<span className="rounded-full border border-(--grey-1) bg-(--grey-4) px-2 py-2">
											{member.role}
										</span>
									</td>
									<td className="px-4 py-4 text-sm">
										<div>{member.dateJoined}</div>
										<div className="text-muted-foreground text-[14px]">14:57 PM</div>
									</td>
									<td className="px-4 py-4">
										<span className="rounded-full bg-[#EAF5ED] px-3 py-2 text-[14px] font-medium text-[#05AD5D]">
											{member.status}
										</span>
									</td>
									<td className="px-4 py-4">
										<button
											title="more"
											className="hover:bg-muted rounded-lg p-2 transition-colors">
											<AiOutlineMore size={18} className="text-foreground" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Mobile View */}
				<div className="space-y-3 md:hidden">
					{members.map((member) => (
						<div
							key={member.id}
							className="border-border space-y-3 rounded-lg border p-4">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-foreground font-medium">{member.name}</p>
									<p className="text-muted-foreground text-sm">{member.email}</p>
								</div>
								<button
									title="more"
									className="hover:bg-muted rounded-lg p-2 transition-colors">
									<AiOutlineMore size={18} className="text-muted-foreground" />
								</button>
							</div>

							<div className="grid grid-cols-2 gap-3 text-sm">
								<div>
									<p className="text-muted-foreground text-xs">Role</p>
									<p className="font-medium">{member.role}</p>
								</div>
								<div>
									<p className="text-muted-foreground text-xs">Status</p>
									<span className="inline-block rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
										{member.status}
									</span>
								</div>
							</div>

							<div className="text-sm">
								<p className="text-muted-foreground text-xs">Date Joined</p>
								<p className="font-medium">{member.dateJoined} 14:57 PM</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</KYBStepWrapper>
	)
}
