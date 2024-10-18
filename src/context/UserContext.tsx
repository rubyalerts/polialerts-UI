"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/types";
import { useAuthState } from "react-firebase-hooks/auth";
import { useUser } from "@/hooks/useUser";
import { auth } from "@/app/firebase/config";

interface UserContextType {
  userDetails: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: (userId: string) => Promise<User | undefined>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useAuthState(auth);
  const { userDetails, loading, error, fetchUser } = useUser();

  useEffect(() => {
    if (user) {
      fetchUser(user.uid);
    }
  }, [user]);


  return (
    <UserContext.Provider value={{ userDetails, loading, error, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};