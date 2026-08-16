"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LoaderIcon } from "@/components/ui/icons";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page text-ink-soft gap-2 font-[var(--font-jakarta)]">
        <LoaderIcon width={20} height={20} className="animate-spin" />
        <span>Authenticating...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
