import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";

export const fetchTeamSelectList = async (): Promise<
  ApiResponse<{ id: string; name: string; membersCount: number }[]>
> => {
  try {
    const response = await api.get("/teams/select-list");
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
