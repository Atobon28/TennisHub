/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { getUserByUid } from "../firebase/services";

export interface CoachScheduleDay {
  enabled: boolean;
  start: string;
  end: string;
}

export interface UserData {
  id: string;
  uid: string;
  email: string;
  username: string;
  role: string;
  level?: number | null;
  category?: string;
  pricePerHour?: string;
  availableDays?: string[];
  availableSchedule?: Record<string, CoachScheduleDay>;
  phone?: string;
  photoURL?: string;
  description?: string;
  specialty?: string;
}

export interface AuthContextType {
  userData: UserData | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  userData: null,
  loading: true,
  refreshUserData: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  const refreshUserData = async () => {
    if (!currentUid) return;

    try {
      const data = (await getUserByUid(currentUid)) as UserData | null;

      if (data) {
        setUserData(data);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUid(user.uid);

        try {
          const data = (await getUserByUid(user.uid)) as UserData | null;

          if (data) {
            setUserData(data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
        setCurrentUid(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ userData, loading, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}