"use server";

import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";
import { TaskActivity } from "../types/task.type";

export interface TaskActivityQueryParams {
  page?: string;
  limit?: string;
  search?: string;
}

export const fetchTaskActivities = async ({
  query,
}: {
  query: TaskActivityQueryParams;
}): Promise<ApiResponse<TaskActivity[]>> => {
  try {
    const response = await api.get("/tasks/activities", { params: query });
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
