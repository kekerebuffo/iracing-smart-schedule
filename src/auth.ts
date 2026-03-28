import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // MOCK AUTHENTICATION for the user's brother and others
        // In a real app, check against a database
        if (credentials?.email === "admin@example.com" && credentials?.password === "admin") {
          return { id: "1", name: "Admin User", email: "admin@example.com" };
        }
        if (credentials?.email === "hermano@example.com" && credentials?.password === "iracing") {
          return { id: "2", name: "Hermano", email: "hermano@example.com" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname === "/";
      const isOnGarage = nextUrl.pathname === "/garage";
      
      if (isOnDashboard || isOnGarage) {
        if (isLoggedIn) return true;
        return false; // Redirect to log in
      }
      return true;
    },
  },
});
