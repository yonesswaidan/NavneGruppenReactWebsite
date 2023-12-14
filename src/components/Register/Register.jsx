import React, { useState, useEffect } from 'react';
import './Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  // State variables for user registration data
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // State variable to store registration message or error
  const [registrationMessage, setRegistrationMessage] = useState('');

  // State variable to track if the user session has been loaded
  //const [sessionLoaded, setSessionLoaded] = useState(false);

  // Access to navigation in React Router
  const navigate = useNavigate();

  /*
  useEffect(() => {
    // Function to check the user's session
    const checkSession = async () => {
      try {
        // Send a request to check the user's session status
        const response = await fetch('http://localhost:5000/session', {
          credentials: 'include', // Include cookies for authentication
        });

        // Parse the response data
        const data = await response.json();
        console.log('User data from session:', data);

        if (data.loggedIn) {
          // Handle the case when the user is already logged in
          // You can add logic here if needed
        }
      } finally {
        // Set sessionLoaded to true to indicate that the session check is complete
        setSessionLoaded(true);
      }
    };

    // Call the function to check the session when the component mounts
    checkSession();
  }, []);
*/

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to register the user
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password,
        firstName,
        lastName,
        email,
      });

      if (response.status === 201) {
        // Redirect to the login page after successful registration
        navigate('/login');
      } else {
        // Set a registration error message
        setRegistrationMessage('Registration failed');
      }
    } catch (error) {
      // Set an error message based on the response or a default message
      setRegistrationMessage(error.response.data.message || 'Registration failed');
    }
  };

  return (
    <div className="register-box">
      <div className="register-container">
        <h2>Opret konto</h2>
        {registrationMessage && <p>{registrationMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Brugernavn:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Adgangskode:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Fornavn:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Efternavn:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Opret konto</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
