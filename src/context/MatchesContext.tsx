/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from "react";
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
  type?: "Singles" | "Doubles" | string;
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
    playerUsername: string,
  ) => Promise<void>;
  leaveExistingMatch: (
    matchId: string,
    playerId: string,
    playerUsername: string,
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

  const clearMatchError = () => {
    setError("");
  };

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    return "Something went wrong with matches.";
  };

  const loadMatches = async () => {
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
  };

  const loadPlayerMatches = async (playerId: string) => {
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
  };

  const loadMatchById = async (matchId: string) => {
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
  };

  const addNewMatch = async (matchData: object) => {
    setLoading(true);
    setError("");

    try {
      await createMatch(matchData);
      await loadMatches();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinExistingMatch = async (
    matchId: string,
    playerId: string,
    playerUsername: string,
  ) => {
    setLoading(true);
    setError("");

    try {
      await joinMatch(matchId, playerId, playerUsername);
      await loadMatches();
      await loadPlayerMatches(playerId);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const leaveExistingMatch = async (
    matchId: string,
    playerId: string,
    playerUsername: string,
  ) => {
    setLoading(true);
    setError("");

    try {
      await leaveMatch(matchId, playerId, playerUsername);
      await loadMatches();
      await loadPlayerMatches(playerId);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMatch = async (matchId: string) => {
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
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MatchesContext.Provider
      value={{
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
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
}