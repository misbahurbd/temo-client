"use server";

import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";

export const fetchOverloadedMemberCount = async (): Promise<ApiResponse<number>> => {
  try {
    const response = await api.get("/tasks/overloaded-member-count");
    return {
      success: true,
      ...response.data,
    };
  } catch (error) {
    const errorResponse = error as AxiosError;
    return {
      success: false,
      message: errorResponse.message || "An error occurred",
    };
  }
};
