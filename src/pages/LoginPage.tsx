import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/access-pages.css";
import loginImage from "../assets/login.jpg";
import { loginUser, getUserByUid } from "../firebase/services";

function LoginPage() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const registerLink =
    role === "coach"
      ? "/register-coach"
      : role === "admin"
        ? "/register-admin"
        : "/register";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await loginUser(email, password);
      const userData = (await getUserByUid(userCredential.user.uid)) as any;
      if (!userData) throw new Error("User not found");
      localStorage.setItem("role", userData.role);
      if (userData.role === "coach") {
        navigate("/coach/home");
      } else if (userData.role === "admin") {
        navigate("/admin/home");
      } else {
        navigate("/player/home");
      }
    } catch (err: any) {
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
            Log in
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
              {loading ? "Logging in..." : "Login"}
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
