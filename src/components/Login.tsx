"use client";
import { signIn, signOut, useSession } from "next-auth/react";

const Login = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80 text-center">
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
            <p className="text-lg font-semibold text-gray-800">
              Please sign in to continue
            </p>
            <button
              onClick={() => signIn("github")}
              className="mt-4 w-full bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.21.66-.47 0-.23-.01-.84-.01-1.65-2.79.61-3.38-1.35-3.38-1.35-.45-1.14-1.11-1.45-1.11-1.45-.91-.62.07-.61.07-.61 1.01.07 1.54 1.03 1.54 1.03.9 1.53 2.36 1.09 2.94.83.09-.66.35-1.09.63-1.34-2.23-.25-4.57-1.11-4.57-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 2.5-.34c.85.004 1.71.114 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.35 4.69-4.59 4.94.36.31.69.92.69 1.85 0 1.33-.01 2.41-.01 2.74 0 .26.16.57.67.47A10.002 10.002 0 0 0 22 12c0-5.52-4.48-10-10-10z"
                  clipRule="evenodd"
                />
              </svg>
              Sign in with GitHub
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
