"use server";
import endpoints from "../config/endpoints";

export const activate = async (key: string) => {
  try {
    const url = endpoints(key).user.activate;
    const res = await fetch(`${url}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    console.log(res, "is res");

    if (!res.ok) {
      throw new Error("Activation failed!");
    }
    return {
      status: 200,
      message: "Activation successful!",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Activation failed!";
    const errorInfo = {
      status: 500,
      message,
    };
    return errorInfo;
  }
};
