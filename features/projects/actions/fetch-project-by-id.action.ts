"use server";

import { api, ApiResponse } from "@/lib/axios";
import { Project } from "../types/project.type";
import { AxiosError } from "axios";

export const fetchProjectById = async (
  projectId: string
): Promise<ApiResponse<Project>> => {
  if (!projectId) {
    return {
      success: false,
      message: "Project ID is required",
    };
  }

  try {
    const response = await api.get(`/projects/${projectId}`);

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
