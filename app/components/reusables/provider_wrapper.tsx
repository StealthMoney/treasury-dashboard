"use client";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "./authguard";

export default function ProvideWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}
