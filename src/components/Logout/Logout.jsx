import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {

  const navigate = useNavigate();

  // Function to handle the logout process
  const handleLogout = async () => {
    try {
      console.log('Before fetch');
      // Send a POST request to the server to log the user out
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      console.log('After fetch');
  
      // If the response is successful, log the user out
      if (response.ok) {
        console.log('Logout successful');
        // Remove user data from local storage
        localStorage.removeItem('userData');
        // Navigate to the login page
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
