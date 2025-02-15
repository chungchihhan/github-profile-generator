import { DefaultSession, NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";

// Extend the built-in session type to include accessToken
interface ExtendedSession extends DefaultSession {
  accessToken?: string;
  error?: string;
}

// Extend the built-in JWT type to include accessToken
interface ExtendedToken extends JWT {
  accessToken?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "repo",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token as ExtendedToken;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: ExtendedToken;
    }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      if (!session.accessToken) {
        session.error = "Session expired, please log in again";
      }
      return session;
    },
  },
};
