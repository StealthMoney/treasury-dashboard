"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiHandCoins } from "react-icons/pi";
import { TbFileAnalytics } from "react-icons/tb";
import { CiSettings, CiLogout } from "react-icons/ci";
import { RiUser3Line } from "react-icons/ri";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const navLinks = [
    { logo: <PiHandCoins />, text: "Credit", href: "/credit" },
    { logo: <TbFileAnalytics />, text: "Report", href: "/report" },
    { logo: <RiUser3Line />, text: "Profile", href: "/profile" },
    { logo: <CiSettings />, text: "Settings", href: "/settings" },
  ];

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-foreground/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed top-20 left-0 z-50
          h-[calc(100vh-80px)]
          bg-background
          px-5
          flex flex-col justify-between
          transition-transform duration-300
          w-[75%] md:w-[20%]
          md:border-r md:border-r-(--grey-1)
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="mt-5 flex flex-col gap-2">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-2
                  rounded-md py-2 px-2
                  transition-colors
                  ${
                    isActive
                      ? "bg-(--grey-1) text-foreground"
                      : "text-(--text-1) hover:bg-(--grey-1) hover:text-foreground"
                  }
                `}
              >
                {item.logo}
                {item.text}
              </Link>
            );
          })}
        </div>

        <button
          className="
            mb-6 flex items-center gap-2
            rounded-md py-2 px-2
            transition-colors
            text-(--red-1) cursor-pointer
          "
        >
          <CiLogout /> Logout
        </button>
      </aside>
    </>
  );
}
