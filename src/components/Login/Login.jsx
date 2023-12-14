import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Login() {
  // State variables to store email, password, and login message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();

  // Function to handle the form submission when the user tries to log in
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      // Handle server errors
      const errorData = await response.json();
      setLoginMessage(errorData.message || 'Login failed');
      return;
    }

    // Parse the response JSON data
    const data = await response.json();

    // Check if the 'user' property exists in the response
    if (data && data.user) {
      localStorage.setItem('userData', JSON.stringify(data.user));
      navigate('/listofnames');
    } else {
      setLoginMessage('Login failed');
    }
  } catch (error) {
    // Set a login error message for unexpected errors
    setLoginMessage('Login failed');
  }
};

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="login-form">
        {loginMessage && <p>{loginMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          <div className="link-to-register">
            <Link to="/register">Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
