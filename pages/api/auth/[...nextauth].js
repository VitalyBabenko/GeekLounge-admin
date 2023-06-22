import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

const adminsEmails = ["babenko.vitaly12@gmail.com"];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) => {
      const isAdmin = adminsEmails.includes(session?.user?.email);
      if (isAdmin) return session;
      return false;
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = getServerSession(req, res, authOptions);

  if (adminsEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw "not an  admin";
  }
  return false;
}
