"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  cityName?: string;
  stateName?: string;
  countryName?: string;
  address?: string;
  hp?: string;
  timezone?: string;
  [key: string]: any;
}

interface AuthContextType {
  userId: string | null;
  user: UserProfile | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData?: Partial<UserProfile>) => void;
  logout: () => void;
  refreshProfile?: (force?: boolean) => void;
  updateUser?: (userData: Partial<UserProfile>) => void;
}

const defaultMockUser: UserProfile = {
  id: "fatkul",
  name: "Fatkul",
  username: "fatkul",
  email: "fatkul@example.com",
  avatar: "/img/fatkul.jpg",
  role: "santri",
  cityName: "Malang",
  stateName: "Jawa Timur",
  countryName: "Indonesia",
  city: "Malang",
  states: "Jawa Timur",
  country: "Indonesia",
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  refreshProfile: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("qurani_user");
      let studentProfile: any = null;
      try {
        const sp = localStorage.getItem("qurani_student_profile");
        if (sp) studentProfile = JSON.parse(sp);
      } catch {}

      if (stored) {
        const parsed = JSON.parse(stored);
        const merged: UserProfile = {
          ...parsed,
          cityName: parsed.cityName || studentProfile?.city || "Malang",
          stateName: parsed.stateName || studentProfile?.states || "Jawa Timur",
          countryName: parsed.countryName || studentProfile?.country || "Indonesia",
          city: parsed.city || studentProfile?.city || "Malang",
          states: parsed.states || studentProfile?.states || "Jawa Timur",
          country: parsed.country || studentProfile?.country || "Indonesia",
        };
        setUser(merged);
        setIsAuthenticated(true);
      } else {
        const merged: UserProfile = {
          ...defaultMockUser,
          cityName: studentProfile?.city || defaultMockUser.cityName,
          stateName: studentProfile?.states || defaultMockUser.stateName,
          countryName: studentProfile?.country || defaultMockUser.countryName,
          city: studentProfile?.city || defaultMockUser.city,
          states: studentProfile?.states || defaultMockUser.states,
          country: studentProfile?.country || defaultMockUser.country,
        };
        setUser(merged);
        setIsAuthenticated(true);
      }
    } catch {
      setUser(defaultMockUser);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData?: Partial<UserProfile>) => {
    const finalUser: UserProfile = {
      ...defaultMockUser,
      ...userData,
    };
    try {
      localStorage.setItem("qurani_user", JSON.stringify(finalUser));
    } catch {}
    setUser(finalUser);
    setIsAuthenticated(true);
  };

  const updateUser = (userData: Partial<UserProfile>) => {
    setUser((prev) => {
      const nextUser = { ...(prev || defaultMockUser), ...userData };
      try {
        localStorage.setItem("qurani_user", JSON.stringify(nextUser));
      } catch {}
      return nextUser;
    });
  };

  const logout = () => {
    try {
      localStorage.removeItem("qurani_user");
    } catch {}
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        userId: user?.id || null,
        user,
        profile: user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshProfile: () => {},
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
