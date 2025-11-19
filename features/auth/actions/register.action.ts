"use server";

import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.post("/auth/register", {
      firstName,
      lastName,
      email,
      password,
    });

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
