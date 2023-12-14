const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a new Mongoose schema for the 'User' model
const userSchema = new Schema({
  // Define fields for the 'User' model with their data types and constraints
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true },
  likedNames: [{ type: String }], 
  matches: [{ type: String }], 
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// Create a Mongoose model named 'User' using the schema
const User = mongoose.model('User', userSchema, 'User');

// Export the 'User' model
module.exports = User;
