// types/result.ts
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type NavLink = {
  text: string;
  href: string;
  logo: React.ReactNode;
};
