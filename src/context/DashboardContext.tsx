/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useState, type ReactNode } from "react";
import {
  getAdminCourts,
  getAdminTournaments,
  getMatches,
  getTournamentRegistrations,
} from "../firebase/services";
import type { Court } from "./CourtsContext";
import type { Match } from "./MatchesContext";
import type { Tournament, TournamentRegistration } from "./TournamentsContext";

interface DashboardContextType {
  tournaments: Tournament[];
  courts: Court[];
  matches: Match[];
  registrations: TournamentRegistration[];
  loading: boolean;
  error: string;
  loadAdminDashboard: (adminId: string) => Promise<void>;
  clearDashboardError: () => void;
}

export const DashboardContext = createContext<DashboardContextType>({
  tournaments: [],
  courts: [],
  matches: [],
  registrations: [],
  loading: false,
  error: "",
  loadAdminDashboard: async () => {},
  clearDashboardError: () => {},
});

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>(
    [],
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearDashboardError = useCallback(() => {
    setError("");
  }, []);

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;

    return "Something went wrong while loading dashboard data.";
  };

  const loadAdminDashboard = useCallback(async (adminId: string) => {
    setLoading(true);
    setError("");

    try {
      const [tournamentsData, courtsData, matchesData] = await Promise.all([
        getAdminTournaments(adminId),
        getAdminCourts(adminId),
        getMatches(),
      ]);

      const adminTournaments = tournamentsData as Tournament[];
      const adminCourts = courtsData as Court[];
      const allMatches = matchesData as Match[];

      const adminCourtNames = adminCourts
        .map((court) => court.name)
        .filter((courtName): courtName is string => Boolean(courtName));

      const adminMatches = allMatches.filter((match) => {
        if (typeof match.court !== "string") return false;

        return adminCourtNames.includes(match.court);
      });

      const registrationsByTournament = await Promise.all(
        adminTournaments.map(async (tournament) => {
          const tournamentRegistrations = (await getTournamentRegistrations(
            tournament.id,
          )) as unknown as TournamentRegistration[];

          return tournamentRegistrations.map((registration) => ({
            ...registration,
            tournamentId: registration.tournamentId || tournament.id,
          }));
        }),
      );

      setTournaments(adminTournaments);
      setCourts(adminCourts);
      setMatches(adminMatches);
      setRegistrations(registrationsByTournament.flat());
    } catch (err) {
      console.error("Error loading admin dashboard:", err);
      setError(getErrorMessage(err));

      setTournaments([]);
      setCourts([]);
      setMatches([]);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        tournaments,
        courts,
        matches,
        registrations,
        loading,
        error,
        loadAdminDashboard,
        clearDashboardError,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
