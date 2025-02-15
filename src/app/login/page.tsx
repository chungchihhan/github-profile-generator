"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Github } from "lucide-react";
import Image from "next/image";

export default function Page() {
  const { data: session } = useSession();

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center min-h-screen bg-white/10 rounded-lg mb-4 w-full">
        <div className="text-center mb-40">
          {session ? (
            <>
              <div className="flex flex-col gap-4 font-mono items-center">
                <Image
                  src={session.user?.image || "/default-avatar.png"}
                  alt="User Avatar"
                  width={100}
                  height={100}
                  className="w-56 h-56 rounded-full"
                />
                <p className="text-lg text-white">
                  Welcome, <strong>{session.user?.name}!</strong>
                </p>
                <button
                  onClick={() => signOut()}
                  className="bg-green-900 shadow-lg text-white font-semibold px-8 py-2 rounded-lg hover:bg-green-800 transition"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4">
                <Github size={250} className="text-white" />
                {/* <p className="text-lg font-semibold text-gray-800">
                  Please sign in to continue
                </p> */}
                <button
                  onClick={() => signIn("github")}
                  className="gap-2 bg-white/30 font-mono text-lg text-white font-semibold px-8 py-2 rounded-lg hover:bg-white/20 focus:bg-white/10 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <Github size={18} className="" />
                  Sign in with GitHub
                </button>
                <p className="flex text-white gap-2 font-mono text-xs">
                  Don&apos;t have a github account?
                  <a
                    href="https://github.com/signup"
                    target="_blank"
                    className="underline"
                  >
                    Click here !
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
