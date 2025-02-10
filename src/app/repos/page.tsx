"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Repo {
  id: number;
  name: string;
  description: string;
  language: string;
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const [repos, setRepos] = useState<Repo[]>([]);
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status !== "loading") {
      setCheckingAuth(false);
    }
  }, [status, router]);

  useEffect(() => {
    const fetchRepos = async () => {
      if (!session?.accessToken) return;
      try {
        const res = await fetch("https://api.github.com/user/repos", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        if (!res.ok) {
          throw new Error("Error fetching repos");
        }
        const data: Repo[] = await res.json();
        setRepos(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRepos();
  }, [session]);

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
    <div className="w-full py-8 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Your GitHub Repos
        </h1>
        <ul className="space-y-4">
          {repos.map((repo) => (
            <li
              key={repo.id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {repo.name}
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                {repo.description || "No description provided."}
              </p>
              <p className="text-sm">
                <strong>Language:</strong> {repo.language || "N/A"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
