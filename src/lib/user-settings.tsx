import React, { createContext, useContext, useState, useEffect } from "react";

export type Citizenship = "india" | "usa" | "uk" | "germany";

interface UserSettings {
  citizenship: Citizenship;
  setCitizenship: (c: Citizenship) => void;
}

const UserSettingsContext = createContext<UserSettings | undefined>(undefined);

export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
  const [citizenship, setCitizenship] = useState<Citizenship>(() => {
    const saved = localStorage.getItem("ta-user-citizenship");
    return (saved as Citizenship) || "india";
  });

  useEffect(() => {
    localStorage.setItem("ta-user-citizenship", citizenship);
  }, [citizenship]);

  return (
    <UserSettingsContext.Provider value={{ citizenship, setCitizenship }}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (!context) throw new Error("useUserSettings must be used within UserSettingsProvider");
  return context;
}
