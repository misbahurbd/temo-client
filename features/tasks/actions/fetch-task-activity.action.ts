"use server";

import { api, ApiResponse } from "@/lib/axios";
import { TaskActivity } from "../types/task.type";
import { AxiosError } from "axios";

export const fetchTaskActivity = async (): Promise<
  ApiResponse<TaskActivity[]>
> => {
  try {
    const response = await api.get("/tasks/activity-log");
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
