"use server";

import { api } from "@/lib/axios";

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch {
    return null;
  }
};
