import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    username: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!process.env.ADMIN_PASS || !process.env.ADMIN_USER)
          throw new Error("Environment variable not specified");

        const username = credentials.username as string; // messy, but works
        const password = credentials.password as string;

        if (!username || !password) return null;

        const result = await bcrypt.compare(password, process.env.ADMIN_PASS);

        if (!result || username !== process.env.ADMIN_USER) return null;

        console.log("auth:", { username });

        return { username }; // return empty object because the data doesn't matter and it only needs to return anything that matches the User interface
      },
    }),
  ],
  pages: {
    signIn: "/admin-maharajamart/login",
  },
});
