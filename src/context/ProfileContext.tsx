import { createContext, useState, type ReactNode } from "react";
import {
  changeCurrentUserPassword,
  updateUser,
  uploadUserAvatar,
} from "../firebase/services";

interface ProfileContextType {
  loading: boolean;
  error: string;
  success: string;
  editProfile: (userDocId: string, profileData: object) => Promise<void>;
  uploadAvatar: (
    userDocId: string,
    uid: string,
    file: File,
  ) => Promise<string>;
  changePassword: (newPassword: string) => Promise<void>;
  clearProfileMessages: () => void;
}

export const ProfileContext = createContext<ProfileContextType>({
  loading: false,
  error: "",
  success: "",
  editProfile: async () => {},
  uploadAvatar: async () => "",
  changePassword: async () => {},
  clearProfileMessages: () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearProfileMessages = () => {
    setError("");
    setSuccess("");
  };

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    return "Something went wrong with the profile.";
  };

  const editProfile = async (userDocId: string, profileData: object) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateUser(userDocId, profileData);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (
    userDocId: string,
    uid: string,
    file: File,
  ) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const photoURL = await uploadUserAvatar(userDocId, uid, file);
      setSuccess("Avatar updated successfully.");
      return photoURL;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (newPassword: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await changeCurrentUserPassword(newPassword);
      setSuccess("Password updated successfully.");
    } catch (err) {
      const message = getErrorMessage(err);

      if (message.includes("requires-recent-login")) {
        setError("Please log out and log in again before changing your password.");
      } else {
        setError(message);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        loading,
        error,
        success,
        editProfile,
        uploadAvatar,
        changePassword,
        clearProfileMessages,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}