"use client";
import React from "react";
import Sidebar from "./sidebar";
import Topdash from "./topdash";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";

export default function Layoutclient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        <div className="px-4 sm:px-6 lg:px-6 py-8 mx-auto max-w-400">
          <Topdash onMenuClick={() => setSidebarOpen((p) => !p)} />

          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <main
            className="mt-20
    min-h-[calc(100vh-80px)]
    w-full
    p-6
    transition-all
    md:ml-[20%]"
          >
            <SessionProvider>{children}</SessionProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
