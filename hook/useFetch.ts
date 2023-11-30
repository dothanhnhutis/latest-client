"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { http } from "@/lib/http";

interface UseFetchResponse {
  fetchData: <T>(endpoint: string) => Promise<T | undefined>;
  error?: string;
}

export function useFetch(): UseFetchResponse {
  const [error, setError] = useState<string | undefined>(undefined);

  async function fetchData<T>(endpoint: string): Promise<T | undefined> {
    try {
      const response = await http.get<T>(endpoint);

      const { data } = response;

      return data;
    } catch (error: any | AxiosError) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        if (error.response?.status === 401) {
          setError(error.response.data.message);

          return undefined;
        }
      }

      setError("Something went wrong");

      return undefined;
    }
  }

  return {
    error,
    fetchData,
  };
}
