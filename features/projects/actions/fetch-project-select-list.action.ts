"use server";

import { api, ApiResponse } from "@/lib/axios";
import { ProjectSelectList } from "../types/project.type";
import { AxiosError } from "axios";

export const fetchProjectSelectList = async (): Promise<
  ApiResponse<ProjectSelectList[]>
> => {
  try {
    const response = await api.get("/projects/select-list");

    return {
      success: true,
      ...response.data,
    };
  } catch (errorResponse) {
    const error = errorResponse as AxiosError;
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
