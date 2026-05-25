/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addTournament,
  deleteTournament,
  getAdminTournaments,
  getPlayerTournaments,
  getTournamentRegistrations,
  getTournaments,
  joinTournament,
  leaveTournament,
  updateTournament,
} from "../firebase/services";

export type EntryType = "singles" | "doubles";

export interface CapacityByCategory {
  [category: string]: {
    singlesPlayers?: number;
    doublesPairs?: number;
  };
}

export interface Tournament {
  id: string;
  adminId?: string;
  name: string;
  info: string;
  categories?: string[];
  courts?: string[];
  tournamentType?: string;
  capacityByCategory?: CapacityByCategory;
  status?: "Open" | "Full" | "Closed";
  date?: string;
  time?: string;
  hour?: string;
  tournamentId?: string;
  level?: number;
  image?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface TournamentRegistration {
  id: string;
  playerId: string;
  playerUsername: string;
  tournamentId: string;
  name: string;
  info: string;
  categories?: string[];
  courts?: string[];
  tournamentType?: string;
  entryType: EntryType;
  playerCategory: string;
  hasPartner?: boolean;
  partnerName?: string;
  needsPartner?: boolean;
  joinedAt?: string;
  [key: string]: unknown;
}

interface RegistrationInfo {
  entryType: EntryType;
  playerCategory: string;
  hasPartner?: boolean;
  partnerName?: string;
  needsPartner?: boolean;
}

interface TournamentsContextType {
  tournaments: Tournament[];
  adminTournaments: Tournament[];
  playerTournaments: TournamentRegistration[];
  selectedTournament: Tournament | null;
  registrations: TournamentRegistration[];
  loading: boolean;
  error: string;
  loadTournaments: () => Promise<void>;
  loadAdminTournaments: (adminId: string) => Promise<void>;
  loadPlayerTournaments: (playerId: string) => Promise<void>;
  loadTournamentById: (tournamentId: string) => Promise<Tournament | null>;
  loadTournamentRegistrations: (
    tournamentId: string,
  ) => Promise<TournamentRegistration[]>;
  createTournament: (adminId: string, tournamentData: object) => Promise<void>;
  editTournament: (
    tournamentId: string,
    tournamentData: object,
  ) => Promise<void>;
  removeTournament: (tournamentId: string) => Promise<void>;
  registerInTournament: (
    playerId: string,
    playerUsername: string,
    tournament: Tournament,
    registrationInfo: RegistrationInfo,
  ) => Promise<void>;
  unregisterFromTournament: (playerTournamentId: string) => Promise<void>;
  clearTournamentError: () => void;
}

export const TournamentsContext = createContext<TournamentsContextType>({
  tournaments: [],
  adminTournaments: [],
  playerTournaments: [],
  selectedTournament: null,
  registrations: [],
  loading: false,
  error: "",
  loadTournaments: async () => {},
  loadAdminTournaments: async () => {},
  loadPlayerTournaments: async () => {},
  loadTournamentById: async () => null,
  loadTournamentRegistrations: async () => [],
  createTournament: async () => {},
  editTournament: async () => {},
  removeTournament: async () => {},
  registerInTournament: async () => {},
  unregisterFromTournament: async () => {},
  clearTournamentError: () => {},
});

export function TournamentsProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [adminTournaments, setAdminTournaments] = useState<Tournament[]>([]);
  const [playerTournaments, setPlayerTournaments] = useState<
    TournamentRegistration[]
  >([]);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>(
    [],
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearTournamentError = useCallback(() => {
    setError("");
  }, []);

  const getErrorMessage = useCallback((err: unknown) => {
    if (err instanceof Error) return err.message;

    return "Something went wrong with tournaments.";
  }, []);

  const loadTournaments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = (await getTournaments()) as Tournament[];
      setTournaments(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [getErrorMessage]);

  const loadAdminTournaments = useCallback(
    async (adminId: string) => {
      setLoading(true);
      setError("");

      try {
        const data = (await getAdminTournaments(adminId)) as Tournament[];
        setAdminTournaments(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage],
  );

  const loadPlayerTournaments = useCallback(
    async (playerId: string) => {
      setLoading(true);
      setError("");

      try {
        const data = (await getPlayerTournaments(
          playerId,
        )) as TournamentRegistration[];
        setPlayerTournaments(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage],
  );

  const loadTournamentById = useCallback(
    async (tournamentId: string) => {
      setLoading(true);
      setError("");

      try {
        const data = (await getTournaments()) as Tournament[];
        const tournament =
          data.find((item) => item.id === tournamentId) || null;

        setSelectedTournament(tournament);
        return tournament;
      } catch (err) {
        setError(getErrorMessage(err));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage],
  );

  const loadTournamentRegistrations = useCallback(
    async (tournamentId: string) => {
      setLoading(true);
      setError("");

      try {
        const data = (await getTournamentRegistrations(
          tournamentId,
        )) as TournamentRegistration[];

        setRegistrations(data);
        return data;
      } catch (err) {
        setError(getErrorMessage(err));
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage],
  );

  const createTournament = useCallback(
    async (adminId: string, tournamentData: object) => {
      setLoading(true);
      setError("");

      try {
        await addTournament(adminId, tournamentData);

        const data = (await getAdminTournaments(adminId)) as Tournament[];
        setAdminTournaments(data);
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage],
  );

  const editTournament = useCallback(
    async (tournamentId: string, tournamentData: object) => {
      setLoading(true);
      setError("");

      try {
        await updateTournament(tournamentId, tournamentData);

        setTournaments((currentTournaments) =>
          currentTournaments.map((tournament) =>
            tournament.id === tournamentId
              ? { ...tournament, ...tournamentData }
              : tournament,
          ),
        );

        setAdminTournaments((currentTournaments) =>
          currentTournaments.map((tournament) =>
            tournament.id === tournamentId
              ? { ...tournament, ...tournamentData }
              : tournament,
          ),
        );

        setSelectedTournament((currentTournament) =>
          currentTournament?.id === tournamentId
            ? { ...currentTournament, ...tournamentData }
            : currentTournament,
        );
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage],
  );

  const removeTournament = useCallback(
    async (tournamentId: string) => {
      setLoading(true);
      setError("");

      try {
        await deleteTournament(tournamentId);

        setTournaments((currentTournaments) =>
          currentTournaments.filter(
            (tournament) => tournament.id !== tournamentId,
          ),
        );

        setAdminTournaments((currentTournaments) =>
          currentTournaments.filter(
            (tournament) => tournament.id !== tournamentId,
          ),
        );

        setSelectedTournament((currentTournament) =>
          currentTournament?.id === tournamentId ? null : currentTournament,
        );
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage],
  );

  const registerInTournament = useCallback(
    async (
      playerId: string,
      playerUsername: string,
      tournament: Tournament,
      registrationInfo: RegistrationInfo,
    ) => {
      setLoading(true);
      setError("");

      try {
        await joinTournament(
          playerId,
          playerUsername,
          tournament,
          registrationInfo,
        );

        const [playerData, registrationData] = await Promise.all([
          getPlayerTournaments(playerId),
          getTournamentRegistrations(tournament.id),
        ]);

        setPlayerTournaments(playerData as TournamentRegistration[]);
        setRegistrations(registrationData as TournamentRegistration[]);
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage],
  );

  const unregisterFromTournament = useCallback(
    async (playerTournamentId: string) => {
      setLoading(true);
      setError("");

      try {
        await leaveTournament(playerTournamentId);

        setPlayerTournaments((currentTournaments) =>
          currentTournaments.filter(
            (tournament) => tournament.id !== playerTournamentId,
          ),
        );
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage],
  );

  const value = useMemo(
    () => ({
      tournaments,
      adminTournaments,
      playerTournaments,
      selectedTournament,
      registrations,
      loading,
      error,
      loadTournaments,
      loadAdminTournaments,
      loadPlayerTournaments,
      loadTournamentById,
      loadTournamentRegistrations,
      createTournament,
      editTournament,
      removeTournament,
      registerInTournament,
      unregisterFromTournament,
      clearTournamentError,
    }),
    [
      tournaments,
      adminTournaments,
      playerTournaments,
      selectedTournament,
      registrations,
      loading,
      error,
      loadTournaments,
      loadAdminTournaments,
      loadPlayerTournaments,
      loadTournamentById,
      loadTournamentRegistrations,
      createTournament,
      editTournament,
      removeTournament,
      registerInTournament,
      unregisterFromTournament,
      clearTournamentError,
    ],
  );

  return (
    <TournamentsContext.Provider value={value}>
      {children}
    </TournamentsContext.Provider>
  );
}