"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import React, { Suspense } from "react";
import { activate } from "@/app/server/activate";
import { Spinner } from "@/app/components/reusables/spinner";

interface Data {
  status: number;
  message: string;
}

const ActivationContent = () => {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");

  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Data | null>(null);

  const handleActivation = React.useCallback(async () => {
    if (!key) {
      setData({
        status: 400,
        message: "Invalid or missing activation link.",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await activate(key);
      setData(res);
    } catch (err) {
      setData({
        status: 500,
        message: "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }, [key]);

  React.useEffect(() => {
    handleActivation();
  }, [handleActivation]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  console.log(data, "is data");

  if (data && data.status !== 200) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Activation Failed</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {data.message || "We couldn’t activate your account."}
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-black/90 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (data && data.status === 200) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Account Activated 🎉</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your account has been successfully activated.
          </p>

          <Link
            href="/account/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-black/90 transition"
          >
            Continue to Login
          </Link>
        </div>
      </div>
    );
  }

  return null;
};

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <Spinner />
  </div>
);

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ActivationContent />
    </Suspense>
  );
}
