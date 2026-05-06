import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface ProtectedRouteProps {
  allowedRole: "player" | "coach" | "admin";
  children: React.ReactNode;
}

function ProtectedRoute({ allowedRole, children }: ProtectedRouteProps) {
  const { userData, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontWeight: 800,
        }}
      >
        Loading...
      </div>
    );
  }

  if (!userData) {
    return <Navigate to="/" replace />;
  }

  if (userData.role !== allowedRole) {
    if (userData.role === "admin") {
      return <Navigate to="/admin/home" replace />;
    }

    if (userData.role === "coach") {
      return <Navigate to="/coach/home" replace />;
    }

    return <Navigate to="/player/home" replace />;
  }

  return children;
}

export default ProtectedRoute;