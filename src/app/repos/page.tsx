"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-600">
        <p className="text-lg">Loading session...</p>
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
