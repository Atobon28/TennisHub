import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/access-pages.css";
import registerImage from "../assets/register.jpg";
import { registerUser, addUser } from "../firebase/services";

const categoryOptions = [
  "First Category",
  "Second Category",
  "Third Category",
  "Fourth Category",
  "Fifth Category",
  "Beginner",
  "Junior",
  "Senior",
];

const getCategoryLevel = (category: string) => {
  if (category === "First Category") return 1;
  if (category === "Second Category") return 2;
  if (category === "Third Category") return 3;
  if (category === "Fourth Category") return 4;
  if (category === "Fifth Category") return 5;

  return null;
};

function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    if (!email || !username || !phone || !password || !category) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await registerUser(email, password);
      const numericLevel = getCategoryLevel(category);

      await addUser({
        uid: userCredential.user.uid,
        email,
        username,
        phone,
        category,
        level: numericLevel,
        role: "player",
      });

      localStorage.setItem("role", "player");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
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
            Register
          </h2>

          <form className="access-form" onSubmit={handleRegister}>
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
              <label className="access-form__label" htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                className="access-form__input"
                placeholder="Enter your username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="access-form__group">
              <label className="access-form__label" htmlFor="phone">
                Phone (WhatsApp)
              </label>

              <input
                id="phone"
                type="tel"
                className="access-form__input"
                placeholder="Example: 3122588794"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="access-form__group">
              <label className="access-form__label" htmlFor="category">
                Category
              </label>

              <select
                id="category"
                className="access-form__input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select your category</option>

                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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
          alt="TennisHub register"
          className="access-screen__image"
        />
      </section>
    </div>
  );
}

export default RegisterPage;