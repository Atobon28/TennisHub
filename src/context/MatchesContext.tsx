/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createMatch,
  deleteMatch,
  getMatches,
  getPlayerMatches,
  joinMatch,
  leaveMatch,
} from "../firebase/services";

export interface MatchPlayer {
  uid: string;
  username: string;
}

export interface Match {
  id: string;
  hostId?: string;
  hostName?: string;
  hostUsername?: string;
  type?: "Singles" | "Doubles" | string;
  matchType?: "singles" | "doubles" | string;
  date?: string;
  time?: string;
  court?: string;
  courtName?: string;
  status?: "Open" | "Full" | "Cancelled" | string;
  players?: MatchPlayer[];
  playerIds?: string[];
  maxPlayers?: number;
  [key: string]: unknown;
}

interface MatchesContextType {
  matches: Match[];
  playerMatches: Match[];
  selectedMatch: Match | null;
  loading: boolean;
  error: string;
  loadMatches: () => Promise<void>;
  loadPlayerMatches: (playerId: string) => Promise<void>;
  loadMatchById: (matchId: string) => Promise<Match | null>;
  addNewMatch: (matchData: object) => Promise<void>;
  joinExistingMatch: (
    matchId: string,
    playerId: string,
    playerUsername: string
  ) => Promise<void>;
  leaveExistingMatch: (
    matchId: string,
    playerId: string,
    playerUsername: string
  ) => Promise<void>;
  removeMatch: (matchId: string) => Promise<void>;
  clearMatchError: () => void;
}

export const MatchesContext = createContext<MatchesContextType>({
  matches: [],
  playerMatches: [],
  selectedMatch: null,
  loading: false,
  error: "",
  loadMatches: async () => {},
  loadPlayerMatches: async () => {},
  loadMatchById: async () => null,
  addNewMatch: async () => {},
  joinExistingMatch: async () => {},
  leaveExistingMatch: async () => {},
  removeMatch: async () => {},
  clearMatchError: () => {},
});

export function MatchesProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [playerMatches, setPlayerMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearMatchError = useCallback(() => {
    setError("");
  }, []);

  const getErrorMessage = useCallback((err: unknown) => {
    if (err instanceof Error) return err.message;

    return "Something went wrong with matches.";
  }, []);

  const loadMatches = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = (await getMatches()) as Match[];
      setMatches(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [getErrorMessage]);

  const loadPlayerMatches = useCallback(
    async (playerId: string) => {
      setLoading(true);
      setError("");

      try {
        const data = (await getPlayerMatches(playerId)) as Match[];
        setPlayerMatches(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage],
  );

  const loadMatchById = useCallback(
    async (matchId: string) => {
      setLoading(true);
      setError("");

      try {
        const data = (await getMatches()) as Match[];
        const match = data.find((item) => item.id === matchId) || null;

        setSelectedMatch(match);
        return match;
      } catch (err) {
        setError(getErrorMessage(err));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage],
  );

  const addNewMatch = useCallback(
    async (matchData: object) => {
      setLoading(true);
      setError("");

      try {
        await createMatch(matchData);

        const data = (await getMatches()) as Match[];
        setMatches(data);
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage],
  );

  const joinExistingMatch = useCallback(
    async (matchId: string, playerId: string, playerUsername: string) => {
      setLoading(true);
      setError("");

      try {
        await joinMatch(matchId, playerId, playerUsername);

        const [matchesData, playerMatchesData] = await Promise.all([
          getMatches(),
          getPlayerMatches(playerId),
        ]);

        setMatches(matchesData as Match[]);
        setPlayerMatches(playerMatchesData as Match[]);
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage],
  );

  const leaveExistingMatch = useCallback(
    async (matchId: string, playerId: string, playerUsername: string) => {
      setLoading(true);
      setError("");

      try {
        await leaveMatch(matchId, playerId, playerUsername);

        const [matchesData, playerMatchesData] = await Promise.all([
          getMatches(),
          getPlayerMatches(playerId),
        ]);

        setMatches(matchesData as Match[]);
        setPlayerMatches(playerMatchesData as Match[]);
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage],
  );

  const removeMatch = useCallback(
    async (matchId: string) => {
      setLoading(true);
      setError("");

      try {
        await deleteMatch(matchId);

        setMatches((currentMatches) =>
          currentMatches.filter((match) => match.id !== matchId),
        );

        setPlayerMatches((currentMatches) =>
          currentMatches.filter((match) => match.id !== matchId),
        );

        setSelectedMatch((currentMatch) =>
          currentMatch?.id === matchId ? null : currentMatch,
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
      matches,
      playerMatches,
      selectedMatch,
      loading,
      error,
      loadMatches,
      loadPlayerMatches,
      loadMatchById,
      addNewMatch,
      joinExistingMatch,
      leaveExistingMatch,
      removeMatch,
      clearMatchError,
    }),
    [
      matches,
      playerMatches,
      selectedMatch,
      loading,
      error,
      loadMatches,
      loadPlayerMatches,
      loadMatchById,
      addNewMatch,
      joinExistingMatch,
      leaveExistingMatch,
      removeMatch,
      clearMatchError,
    ],
  );

  return (
    <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>
  );
}