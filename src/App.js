import React, { useState } from 'react';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [bookAppointment, setBookAppointment] = useState(true);
  const [pickUpCheck, setPickUpCheck] = useState(false);
  const [speakToHuman, setSpeakToHuman] = useState(false);

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
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Admin Login</h1>
          <p className="login-subtitle">Please enter your credentials</p>
          
          <div className="login-form">
            <div className="form-group">
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input"
                placeholder="admin@example.com"
              />
            </div>
            
            <div className="form-group">
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input"
                placeholder="Enter password"
              />
            </div>
            
            {error && <div className="error">{error}</div>}
            
            <button onClick={handleLogin} className="login-button">
              Login
            </button>
            
            <div className="demo-credentials">
              <p className="demo-text">Demo credentials:</p>
              <p className="demo-text">Email: admin@example.com</p>
              <p className="demo-text">Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="cards-container">
        <div className="card">
          <h2 className="card-title">Book Appointment</h2>
          <p className="card-description">Click to schedule an appointment</p>
          <div className="toggle-container">
            <div
              className={`toggle ${bookAppointment ? 'active' : ''}`}
              onClick={() => setBookAppointment(!bookAppointment)}
            >
              <div className="toggle-circle" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Pick Up the Check</h2>
          <p className="card-description">Click to process check pickup</p>
          <div className="toggle-container">
            <div
              className={`toggle ${pickUpCheck ? 'active' : ''}`}
              onClick={() => setPickUpCheck(!pickUpCheck)}
            >
              <div className="toggle-circle" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Ask to Speak to Human</h2>
          <p className="card-description">Click to connect with a representative</p>
          <div className="toggle-container">
            <div
              className={`toggle ${speakToHuman ? 'active' : ''}`}
              onClick={() => setSpeakToHuman(!speakToHuman)}
            >
              <div className="toggle-circle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;