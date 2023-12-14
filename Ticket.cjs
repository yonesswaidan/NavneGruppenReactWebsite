const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new Mongoose schema for the 'Ticket' model
const ticketSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  sender: { type: String, required: true },
  message: { type: String, required: true },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
  },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
});

// Create a Mongoose model named 'Ticket' using the schema
const Ticket = mongoose.model('Ticket', ticketSchema, 'Ticket');

// Export the 'Ticket' model 
module.exports = Ticket;
