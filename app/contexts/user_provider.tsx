"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../server/get_profile";
import { AppuserProps } from "../types/app_user";
import { signOut } from "next-auth/react";

type ProfileContextType = {
  user: AppuserProps | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  logout: () => void;
};

const ProfileContext = createContext<ProfileContextType>({
  user: null,
  loading: true,
  error: null,
  retry: () => {},
  logout: () => {},
});

const CACHE_KEY = "profile_cache";
const CACHE_DURATION = 40 * 60 * 1000; // 40 mins

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<AppuserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getProfile();

      if (res.success) {
        setUser(res.data);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: res.data,
            timestamp: Date.now(),
          }),
        );
      } else {
        setError(res.error || "Couldn't get your data");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }

    setLoading(false);
  };

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;
        console.log(isExpired, "expired");
        

        if (!isExpired) {
          setUser(parsed.data);
          setLoading(false);
          return;
        }
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    fetchProfile();
  }, []);

  const retry = () => {
    fetchProfile();
  };

  const logout = async () => {
    localStorage.removeItem(CACHE_KEY);
    await signOut();
  };

  return (
    <ProfileContext.Provider value={{ user, loading, error, retry, logout }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
