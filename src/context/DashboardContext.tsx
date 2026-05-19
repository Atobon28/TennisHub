import { createContext, useState, type ReactNode } from "react";
import {
  getAdminCourts,
  getAdminTournaments,
  getMatches,
  getTournamentRegistrations,
} from "../firebase/services";
import type { Court } from "./CourtsContext";
import type { Match } from "./MatchesContext";
import type {
  Tournament,
  TournamentRegistration,
} from "./TournamentsContext";

interface DashboardStats {
  totalCourts: number;
  totalTournaments: number;
  activeMatches: number;
  fullTournaments: number;
  playersLookingForPartner: number;
}

interface DashboardContextType {
  stats: DashboardStats;
  latestTournaments: Tournament[];
  latestMatches: Match[];
  loading: boolean;
  error: string;
  loadAdminDashboard: (adminId: string) => Promise<void>;
  clearDashboardError: () => void;
}

const initialStats: DashboardStats = {
  totalCourts: 0,
  totalTournaments: 0,
  activeMatches: 0,
  fullTournaments: 0,
  playersLookingForPartner: 0,
};

export const DashboardContext = createContext<DashboardContextType>({
  stats: initialStats,
  latestTournaments: [],
  latestMatches: [],
  loading: false,
  error: "",
  loadAdminDashboard: async () => {},
  clearDashboardError: () => {},
});

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [latestTournaments, setLatestTournaments] = useState<Tournament[]>([]);
  const [latestMatches, setLatestMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearDashboardError = () => {
    setError("");
  };

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    return "Something went wrong with the dashboard.";
  };

  const isTournamentFull = async (tournament: Tournament) => {
    if (tournament.status === "Full") return true;
    if (tournament.status === "Closed") return false;

    if (!tournament.capacityByCategory) return false;

    const registrations = (await getTournamentRegistrations(
      tournament.id,
    )) as TournamentRegistration[];

    const categories = Object.keys(tournament.capacityByCategory);

    for (const category of categories) {
      const capacityInfo = tournament.capacityByCategory[category];

      const singlesCapacity = capacityInfo.singlesPlayers || 0;
      const doublesCapacity = capacityInfo.doublesPairs || 0;

      const singlesUsed = registrations.filter(
        (registration) =>
          registration.playerCategory === category &&
          registration.entryType === "singles",
      ).length;

      const doublesUsed = registrations.filter(
        (registration) =>
          registration.playerCategory === category &&
          registration.entryType === "doubles",
      ).length;

      const hasSinglesSpots =
        singlesCapacity > 0 && singlesUsed < singlesCapacity;

      const hasDoublesSpots =
        doublesCapacity > 0 && doublesUsed < doublesCapacity;

      if (hasSinglesSpots || hasDoublesSpots) {
        return false;
      }
    }

    return true;
  };

  const countPlayersLookingForPartner = async (tournaments: Tournament[]) => {
    let total = 0;

    for (const tournament of tournaments) {
      const registrations = (await getTournamentRegistrations(
        tournament.id,
      )) as TournamentRegistration[];

      const lookingForPartner = registrations.filter(
        (registration) => registration.needsPartner,
      );

      total += lookingForPartner.length;
    }

    return total;
  };

  const loadAdminDashboard = async (adminId: string) => {
    setLoading(true);
    setError("");

    try {
      const courts = (await getAdminCourts(adminId)) as Court[];
      const tournaments = (await getAdminTournaments(
        adminId,
      )) as Tournament[];
      const matches = (await getMatches()) as Match[];

      const activeMatches = matches.filter(
        (match) => match.status !== "Cancelled",
      );

      const fullTournamentChecks = await Promise.all(
        tournaments.map((tournament) => isTournamentFull(tournament)),
      );

      const fullTournaments = fullTournamentChecks.filter(Boolean).length;

      const playersLookingForPartner =
        await countPlayersLookingForPartner(tournaments);

      setStats({
        totalCourts: courts.length,
        totalTournaments: tournaments.length,
        activeMatches: activeMatches.length,
        fullTournaments,
        playersLookingForPartner,
      });

      setLatestTournaments(tournaments.slice(0, 5));
      setLatestMatches(activeMatches.slice(0, 5));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        stats,
        latestTournaments,
        latestMatches,
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