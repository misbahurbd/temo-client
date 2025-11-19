"use server";

import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";
import { Task } from "../types/task.type";

export const fetchTaskById = async (
  taskId: string
): Promise<ApiResponse<Task>> => {
  if (!taskId) {
    return {
      success: false,
      message: "Task ID is required",
    };
  }

  try {
    const response = await api.get(`/tasks/${taskId}`);
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
