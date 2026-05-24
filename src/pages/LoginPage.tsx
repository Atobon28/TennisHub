import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/access-pages.css";
import loginImage from "../assets/login.jpg";
import { loginUser, getUserByUid, logoutUser } from "../firebase/services";

interface LoginUserData {
  id: string;
  role: string;
}

function LoginPage() {
  const navigate = useNavigate();

  const selectedRole = localStorage.getItem("role");

  const registerLink =
    selectedRole === "coach"
      ? "/register-coach"
      : selectedRole === "admin"
        ? "/register-admin"
        : "/register";

  const selectedRoleLabel =
    selectedRole === "coach"
      ? "Coach"
      : selectedRole === "admin"
        ? "Admin"
        : "Player";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getHomeRouteByRole = (role: string) => {
    if (role === "coach") return "/coach/home";
    if (role === "admin") return "/admin/home";
    return "/player/home";
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const userCredential = await loginUser(email, password);

      const userData = (await getUserByUid(
        userCredential.user.uid,
      )) as LoginUserData | null;

      if (!userData) {
        await logoutUser();
        throw new Error("User not found");
      }

      const realRole = userData.role;

      if (selectedRole && realRole !== selectedRole) {
        await logoutUser();

        setError(
          `This account is registered as ${realRole}. Please select ${realRole} to log in.`,
        );

        return;
      }

      localStorage.setItem("role", realRole);

      navigate(getHomeRouteByRole(realRole));
    } catch (error: unknown) {
      console.error("Login error:", error);

      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="access-screen">
      <section className="access-screen__left">
        <div className="access-screen__content access-screen__content--form">
          <h1 className="access-screen__title">TennisHub</h1>

          <h2 className="access-screen__subtitle access-screen__subtitle--login">
            Log in as {selectedRoleLabel}
          </h2>

          <form className="access-form" onSubmit={handleLogin}>
            <div className="access-form__group">
              <label className="access-form__label" htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                className="access-form__input"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="access-form__group">
              <label className="access-form__label" htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                className="access-form__input"
                placeholder="Enter your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="access-form__error">{error}</p>}

            <button
              type="submit"
              className="access-form__button-primary"
              disabled={loading}
            >
              {loading ? "Logging in..." : `Login as ${selectedRoleLabel}`}
            </button>

            <div className="access-form__footer">
              <span className="access-form__footer-line">
                <span className="access-form__back-icon">‹</span>
                <span>No account yet?</span>

                <Link to={registerLink} className="access-form__footer-link">
                  Sign up
                </Link>
              </span>
            </div>

            <div className="access-form__footer">
              <span className="access-form__footer-line">
                <span>Wrong role?</span>

                <Link to="/" className="access-form__footer-link">
                  Go back
                </Link>
              </span>
            </div>
          </form>
        </div>
      </section>

      <section className="access-screen__right">
        <img
          src={loginImage}
          alt="TennisHub login"
          className="access-screen__image"
        />
      </section>
    </div>
  );
}

export default LoginPage;
