import { AppuserProps } from "@/app/types/app_user";

export const returnUserInitials = (user: AppuserProps) => {
  if (!user) return "";

  const first = user.firstName?.[0] || "";
  const last = user.lastName?.[0] || "";

  return (first + last).toUpperCase();
};
