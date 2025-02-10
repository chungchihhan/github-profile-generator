"use client";
import ImageGenerator from "@/components/ImageGenerator";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status !== "loading") {
      setCheckingAuth(false);
    }
  }, [status, router]);

  if (checkingAuth) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center">
        <p className="text-xl text-white font-mono">
          Checking authentication...
        </p>
      </main>
    );
  }

  if (!session) {
    return (
      <div>
        <p>Your session has expired. Please log in again.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full">
      <ImageGenerator />
    </main>
  );
}
