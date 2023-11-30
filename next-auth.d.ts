import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import { AuthRes, UserRes } from "./common.type";
declare module "next-auth" {
  interface Session {
    user: DefaultSession & {
      id: string;
      email: string;
      avatarUrl: string | null;
      username: string;
      isActive: boolean;
      role: string;
      accessToken: string;
    };
  }
  interface User extends DefaultUser {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
    refreshTokenExpiresAt: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
    refreshTokenExpiresAt: number;
  }
}
