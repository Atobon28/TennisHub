/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import {
  addCourt,
  deleteCourt,
  getAdminCourts,
  getCourts,
  updateCourt,
  uploadCourtImage,
} from "../firebase/services";

export interface Court {
  id: string;
  adminId?: string;
  name?: string;
  type?: string;
  surface?: string;
  contact?: string;
  phone?: string;
  address?: string;
  location?: string;
  image?: string;
  imageUrl?: string;
  photoURL?: string;
  [key: string]: unknown;
}

interface CourtsContextType {
  courts: Court[];
  adminCourts: Court[];
  selectedCourt: Court | null;
  loading: boolean;
  error: string;
  loadCourts: () => Promise<void>;
  loadAdminCourts: (adminId: string) => Promise<void>;
  loadCourtById: (courtId: string) => Promise<Court | null>;
  createCourt: (adminId: string, courtData: object) => Promise<void>;
  editCourt: (courtId: string, courtData: object) => Promise<void>;
  removeCourt: (courtId: string) => Promise<void>;
  uploadCourtPhoto: (courtId: string, file: File) => Promise<string>;
  clearCourtError: () => void;
}

export const CourtsContext = createContext<CourtsContextType>({
  courts: [],
  adminCourts: [],
  selectedCourt: null,
  loading: false,
  error: "",
  loadCourts: async () => {},
  loadAdminCourts: async () => {},
  loadCourtById: async () => null,
  createCourt: async () => {},
  editCourt: async () => {},
  removeCourt: async () => {},
  uploadCourtPhoto: async () => "",
  clearCourtError: () => {},
});

export function CourtsProvider({ children }: { children: React.ReactNode }) {
  const [courts, setCourts] = useState<Court[]>([]);
  const [adminCourts, setAdminCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearCourtError = () => {
    setError("");
  };

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    return "Something went wrong with courts.";
  };

  const loadCourts = async () => {
    setLoading(true);
    setError("");

    try {
      const data = (await getCourts()) as Court[];
      setCourts(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const loadAdminCourts = async (adminId: string) => {
    setLoading(true);
    setError("");

    try {
      const data = (await getAdminCourts(adminId)) as Court[];
      setAdminCourts(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const loadCourtById = async (courtId: string) => {
    setLoading(true);
    setError("");

    try {
      const data = (await getCourts()) as Court[];
      const court = data.find((item) => item.id === courtId) || null;
      setSelectedCourt(court);
      return court;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCourt = async (adminId: string, courtData: object) => {
    setLoading(true);
    setError("");

    try {
      await addCourt(adminId, courtData);
      await loadAdminCourts(adminId);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editCourt = async (courtId: string, courtData: object) => {
    setLoading(true);
    setError("");

    try {
      await updateCourt(courtId, courtData);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeCourt = async (courtId: string) => {
    setLoading(true);
    setError("");

    try {
      await deleteCourt(courtId);

      setCourts((currentCourts) =>
        currentCourts.filter((court) => court.id !== courtId),
      );

      setAdminCourts((currentCourts) =>
        currentCourts.filter((court) => court.id !== courtId),
      );
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadCourtPhoto = async (courtId: string, file: File) => {
    setLoading(true);
    setError("");

    try {
      const imageUrl = await uploadCourtImage(courtId, file);
      return imageUrl;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CourtsContext.Provider
      value={{
        courts,
        adminCourts,
        selectedCourt,
        loading,
        error,
        loadCourts,
        loadAdminCourts,
        loadCourtById,
        createCourt,
        editCourt,
        removeCourt,
        uploadCourtPhoto,
        clearCourtError,
      }}
    >
      {children}
    </CourtsContext.Provider>
  );
}