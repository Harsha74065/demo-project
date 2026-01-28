import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

const AuthPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Check if user is admin
      if (data.user.role !== "admin") {
        throw new Error("Access denied. Admin only.");
      }

      // Save token and user to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
      navigate("/cms");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <img
            src="https://www.dfrpms.com/images/Dexter-Capital-Advisors-logo.png"
            alt="Dexter Logo"
            style={styles.logo}
          />
          <h1 style={styles.title}>Admin Login</h1>
          <p style={styles.subtitle}>
            Sign in to manage blogs and content
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Please wait..." : "Sign In"}
          </button>
        </form>

        <div style={styles.publicLink}>
          <a href="/blogs" style={styles.blogLink}>
            View Public Blogs
          </a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  logoSection: {
    textAlign: "center",
    marginBottom: "30px",
  },
  logo: {
    height: "50px",
    marginBottom: "20px",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "28px",
    color: "#1a365d",
    fontWeight: "700",
  },
  subtitle: {
    margin: 0,
    color: "#718096",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#4a5568",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "15px",
    transition: "border-color 0.2s",
    outline: "none",
  },
  button: {
    padding: "14px",
    background: "linear-gradient(135deg, #38b2ac 0%, #319795 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  error: {
    color: "#e53e3e",
    fontSize: "14px",
    margin: 0,
    padding: "10px",
    background: "#fff5f5",
    borderRadius: "6px",
    border: "1px solid #fed7d7",
  },
  publicLink: {
    textAlign: "center",
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  blogLink: {
    color: "#4a5568",
    textDecoration: "none",
    fontSize: "14px",
  },
};

export default AuthPage;
