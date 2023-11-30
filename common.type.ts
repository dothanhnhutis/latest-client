import { z } from "zod";
import { roleZod } from "./constants/schema";
export type Token = {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
};

export type CurrentUserRes = {
  id: string;
  email: string;
  avatarUrl: string | null;
  username: string;
  isActive: boolean;
  role: string;
};

export type LogInRes = Token & CurrentUserRes;

export type UserRes = CurrentUserRes & {
  bio: string;
  phone: string;
  address: string;
};

export type ImageRes = {
  id: string;
  public_id: string;
  width: number;
  height: number;
  tags: string[];
  url: string;
  userId: string;
  createAt: string;
};

export type Role = z.infer<typeof roleZod>;

export type TagRes = {
  id: string;
  tagName: string;
  slug: string;
  _count: {
    post: number;
  };
};

export type BlogRes = {
  id: string;
  title: string;
  thumnail: string;
  slug: string;
  content: string;
  tagId: string;
  authorId: string;
  author: {
    username: string;
    avatarUrl: string | null;
  };
  tag: {
    slug: string;
    tagName: string;
  };
};
