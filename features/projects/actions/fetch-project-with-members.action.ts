"use server";

import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";
import { ProjectWithMembers } from "../types/project.type";

export const fetchProjectWithMembers = async (): Promise<
  ApiResponse<ProjectWithMembers[]>
> => {
  try {
    const response = await api.get(`/projects/list-with-members`);
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
