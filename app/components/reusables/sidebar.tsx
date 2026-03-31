"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiHandCoins } from "react-icons/pi";
import { TbFileAnalytics } from "react-icons/tb";
import { CiSettings, CiLogout } from "react-icons/ci";
import { RiUser3Line } from "react-icons/ri";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Spinner } from "./spinner";
import { FeedbackModal } from "./feedback_modal";
import { filterLinks } from "@/app/functions/helpers/available_links";
import { useProfile } from "@/app/contexts/user_provider";
import { NavLink } from "@/app/types/general";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { user, loading: userInfoLoading } = useProfile();

  const pathname = usePathname();

  const navLinks = [
    { logo: <PiHandCoins />, text: "Credit", href: "/credit" },
    { logo: <TbFileAnalytics />, text: "Report", href: "/report" },
    { logo: <RiUser3Line />, text: "Profile", href: "/profile" },
    { logo: <CiSettings />, text: "Settings", href: "/settings" },
  ];

  const filteredLinks = filterLinks(user, navLinks);

  const handleLogout = async () => {
    setLoading(true);
    localStorage.clear();
    await signOut();
    setLoading(false);
  };

  return (
    <>
      <FeedbackModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        description="Are you sure you want to log out of your account?"
        buttonCount={2}
        buttons={[
          {
            label: "Cancel",
            variant: "outline",
            onClick: () => setShowLogoutModal(false),
          },
          {
            label: "Logout",
            variant: "primary",
            onClick: handleLogout,
            loading: loading,
          },
        ]}
      />

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
          {filteredLinks.map((item) => {
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
          onClick={() => setShowLogoutModal(true)}
          className="
            mb-6 flex items-center gap-2
            rounded-md py-2 px-2
            transition-colors
            text-(--red-1) cursor-pointer
          "
        >
          <CiLogout /> Logout {loading && <Spinner />}
        </button>
      </aside>
    </>
  );
}
