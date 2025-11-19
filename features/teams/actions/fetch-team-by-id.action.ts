"use server";

import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";
import { Team } from "../types/team.type";

export const fetchTeamById = async (
  teamId: string
): Promise<ApiResponse<Team>> => {
  if (!teamId) {
    return {
      success: false,
      message: "Team ID is required",
    };
  }

  try {
    const response = await api.get<{
      message: string;
      data: Team;
    }>(`/teams/${teamId}`);

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
