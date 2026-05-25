import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/access-pages.css";
import registerImage from "../assets/register.jpg";
import { registerUser, addUser } from "../firebase/services";

function RegisterAdminPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanEmail = email.trim();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();
    const cleanPhone = phone.replace(/\D/g, "");

    setError("");
    setLoading(true);

    if (!cleanEmail || !cleanUsername || !cleanPhone || !cleanPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (cleanPhone.length < 10) {
      setError("Please enter a valid WhatsApp phone number.");
      setLoading(false);
      return;
    }

    if (cleanPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await registerUser(cleanEmail, cleanPassword);

      await addUser({
        uid: userCredential.user.uid,
        email: cleanEmail,
        username: cleanUsername,
        phone: cleanPhone,
        role: "admin",
      });

      localStorage.setItem("role", "admin");
      navigate("/login");
    } catch (err) {
      console.error("Admin register error:", err);
      setError("Error creating account. Please try again.");
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
            Register as Admin
          </h2>

          <form className="access-form" onSubmit={handleRegister}>
            <div className="access-form__group">
              <label className="access-form__label" htmlFor="admin-email">
                Email
              </label>

              <input
                id="admin-email"
                type="email"
                className="access-form__input"
                placeholder="Enter your email..."
                value={email}
                autoComplete="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="access-form__group">
              <label className="access-form__label" htmlFor="admin-username">
                Username
              </label>

              <input
                id="admin-username"
                type="text"
                className="access-form__input"
                placeholder="Enter your username..."
                value={username}
                autoComplete="username"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="access-form__group">
              <label className="access-form__label" htmlFor="admin-phone">
                Phone (WhatsApp)
              </label>

              <input
                id="admin-phone"
                type="tel"
                inputMode="numeric"
                className="access-form__input"
                placeholder="Example: 573122588794"
                value={phone}
                autoComplete="tel"
                required
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="access-form__group">
              <label className="access-form__label" htmlFor="admin-password">
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                className="access-form__input"
                placeholder="Enter your password..."
                value={password}
                autoComplete="new-password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="access-form__error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="access-form__button-primary"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <div className="access-form__footer">
              <span className="access-form__footer-line">
                <span className="access-form__back-icon">‹</span>
                <span>Already have an account?</span>

                <Link to="/login" className="access-form__link">
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </section>

      <section className="access-screen__right">
        <img
          src={registerImage}
          alt="Tennis court background used for TennisHub admin registration"
          className="access-screen__image"
        />
      </section>
    </div>
  );
}

export default RegisterAdminPage;