import { useToast } from "../../context/ToastContext";
import "../../styles/toast.css";

function Toast() {
  const { toast } = useToast();

  if (!toast) return null;

  return (
    <div
      className={`toast toast--${toast.type}`}
      role="alert"
      aria-live="polite"
    >
      {toast.message}
    </div>
  );
}

export default Toast;
