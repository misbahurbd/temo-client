"use server";

import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";

export const deleteTeam = async (
  teamId: string
): Promise<ApiResponse<void>> => {
  if (!teamId) {
    return {
      success: false,
      message: "Team ID is required",
    };
  }

  try {
    const response = await api.delete(`/teams/${teamId}`);

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
