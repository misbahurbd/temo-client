"use server";

import { ApiResponse, api } from "@/lib/axios";
import { AxiosError } from "axios";

export type TeamSelectList = {
  id: string;
  name: string;
  membersCount: number;
};

export const fetchTeamSelectList = async (): Promise<
  ApiResponse<TeamSelectList[]>
> => {
  try {
    const response = await api.get("/teams/select-list");

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
