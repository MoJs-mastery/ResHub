import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

function matchesSecret(candidate: string, expected: string) {
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);

  return (
    candidateBuffer.length === expectedBuffer.length &&
    timingSafeEqual(candidateBuffer, expectedBuffer)
  );
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          adminEmail &&
          adminPassword &&
          credentials.email.trim().toLowerCase() === adminEmail &&
          matchesSecret(credentials.password, adminPassword)
        ) {
          return {
            id: `env-admin:${adminEmail}`,
            name: "Administrator",
            email: adminEmail,
            role: "admin",
          };
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }
        const passwordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!passwordCorrect) {
          throw new Error("Invalid email or password");
        }
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "admin";
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};