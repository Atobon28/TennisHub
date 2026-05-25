/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ToastType = "success" | "error";

interface ToastData {
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: ToastData | null;
  showToast: (message: string, type: ToastType) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: null,
  showToast: () => {},
  hideToast: () => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
