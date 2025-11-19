"use server";

import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";

export const deleteTask = async (
  taskId: string
): Promise<ApiResponse<void>> => {
  if (!taskId) {
    return {
      success: false,
      message: "Task ID is required",
    };
  }

  try {
    const response = await api.delete(`/tasks/${taskId}`);
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
