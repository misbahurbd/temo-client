"use server";

import { api, ApiResponse } from "@/lib/axios";
import { Project } from "../types/project.type";
import { AxiosError } from "axios";
import { Task } from "@/features/tasks/types/task.type";

export const fetchProjectWithTask = async (
  projectId: string | null,
  query?: { [key: string]: string | string[] | undefined }
): Promise<ApiResponse<Project & { tasks: Task[] }>> => {
  if (!projectId) {
    return {
      success: false,
      message: "Project ID is required",
    };
  }

  try {
    const response = await api.get(`/projects/${projectId}/tasks`, {
      params: query,
    });

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
