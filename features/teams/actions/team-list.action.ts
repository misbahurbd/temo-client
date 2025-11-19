"use server";

import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { Team } from "../types/team.type";

export const getTeamListWithPagination = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  try {
    const params: Record<string, unknown> = {
      page,
      limit,
    };

    if (search) {
      params.search = search;
    }

    const response = await api.get<{
      data: Team[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>("/teams", { params });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (errorResponse) {
    const error = errorResponse as AxiosError;
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
