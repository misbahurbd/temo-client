"use server";

import { ApiResponse, api } from "@/lib/axios";
import { AxiosError } from "axios";
import { Team } from "../types/team.type";

interface FetchTeamListParams {
  page: number;
  limit: number;
  search?: string;
}

export const fetchTeamList = async (
  query?: FetchTeamListParams
): Promise<ApiResponse<Team[]>> => {
  try {
    const params: Record<string, unknown> = {
      page: query ? Number(query.page) : 1,
      limit: query ? Number(query.limit) : 10,
    };

    if (query?.search) {
      params.search = query.search;
    }

    const response = await api.get("/teams", { params });

    return {
      ...response.data,
      success: true,
    };
  } catch (errorResponse) {
    const error = errorResponse as AxiosError;

    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
