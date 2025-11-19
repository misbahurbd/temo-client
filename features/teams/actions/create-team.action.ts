"use server";

import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { CreateTeamFormData } from "../components/form/create-team-form";

export const createTeam = async (team: CreateTeamFormData) => {
  try {
    const response = await api.post("/teams", team);
    return {
      success: true,
      message: response.data.message,
    };
  } catch (errorResponse) {
    const error = errorResponse as AxiosError;
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
