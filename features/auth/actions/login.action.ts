"use server";

import { api } from "@/lib/axios";
import { AxiosError } from "axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return {
      success: true,
      message: response.data.message,
    };
  } catch (errorResponse) {
    const error = errorResponse as AxiosError;

    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
