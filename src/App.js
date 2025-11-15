import React, { useState, useEffect } from 'react';

// Replace with your Render backend URL
const API_URL = 'https://verification-backend-evon.onrender.com/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookAppointment, setBookAppointment] = useState(false);
  const [pickUpCheck, setPickUpCheck] = useState(false);
  const [speakToHuman, setSpeakToHuman] = useState(false);

  // Fetch settings from backend on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/settings`);
      const data = await response.json();
      
      if (response.ok) {
        setBookAppointment(data.appointment || false);
        setPickUpCheck(data.pickup || false);
        setSpeakToHuman(data.speakToHuman || false);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (field, value) => {
    try {
      const updatedSettings = {
        appointment: field === 'appointment' ? value : bookAppointment,
        pickup: field === 'pickup' ? value : pickUpCheck,
        speakToHuman: field === 'speakToHuman' ? value : speakToHuman,
      };

      const response = await fetch(`${API_URL}/settings/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state with server response
        setBookAppointment(data.settings.appointment);
        setPickUpCheck(data.settings.pickup);
        setSpeakToHuman(data.settings.speakToHuman);
      } else {
        console.error('Failed to update settings');
        // Revert the change
        fetchSettings();
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      // Revert the change
      fetchSettings();
    }
  };

  const handleToggle = (field, currentValue) => {
    const newValue = !currentValue;
    
    // Optimistically update UI
    if (field === 'appointment') setBookAppointment(newValue);
    if (field === 'pickup') setPickUpCheck(newValue);
    if (field === 'speakToHuman') setSpeakToHuman(newValue);

    // Update backend
    updateSettings(field, newValue);
  };

  const handleLogin = () => {
    setError('');
    
    if (email === 'admin@example.com' && password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      setError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.loginTitle}>Admin Login</h1>
          <p style={styles.loginSubtitle}>Please enter your credentials</p>
          
          <div style={styles.loginForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
                placeholder="admin@example.com"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
                placeholder="Enter password"
              />
            </div>
            
            {error && <div style={styles.error}>{error}</div>}
            
            <button onClick={handleLogin} style={styles.loginButton}>
              Login
            </button>
            
            <div style={styles.demoCredentials}>
              <p style={styles.demoText}>Demo credentials:</p>
              <p style={styles.demoText}>Email: admin@example.com</p>
              <p style={styles.demoText}>Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </header>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>
          <p style={styles.loadingText}>Loading settings...</p>
        </div>
      ) : (
        <div style={styles.cardsContainer}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Book Appointment</h2>
            <p style={styles.cardDescription}>Click to schedule an appointment</p>
            <div style={styles.toggleContainer}>
              <div
                style={{
                  ...styles.toggle,
                  ...(bookAppointment ? styles.toggleActive : {})
                }}
                onClick={() => handleToggle('appointment', bookAppointment)}
              >
                <div
                  style={{
                    ...styles.toggleCircle,
                    ...(bookAppointment ? styles.toggleCircleActive : {})
                  }}
                />
              </div>
            </div>
            <p style={styles.statusText}>
              Status: {bookAppointment ? 'Enabled' : 'Disabled'}
            </p>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Pick Up the Check</h2>
            <p style={styles.cardDescription}>Click to process check pickup</p>
            <div style={styles.toggleContainer}>
              <div
                style={{
                  ...styles.toggle,
                  ...(pickUpCheck ? styles.toggleActive : {})
                }}
                onClick={() => handleToggle('pickup', pickUpCheck)}
              >
                <div
                  style={{
                    ...styles.toggleCircle,
                    ...(pickUpCheck ? styles.toggleCircleActive : {})
                  }}
                />
              </div>
            </div>
            <p style={styles.statusText}>
              Status: {pickUpCheck ? 'Enabled' : 'Disabled'}
            </p>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Ask to Speak to Human</h2>
            <p style={styles.cardDescription}>Click to connect with a representative</p>
            <div style={styles.toggleContainer}>
              <div
                style={{
                  ...styles.toggle,
                  ...(speakToHuman ? styles.toggleActive : {})
                }}
                onClick={() => handleToggle('speakToHuman', speakToHuman)}
              >
                <div
                  style={{
                    ...styles.toggleCircle,
                    ...(speakToHuman ? styles.toggleCircleActive : {})
                  }}
                />
              </div>
            </div>
            <p style={styles.statusText}>
              Status: {speakToHuman ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  loginCard: {
    backgroundColor: 'white',
    padding: '48px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  loginTitle: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#1a1a1a',
  },
  loginSubtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '32px',
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '20px',
  },
  loginButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  demoCredentials: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#666',
  },
  demoText: {
    margin: '4px 0',
  },
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    backgroundColor: 'white',
    padding: '24px 32px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    maxWidth: '1200px',
    margin: '0 auto 40px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    color: '#1a1a1a',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #ef4444',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#666',
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1a1a1a',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '24px',
  },
  toggleContainer: {
    marginTop: 'auto',
    marginBottom: '12px',
  },
  toggle: {
    width: '56px',
    height: '32px',
    backgroundColor: '#ddd',
    borderRadius: '16px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.3s',
  },
  toggleActive: {
    backgroundColor: '#4ade80',
  },
  toggleCircle: {
    width: '24px',
    height: '24px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '4px',
    left: '4px',
    transition: 'transform 0.3s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  toggleCircleActive: {
    transform: 'translateX(24px)',
  },
  statusText: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#666',
    marginTop: '8px',
  },
};