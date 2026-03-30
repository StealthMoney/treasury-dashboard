"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_ROUTES = ["/", "/account/activate"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    const isPublic = PUBLIC_ROUTES.includes(pathname);
    const isLoggedIn = Boolean(session?.accessToken);

    if (!isLoggedIn && !isPublic) {
      router.replace("/");
      return;
    }

    if (isLoggedIn && pathname === "/") {
      router.replace("/credit");
      return;
    }
  }, [session, status, pathname, router]);

  if (status === "loading") return null;

  return <>{children}</>;
}
