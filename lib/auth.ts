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

        await connectDB();

        const normalizedEmail = credentials.email.trim().toLowerCase();
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;

        // If credentials match .env admin, ensure admin is saved in MongoDB and return real DB document
        if (
          adminEmail &&
          adminPassword &&
          normalizedEmail === adminEmail &&
          matchesSecret(credentials.password, adminPassword)
        ) {
          let adminUser = await User.findOne({ email: adminEmail });

          if (!adminUser) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            adminUser = await User.create({
              name: "Administrator",
              email: adminEmail,
              password: hashedPassword,
              role: "admin",
            });
            console.log(`[MongoDB] Created admin user in database: ${adminEmail}`);
          } else if (adminUser.role !== "admin") {
            adminUser.role = "admin";
            await adminUser.save();
          }

          return {
            id: adminUser._id.toString(),
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
          };
        }

        // Standard user login via MongoDB
        const user = await User.findOne({
          email: normalizedEmail,
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