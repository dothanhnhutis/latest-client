import CredentialsProvider from "next-auth/providers/credentials";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import { NextAuthOptions, getServerSession } from "next-auth";
import { CurrentUserRes, LogInRes, Token } from "@/common.type";
import { httpExternal } from "./httpExternal";
// credentials
// signIn
// jwt
// encode

// decode
// jwt
// session
// encode

async function refreshToken(token: Token) {
  try {
    const { data } = await httpExternal.get<{
      accessToken: string;
      accessTokenExpiresAt: number;
    }>("/auth/refresh", {
      headers: {
        "x-refresh-token": token.refreshToken,
      },
    });
    return { ...token, ...data };
  } catch (error: any) {
    throw Error("refresh token error");
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          const { data } = await httpExternal.post<LogInRes>("/auth/signin", {
            email,
            password,
          });

          return data;
        } catch (error: any) {
          return null;
        }
      },
    }),
  ],
  jwt: {
    encode: ({ secret, token }) => {
      const encodedToken = jsonwebtoken.sign(
        {
          ...token,
          exp: token?.refreshTokenExpiresAt,
        },
        secret
      );
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret);
      return decodedToken as JWT;
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.accessTokenExpiresAt = user.accessTokenExpiresAt;
        token.refreshToken = user.refreshToken;
        token.refreshTokenExpiresAt = user.refreshTokenExpiresAt;
      }

      if (Date.now() < token.accessTokenExpiresAt * 1000) {
        return token;
      }
      return await refreshToken(token);
    },
    async session({ session, token, user }) {
      session.user.accessToken = token.accessToken;
      if (session.user.accessToken) {
        const { data } = await httpExternal.get<CurrentUserRes>("/users/me", {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });
        session.user.id = data.id;
        session.user.email = data.email;
        session.user.isActive = data.isActive;
        session.user.role = data.role;
        session.user.avatarUrl = data.avatarUrl;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
export async function getServerAuthSession() {
  const session = await getServerSession(authOptions);
  console.log(session);
  return session;
}
