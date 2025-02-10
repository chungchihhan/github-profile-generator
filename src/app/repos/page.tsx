"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  language: string;
  visibility: string;
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
        console.log(res);
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
    <div className="w-full px-4 pb-12">
      <div className="">
        <h1 className="block text-sm font-bold text-white py-2">
          Your GitHub Repos
        </h1>
        <ul className="grid grid-cols-3 gap-4">
          {repos.map((repo) => (
            <li
              key={repo.id}
              className={`flex flex-col gap-6 font-mono justify-between ${
                repo.visibility === "private" ? "bg-white/5" : "bg-white/20"
              } p-4 rounded-lg shadow-lg`}
            >
              <div>
                <a
                  href={repo.html_url}
                  className="text-lg font-semibold text-white underline"
                >
                  {repo.name}
                </a>
                <p className="text-sm text-gray-300 mb-2 ">
                  {repo.description || "No description provided."}
                </p>
              </div>
              <div className="text-xs text-white w-full flex justify-between items-center">
                <p
                  className={`px-3 py-1 ${
                    repo.visibility === "private"
                      ? "bg-white/15"
                      : "bg-white/30"
                  } rounded-full uppercase shadow-lg `}
                >
                  {repo.visibility}
                </p>
                <p>{repo.language || "N/A"}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
