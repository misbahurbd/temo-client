"use server";

import { api, ApiResponse } from "@/lib/axios";
import { MemberSelectList } from "../types/team.type";
import { AxiosError } from "axios";

export const fetchMemberSelectList = async (): Promise<
  ApiResponse<MemberSelectList[]>
> => {
  try {
    const response = await api.get("/teams/members/select-list");

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
