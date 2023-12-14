import React, { useState } from 'react';
import './RegisterPartner.css';

function RegisterPartner() {
  // State to store partner's username
  const [partnerUsername, setPartnerUsername] = useState('');

  // Handle change in the input field
  const handleChange = (e) => {
    setPartnerUsername(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get user data from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      console.error('User data not found in localStorage');
      return;
    }

    // Get the user's username
    const username = userData.username;

    // Prepare data to send in the request
    const data = { username, partnerUsername };

    try {
      // Send a POST request to add a partner
      const response = await fetch('http://localhost:5000/addPartner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        console.log('Partner added successfully');
        navigate('/listofnames');
      } else {
        const responseData = await response.json();
        console.error('Error adding partner:', responseData.message);
      }
    } catch (error) {
      console.error('Error adding partner:', error);
    }
  };

  return (
    <div className="support-container">
      <h2>Register Partner</h2>
      <div className="support-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Partner's Username:</label>
            <input
              type="text"
              name="partnerUsername"
              value={partnerUsername}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPartner;
