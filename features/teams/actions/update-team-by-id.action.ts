"use server";

import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";
import { UpdateTeamFormData } from "../components/form/update-team-form";
import { Team } from "../types/team.type";

export const updateTeamById = async (
  teamId: string,
  team: UpdateTeamFormData
): Promise<ApiResponse<Team>> => {
  if (!teamId) {
    return {
      success: false,
      message: "Team ID is required",
    };
  }

  try {
    const response = await api.put(`/teams/${teamId}`, team);

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
