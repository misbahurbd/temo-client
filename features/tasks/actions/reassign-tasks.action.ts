"use server";

import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";

export const reassignTasks = async (
  projectId: string
): Promise<ApiResponse<void>> => {
  if (!projectId) {
    return {
      success: false,
      message: "Project ID is required",
    };
  }

  try {
    const response = await api.post(`/tasks/reassign/${projectId}`);
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
