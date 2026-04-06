"use client"

import { useState } from "react"
import { ProfileTab } from "./profile"
import { PasswordSettingTab } from "./password"

type TabType = "profile" | "password"

export default function Profile() {
	const [activeTab, setActiveTab] = useState<TabType>("profile")

	const tabs: Array<{ id: TabType; label: string }> = [
		{ id: "profile", label: "Admin Profile" },
		{ id: "password", label: "Password Setting" },
	]

	const renderTabContent = () => {
		switch (activeTab) {
			case "profile":
				return <ProfileTab />
			case "password":
				return <PasswordSettingTab />
			default:
				return <ProfileTab />
		}
	}

	return (
		<div className="bg-background min-h-screen w-full lg:px-6">
			<div className="px-4 py-8 sm:px-6 md:max-w-[80%] lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-foreground mb-2 text-[20px] font-bold">
						Profile management
					</h1>
					<p className="text-[16px] text-(--text-1)">
						Manage your business profile here
					</p>
				</div>

				{/* Tabs Navigation */}
				<div className="mb-8 overflow-x-auto">
					<div className="flex h-14 w-fit min-w-full gap-4 rounded-lg bg-[#F5F5F5] p-1 md:w-full">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-all md:min-w-[15%] ${
									activeTab === tab.id
										? "bg-background text-foreground font-medium shadow-sm"
										: "hover:text-foreground text-(--text-1)"
								}`}>
								{tab.label}
							</button>
						))}
					</div>
				</div>

				{/* Tab Content */}
				{/* <div className="bg-white border border-border rounded-lg p-6 md:p-8"> */}
				{renderTabContent()}
				{/* </div> */}
			</div>
		</div>
	)
}
