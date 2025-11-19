"use server";

import { api, ApiResponse } from "@/lib/axios";
import { UpdateProjectFormData } from "../components/form/update-project-form";
import { Project } from "../types/project.type";
import { AxiosError } from "axios";

export const updateProject = async (
  projectId: string,
  project: UpdateProjectFormData
): Promise<ApiResponse<Project>> => {
  if (!projectId) {
    return {
      success: false,
      message: "Project ID is required",
    };
  }

  try {
    const response = await api.put(`/projects/${projectId}`, project);
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
