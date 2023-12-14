import React, { useState } from 'react';
import './Support.css';

function Support() {
  // Get user data from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));

  // Initialize state for ticket data
  const [ticketData, setTicketData] = useState({
    sender: userData.username, 
    message: '',
    personalInfo: {
      email: userData.email, 
      firstName: userData.firstName, 
      lastName: userData.lastName, 
    },
  });

  // State to track if the ticket is successfully created
  const [ticketCreated, setTicketCreated] = useState(false);

  // Handle change in the message input field
  const handleChange = (e) => {
    if (e.target.name === 'message') {
      setTicketData({ ...ticketData, [e.target.name]: e.target.value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting ticket data:', ticketData);

    try {
      // Send a POST request to create a new ticket
      const response = await fetch('http://localhost:5000/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData), // Send ticket data in the request body
      });

      const data = await response.json();
      if (response.ok) {
        // If the response is successful, set ticketCreated to true
        setTicketCreated(true);
        console.log('Ticket created:', data);
      } else {
        console.error('Ticket creation failed:', data.message);
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
    }
  };

  return (
    <div>
      <div className="support-container">
        <h2>Support</h2>
        <div className="support-form">
          {ticketCreated && <p className="success-message">Ticket oprettet</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={ticketData.personalInfo.email}
                readOnly
                required
              />
            </div>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={ticketData.personalInfo.firstName}
                readOnly
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={ticketData.personalInfo.lastName}
                readOnly
                required
              />
            </div>
            <div className="form-group">
              <label>Message:</label>
              <textarea
                name="message"
                value={ticketData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Submit Ticket</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Support;
