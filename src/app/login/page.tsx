"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Github } from "lucide-react";

export default function Page() {
  const { data: session } = useSession();

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center min-h-screen bg-white/10 rounded-lg mb-4 w-full">
        <div className="text-center mb-40">
          {session ? (
            <>
              <img
                src={session.user?.image || "/default-avatar.png"}
                alt="User Avatar"
                className="w-20 h-20 rounded-full mx-auto mb-3"
              />
              <p className="text-lg font-semibold text-gray-800">
                Welcome, {session.user?.name}!
              </p>
              <button
                onClick={() => signOut()}
                className="mt-4 w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition"
              >
                Sign Out
              </button>
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
                  className="gap-2 bg-white/30 font-mono text-lg text-white font-semibold px-8 py-2 rounded-lg hover:bg-gray-700 transition flex items-center justify-center"
                >
                  <Github size={18} className="" />
                  Sign in with GitHub
                </button>
                <p className="flex text-white gap-2 font-mono text-xs">
                  Don't have a github account?
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
