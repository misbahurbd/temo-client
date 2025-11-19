"use server";

import { api, ApiResponse } from "@/lib/axios";
import { CreateTaskFormData } from "../components/form/create-task-form";
import { Task } from "../types/task.type";
import { AxiosError } from "axios";

export const createTask = async (
  data: CreateTaskFormData
): Promise<ApiResponse<Task>> => {
  try {
    const response = await api.post("/tasks", data);

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
