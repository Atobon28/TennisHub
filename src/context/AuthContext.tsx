import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { getUserByUid } from "../firebase/services";

interface UserData {
  id: string;
  uid: string;
  email: string;
  username: string;
  role: string;
  level?: number;
  pricePerHour?: string;
  availableDays?: string[];
}

interface AuthContextType {
  userData: UserData | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
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
      const data = (await getUserByUid(currentUid)) as any;
      if (data) setUserData(data);
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUid(user.uid);
        try {
          const data = (await getUserByUid(user.uid)) as any;
          if (data) setUserData(data);
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

export const useAuth = () => useContext(AuthContext);
