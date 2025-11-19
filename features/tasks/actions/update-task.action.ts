"use server";

import { api, ApiResponse } from "@/lib/axios";
import { Task } from "../types/task.type";
import { AxiosError } from "axios";
import { UpdateTaskFormData } from "../components/form/update-task-form";

export const updateTask = async (
  taskId: string,
  data: Omit<UpdateTaskFormData, "serverError" | "projectId">
): Promise<ApiResponse<Task>> => {
  if (!taskId) {
    return {
      success: false,
      message: "Task ID is required",
    };
  }

  try {
    const response = await api.put(`/tasks/${taskId}`, data);
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
