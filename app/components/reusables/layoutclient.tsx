"use client"
import React from "react"
import Sidebar from "./sidebar"
import Topdash from "./topdash"
import { useState } from "react"

export default function Layoutclient({
	children,
}: {
	children: React.ReactNode
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	return (
		<div className="mx-auto max-w-400 px-4 py-8 sm:px-6 lg:px-6">
			<div id="app-root">
				<Topdash onMenuClick={() => setSidebarOpen((p) => !p)} />

				<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

				<main className="mt-20 min-h-[calc(100vh-80px)] w-full p-6 transition-all md:ml-[20%]">
					{children}
				</main>
			</div>
		</div>
	)
}
