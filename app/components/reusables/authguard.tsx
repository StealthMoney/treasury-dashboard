"use client";

import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useProfile } from "@/app/contexts/user_provider";
import { LineLoader } from "./line_loader";

const PUBLIC_ROUTES = ["/", "/account/activate"];
const ROUTE_MAP: Record<string, string> = {
  "/credit": "Credit",
  "/report": "Report",
  "/profile": "Profile",
  "/settings": "Settings",
};

type AuthDecision =
  | { type: "loading" }
  | { type: "redirect"; to: string }
  | { type: "allow" };

function resolveAuth(
  status: string,
  session: ReturnType<typeof useSession>["data"],
  user: ReturnType<typeof useProfile>["user"],
  pathname: string,
): AuthDecision {
  if (status === "loading") return { type: "loading" };

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isLoggedIn = Boolean(session?.accessToken);
  const isTokenExpired = session?.expires
    ? new Date(session.expires).getTime() < Date.now()
    : true;

  if ((!isLoggedIn || isTokenExpired) && !isPublic) {
    return { type: "redirect", to: "/" };
  }

  if (isLoggedIn && user) {
    const matchedEntry = Object.entries(ROUTE_MAP).find(
      ([route]) => pathname === route || pathname.startsWith(route + "/"),
    );
    const requiredMenu = matchedEntry?.[1];

    const hasAccess = requiredMenu
      ? user.profileMenu.includes(requiredMenu)
      : true;

    if (!hasAccess) {
      const firstRoute = Object.entries(ROUTE_MAP).find(([, menu]) =>
        user.profileMenu.includes(menu),
      )?.[0];
      if (firstRoute) return { type: "redirect", to: firstRoute };
    }

    if (pathname === "/") {
      const defaultRoute =
        Object.entries(ROUTE_MAP).find(([, menu]) =>
          user.profileMenu.includes(menu),
        )?.[0] ?? "/";
      return { type: "redirect", to: defaultRoute };
    }
  }

  return { type: "allow" };
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { user } = useProfile();
  const router = useRouter();
  const pathname = usePathname();

  const decision = useMemo(
    () => resolveAuth(status, session, user, pathname),
    [status, session, user, pathname],
  );

  useEffect(() => {
    if (decision.type === "redirect") {
      router.replace(decision.to);
    }
  }, [decision, router]);

  if (decision.type === "loading" || decision.type === "redirect") {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <LineLoader className="scale-125" />
      </div>
    );
  }

  return <>{children}</>;
}
