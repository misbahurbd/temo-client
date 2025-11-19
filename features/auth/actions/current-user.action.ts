"use server";

import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";
import { User } from "../types/user.type";

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await api.get("/auth/me");

    return {
      success: true,
      ...response.data,
    };
  } catch (errorResponse) {
    const error = errorResponse as AxiosError;

    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
