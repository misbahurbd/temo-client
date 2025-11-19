"use server";

import { TaskQueryParams } from "@/app/(dashboard)/tasks/page";
import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";
import { Task } from "../types/task.type";

export const fetchTasksList = async (
  query: TaskQueryParams
): Promise<ApiResponse<Task[]>> => {
  try {
    const response = await api.get("/tasks", { params: query });

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
