"use server";

import { api, ApiResponse } from "@/lib/axios";
import { AxiosError } from "axios";
import { MemberTask } from "../types/team.type";

export const fetchMemberTask = async (): Promise<ApiResponse<MemberTask[]>> => {
  try {
    const response = await api.get("/teams/members");
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
