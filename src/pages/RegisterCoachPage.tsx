import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/access-pages.css";
import registerCoachImage from "../assets/register-coach.jpg";
import { registerUser, addUser } from "../firebase/services";

function RegisterCoachPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterCoach = async (event: FormEvent<HTMLFormElement>) => {
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
        pricePerHour: "",
        availableDays: [],
        availableSchedule: {},
        role: "coach",
      });

      localStorage.setItem("role", "coach");
      navigate("/login");
    } catch (err) {
      console.error("Coach register error:", err);
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
            Register as Coach
          </h2>

          <form className="access-form" onSubmit={handleRegisterCoach}>
            <div className="access-form__group">
              <label className="access-form__label" htmlFor="coach-email">
                Email
              </label>

              <input
                id="coach-email"
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
              <label className="access-form__label" htmlFor="coach-username">
                Username
              </label>

              <input
                id="coach-username"
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
              <label className="access-form__label" htmlFor="coach-phone">
                Phone (WhatsApp)
              </label>

              <input
                id="coach-phone"
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
              <label className="access-form__label" htmlFor="coach-password">
                Password
              </label>

              <input
                id="coach-password"
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
          src={registerCoachImage}
          alt="Tennis coach registration background for TennisHub"
          className="access-screen__image"
        />
      </section>
    </div>
  );
}

export default RegisterCoachPage;