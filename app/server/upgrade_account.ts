"use server";

import { getAuthHeaders } from "../functions/auth_header";
import { AppuserProps } from "../types/app_user";
import { Result } from "../types/general";
import endpoints from "../config/endpoints";

export const uploadKybDoc = async (
  body: string,
): Promise<Result<AppuserProps>> => {
  try {
    const session = await getAuthHeaders();

    if (!session) {
      return { success: false, error: "No session found" };
    }

    const url = endpoints().account["upgrade-account"];

    console.log(body);

    const res = await fetch(url, {
      method: "POST",
      headers: session,
      body: body,
    });

    console.log(res, "at upload");

    if (!res.ok) {
      return { success: false, error: "Failed to upload documents" };
    }

    const response = await res.json();

    return { success: true, data: response?.message || "Request successful" };
  } catch (err) {
    console.error("Something went wrong", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unknown error occurred",
    };
  }
};
