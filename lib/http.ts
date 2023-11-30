import axios, { AxiosInstance } from "axios";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000/api";

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: CLIENT_URL,
      timeout: 10000,
      headers: {
        Accept: "application/json",
      },
    });
  }
}

export const http = new Http().instance;
