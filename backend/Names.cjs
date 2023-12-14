const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema for boy names
const boyNameSchema = new Schema({
  name: { type: String, required: true }, 
});

// Create a model named 'BoyName' 
const BoyName = mongoose.model('BoyName', boyNameSchema);

// Define a schema for girl names
const girlNameSchema = new Schema({
  name: { type: String, required: true }, 
});

// Create a model named 'GirlName' 
const GirlName = mongoose.model('GirlName', girlNameSchema);

// Define a schema for international boy names
const internationalBoyNameSchema = new Schema({
  name: { type: String, required: true }, 
});

// Create a model named 'InternationalBoyName' 
const InternationalBoyName = mongoose.model('InternationalBoyName', internationalBoyNameSchema);

// Define a schema for international girl names
const internationalGirlNameSchema = new Schema({
  name: { type: String, required: true }, 
});

// Create a model named 'InternationalGirlName' 
const InternationalGirlName = mongoose.model('InternationalGirlName', internationalGirlNameSchema);

// Define a schema for unisex names
const unisexNameSchema = new Schema({
  name: { type: String, required: true }, 
});

// Create a model named 'UnisexName' 
const UnisexName = mongoose.model('UnisexName', unisexNameSchema);

// Export all the models for use in other parts of the application
module.exports = {
  BoyName,
  GirlName,
  InternationalBoyName,
  InternationalGirlName,
  UnisexName,
};
