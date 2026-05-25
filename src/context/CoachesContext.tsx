/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useState, type ReactNode } from "react";
import { getCoaches, updateUser } from "../firebase/services";

export interface CoachScheduleDay {
  enabled: boolean;
  start: string;
  end: string;
}

export interface Coach {
  id: string;
  uid?: string;
  email?: string;
  username?: string;
  role?: string;
  pricePerHour?: string;
  availableDays?: string[];
  availableSchedule?: Record<string, CoachScheduleDay>;
  phone?: string;
  description?: string;
  specialty?: string;
  photoURL?: string;
  [key: string]: unknown;
}

interface CoachesContextType {
  coaches: Coach[];
  selectedCoach: Coach | null;
  loading: boolean;
  error: string;
  loadCoaches: () => Promise<void>;
  loadCoachById: (coachId: string) => Promise<Coach | null>;
  editCoachProfile: (coachId: string, coachData: object) => Promise<void>;
  clearCoachError: () => void;
}

export const CoachesContext = createContext<CoachesContextType>({
  coaches: [],
  selectedCoach: null,
  loading: false,
  error: "",
  loadCoaches: async () => {},
  loadCoachById: async () => null,
  editCoachProfile: async () => {},
  clearCoachError: () => {},
});

export function CoachesProvider({ children }: { children: ReactNode }) {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearCoachError = useCallback(() => {
    setError("");
  }, []);

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    return "Something went wrong with coaches.";
  };

  const loadCoaches = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = (await getCoaches()) as Coach[];
      setCoaches(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCoachById = useCallback(async (coachId: string) => {
    setLoading(true);
    setError("");

    try {
      const data = (await getCoaches()) as Coach[];
      const coach =
        data.find((item) => item.id === coachId || item.uid === coachId) ||
        null;

      setSelectedCoach(coach);
      return coach;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const editCoachProfile = useCallback(
    async (coachId: string, coachData: object) => {
      setLoading(true);
      setError("");

      try {
        await updateUser(coachId, coachData);

        setCoaches((currentCoaches) =>
          currentCoaches.map((coach) =>
            coach.id === coachId ? { ...coach, ...coachData } : coach,
          ),
        );

        setSelectedCoach((currentCoach) =>
          currentCoach?.id === coachId
            ? { ...currentCoach, ...coachData }
            : currentCoach,
        );
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return (
    <CoachesContext.Provider
      value={{
        coaches,
        selectedCoach,
        loading,
        error,
        loadCoaches,
        loadCoachById,
        editCoachProfile,
        clearCoachError,
      }}
    >
      {children}
    </CoachesContext.Provider>
  );
}
