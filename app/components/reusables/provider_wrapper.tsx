"use client";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "./authguard";
import { ProfileProvider } from "@/app/contexts/user_provider";

export default function ProvideWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthGuard>
        <ProfileProvider>{children}</ProfileProvider>
      </AuthGuard>
    </SessionProvider>
  );
}
