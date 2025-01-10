"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchUserAndSettings = async () => {
      try {
        // Fetch user data
        const userResponse = await api.get("/me");
        setUser(userResponse?.data);

        // Fetch settings data
        const settingsResponse = await api.get("/settings");
        setSettings(settingsResponse?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserAndSettings();
  }, []);

  return (
    <UserContext.Provider value={{ user, settings }}>
      {children}
    </UserContext.Provider>
  );
}
