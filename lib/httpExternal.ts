import axios, { AxiosError, AxiosInstance } from "axios";
import https from "https";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:4000/api";

export const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

const agent = new https.Agent({
  rejectUnauthorized: false,
});
class HttpExternal {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: SERVER_URL,
      withCredentials: true,
      timeout: 10000,
      headers: {
        Accept: "application/json",
      },
      httpsAgent: agent,
    });
    this.instance.interceptors.request.use(async (config) => {
      const session = await getServerSession(authOptions);
      if (session && session.user)
        config.headers.Authorization = `Bearer ${session?.user.accessToken}`;
      return config;
    });
  }
}

export const httpExternal = new HttpExternal().instance;
