import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// CHANGE THIS TO YOUR LIVE BACKEND URL
const API_URL = "https://verification-backend-evon.onrender.com/api";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Settings
  const [appointment, setAppointment] = useState(false);
  const [pickup, setPickup] = useState(false);
  const [speakToHuman, setSpeakToHuman] = useState(false);

  // Load settings after login
  useEffect(() => {
    if (isAuthenticated) {
      loadSettings();
    }
  }, [isAuthenticated]);

  // GET Settings
  const loadSettings = async () => {
    try {
      setLoading(true);

      let res = await fetch(`${API_URL}/settings`);
      let data = await res.json();

      if (res.ok) {
        setAppointment(data.appointment ?? false);
        setPickup(data.pickup ?? false);
        setSpeakToHuman(data.speakToHuman ?? false);
      }
    } catch (error) {
      console.log("Settings fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE Settings
  const updateSettings = async (field, newValue) => {
    try {
      let body = {
        appointment:
          field === "appointment" ? newValue : appointment,
        pickup:
          field === "pickup" ? newValue : pickup,
        speakToHuman:
          field === "speakToHuman" ? newValue : speakToHuman,
      };

      const res = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success("Settings updated!");
        loadSettings();
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Server error updating settings");
    }
  };

  // On Toggle Click
  const toggleSwitch = (field, currentValue) => {
    const newValue = !currentValue;

    if (field === "appointment") setAppointment(newValue);
    if (field === "pickup") setPickup(newValue);
    if (field === "speakToHuman") setSpeakToHuman(newValue);

    updateSettings(field, newValue);
  };

  // LOGIN
  const login = async () => {
    try {
      setError("");
      setLoading(true);

      let res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = await res.json();

      if (res.ok && data.success) {
        toast.success("Login successful!");
        setIsAuthenticated(true);
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <ToastContainer />
        <div style={styles.loginBox}>
          <h1>Admin Login</h1>

          <input
            style={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && login()}
          />

          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onKeyPress={(e) => e.key === "Enter" && login()}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.btn} onClick={login}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    );
  }

  // DASHBOARD UI
  return (
    <div style={styles.container}>
      <ToastContainer />
      <div style={styles.header}>
        <h1>Admin Dashboard</h1>
        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      <div style={styles.grid}>
        {/* Book Appointment */}
        <SettingCard
          title="Book Appointment"
          status={appointment}
          onToggle={() => toggleSwitch("appointment", appointment)}
        />

        {/* Pick Up Check */}
        <SettingCard
          title="Pick Up the Check"
          status={pickup}
          onToggle={() => toggleSwitch("pickup", pickup)}
        />

        {/* Speak to Human */}
        <SettingCard
          title="Ask to Speak to Human"
          status={speakToHuman}
          onToggle={() => toggleSwitch("speakToHuman", speakToHuman)}
        />
      </div>
    </div>
  );
}

// Small Component
function SettingCard({ title, status, onToggle }) {
  return (
    <div style={styles.card}>
      <h2>{title}</h2>

      <div style={styles.toggleTrack} onClick={onToggle}>
        <div
          style={{
            ...styles.toggleCircle,
            ...(status ? styles.toggleOn : {}),
          }}
        />
      </div>

      <p>Status: {status ? "Enabled" : "Disabled"}</p>
    </div>
  );
}

// Styles
const styles = {
  loginContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f4f4",
  },
  loginBox: {
    width: 350,
    padding: 30,
    background: "white",
    borderRadius: 12,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  btn: {
    width: "100%",
    padding: 12,
    background: "#ef4444",
    color: "white",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: { color: "red" },

  container: {
    padding: 30,
    background: "#f5f5f5",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logoutBtn: {
    padding: "10px 20px",
    background: "#ef4444",
    color: "white",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },

  card: {
    background: "white",
    padding: 25,
    textAlign: "center",
    borderRadius: 12,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },

  toggleTrack: {
    width: 60,
    height: 32,
    background: "#ccc",
    borderRadius: 20,
    margin: "10px auto",
    position: "relative",
    cursor: "pointer",
  },

  toggleCircle: {
    width: 26,
    height: 26,
    background: "white",
    borderRadius: "50%",
    position: "absolute",
    top: 3,
    left: 3,
    transition: "0.3s",
  },

  toggleOn: { transform: "translateX(28px)", background: "white" },
};
