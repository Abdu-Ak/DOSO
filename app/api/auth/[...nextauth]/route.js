import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        // Search by email or userId
        const user = await User.findOne({
          $or: [
            { email: credentials.username.toLowerCase() },
            { userId: credentials.username },
          ],
        }).select("+password");

        if (!user) {
          throw new Error("No user found with this email/userId");
        }

        if (user.status !== "Active") {
          throw new Error(
            `Access Denied: Your account is currently ${user.status}. Please contact an administrator.`,
          );
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          permissions: user.permissions,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
        token.permissions = user.permissions;
      }
      // Handle session update
      if (trigger === "update" && session?.image) {
        token.image = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user._id = token.id;
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.permissions = token.permissions;

        // Re-verify user existence and status
        try {
          await dbConnect();
          const dbUser = await User.findById(token.id).select("status permissions");
          if (!dbUser) {
            session.error = "ACCOUNT_DELETED";
          } else if (dbUser.status !== "Active") {
            session.error = "ACCOUNT_DEACTIVATED";
          } else {
            session.user.permissions = dbUser.permissions;
          }
        } catch (error) {
          console.error("Session verification error:", error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
