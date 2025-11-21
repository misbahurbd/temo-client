"use server";

import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";

export const reassignProjectTasks = async (
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

export const reassignTasks = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await api.post(`/tasks/reassign-all`);
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
