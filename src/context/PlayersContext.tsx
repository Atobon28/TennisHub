/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from "react";
import { getPlayers, updateUser } from "../firebase/services";

export interface Player {
  id: string;
  uid?: string;
  email?: string;
  username?: string;
  role?: string;
  level?: number | null;
  category?: string;
  phone?: string;
  photoURL?: string;
  [key: string]: unknown;
}

interface PlayersContextType {
  players: Player[];
  selectedPlayer: Player | null;
  loading: boolean;
  error: string;
  loadPlayers: () => Promise<void>;
  loadPlayerById: (playerId: string) => Promise<Player | null>;
  editPlayerProfile: (playerId: string, playerData: object) => Promise<void>;
  clearPlayerError: () => void;
}

export const PlayersContext = createContext<PlayersContextType>({
  players: [],
  selectedPlayer: null,
  loading: false,
  error: "",
  loadPlayers: async () => {},
  loadPlayerById: async () => null,
  editPlayerProfile: async () => {},
  clearPlayerError: () => {},
});

export function PlayersProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearPlayerError = () => {
    setError("");
  };

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    return "Something went wrong with players.";
  };

  const loadPlayers = async () => {
    setLoading(true);
    setError("");

    try {
      const data = (await getPlayers()) as Player[];
      setPlayers(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const loadPlayerById = async (playerId: string) => {
    setLoading(true);
    setError("");

    try {
      const data = (await getPlayers()) as Player[];
      const coach =
const player =
  data.find((item) => item.id === playerId || item.uid === playerId) || null;

      setSelectedPlayer(player);
      return player;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editPlayerProfile = async (playerId: string, playerData: object) => {
    setLoading(true);
    setError("");

    try {
      await updateUser(playerId, playerData);

      setPlayers((currentPlayers) =>
        currentPlayers.map((player) =>
          player.id === playerId ? { ...player, ...playerData } : player,
        ),
      );

      setSelectedPlayer((currentPlayer) =>
        currentPlayer?.id === playerId
          ? { ...currentPlayer, ...playerData }
          : currentPlayer,
      );
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlayersContext.Provider
      value={{
        players,
        selectedPlayer,
        loading,
        error,
        loadPlayers,
        loadPlayerById,
        editPlayerProfile,
        clearPlayerError,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
}