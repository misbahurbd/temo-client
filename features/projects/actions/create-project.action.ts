"use server";

import { api, ApiResponse } from "@/lib/axios";
import { CreateProjectFormData } from "../components/form/create-project-form";
import { Project } from "../types/project.type";
import { AxiosError } from "axios";

export const createProject = async (
  project: CreateProjectFormData
): Promise<ApiResponse<Project>> => {
  try {
    const response = await api.post("/projects", project);
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
