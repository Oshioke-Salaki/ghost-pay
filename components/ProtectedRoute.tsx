"use client";
import { useAccount } from "@starknet-react/core";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { account } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!account) {
      router.push("/");
    }
  }, [account]);

  // Optional: render nothing while redirecting
  if (!account) return null;

  return <>{children}</>;
}
