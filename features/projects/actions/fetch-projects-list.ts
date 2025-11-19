"use server";

import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";
import { Project } from "../types/project.type";

interface FetchProjectsListParams {
  page: number;
  limit: number;
  search?: string;
}

export const fetchProjectsList = async (
  query?: FetchProjectsListParams
): Promise<ApiResponse<Project[]>> => {
  try {
    const params: Record<string, unknown> = {
      page: query ? Number(query.page) : 1,
      limit: query ? Number(query.limit) : 10,
    };

    if (query?.search) {
      params.search = query.search;
    }

    const response = await api.get("/projects", { params });
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
