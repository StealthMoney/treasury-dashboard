import { AppuserProps } from "@/app/types/app_user";
import { NavLink } from "@/app/types/general";

export const filterLinks = (user: AppuserProps | null, links: NavLink[]) => {
  if (!user) return [];

  return links.filter((link) => user.profileMenu.includes(link.text));
};
