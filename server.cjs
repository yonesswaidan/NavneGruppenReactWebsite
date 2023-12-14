const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./User.cjs');
const Ticket = require('./Ticket.cjs');
const { BoyName, GirlName, InternationalBoyName, InternationalGirlName, UnisexName } = require('./Names.cjs');

// Create an instance of the Express application
const app = express();

// Create a Set to store liked names
const likedNames = new Set();

// Configure CORS middleware to allow requests from specified origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

// Configure session middleware
app.use(
  session({
    secret: 'your-sec23423ret-key',
    resave: false,
    saveUninitialized: false,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Connect to MongoDB database
mongoose.connect('mongodb+srv://Mols:ID4EY0Cqr80zSnH2@cluster0.euyeftl.mongodb.net/NewbornNamesCloudDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Define route for user login
  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('Received email:', email);
      console.log('Received password:', password);
  
      const user = await User.findOne({ email });
  
      if (user) {
        if (user.password === password) {
          req.session.user = {
            id: user._id,
            email: user.email,
            firstName: user.personalInfo.firstName,
            lastName: user.personalInfo.lastName,
            username: user.username,
             partner: user.partner,
          };
  
          console.log('User Data:', req.session.user);
  
          res.status(200).json({ message: 'Login successful', user: req.session.user });
        } else {
          console.log('Password mismatch:', user.password, '!==', password);
          res.status(401).json({ message: 'Invalid email or password' });
        }
      } else {
        console.log('User not found for email:', email);
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
// Define route for user registration
  app.post('/register', async (req, res) => {
    try {
      const { username, password, firstName, lastName, email, partner } = req.body;
      console.log('Registration attempt:', { username, password, firstName, lastName, email, partner });
  
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }]
      });
      if (existingUser) {
        console.log('User already exists with email or username:', email, username);
        return res.status(400).json({ message: 'User already exists' });
      }
  

      const newUser = new User({
        username,
        password, 
        personalInfo: {
          firstName,
          lastName,
        },
        email,
        likedNames: [], 
        matches: [],    
        partner: partner || null, 
      });
  
      await newUser.save();
      console.log('User registered successfully:', newUser);
  
      res.status(201).json({ message: 'User registered successfully', newUser });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Define routes for retrieving lists of BoyNames
app.get('/BoyNames', async (req, res) => {
  try {
    const boyNames = await BoyName.find();
    res.json(boyNames);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Define routes for retrieving lists of GirlNames
app.get('/GirlNames', async (req, res) => {
  try {
    const girlNames = await GirlName.find();
    res.json(girlNames);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Define routes for retrieving lists of InternationalBoyNames
app.get('/InternationalBoyNames', async (req, res) => {
  try {
    const internationalBoyNames = await InternationalBoyName.find();
    res.json(internationalBoyNames);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Define routes for retrieving lists of InternationalGirlNames
app.get('/InternationalGirlNames', async (req, res) => {
  try {
    const internationalGirlNames = await InternationalGirlName.find();
    res.json(internationalGirlNames);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Define routes for retrieving lists of UnisexNames
app.get('/UnisexNames', async (req, res) => {
  try {
    const unisexNames = await UnisexName.find();
    res.json(unisexNames);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Define route for creating tickets
app.post('/tickets', async (req, res) => {
  console.log("Received ticket data:", req.body);


  const { sender, message, personalInfo } = req.body;

  try {
    const newTicket = new Ticket({
      sender, 
      message,
      personalInfo,
    });

    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Define route for checking session status
app.get('/session', (req, res) => {
  if (req.session.user) {
    const userData = {
      id: req.session.user.id,
      email: req.session.user.email,
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      username: req.session.user.username,
    
    };
    res.status(200).json({ loggedIn: true, user: userData });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

// Define route for liking a name
app.post('/likeName', async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.likedNames.includes(name)) {
      user.likedNames.push(name);
    }

  
    if (user.partner) {
      const partner = await User.findById(user.partner);
      if (partner && partner.likedNames.includes(name)) {
      
        if (!user.matches.includes(name)) {
          user.matches.push(name);

          if (!partner.matches.includes(name)) {
            partner.matches.push(name);
            await partner.save();
          }
        }
      }
    }

    await user.save();

    res.status(200).json({ message: 'Name liked successfully' });
  } catch (error) {
    console.error('Error in liking name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Define route for retrieving liked names for a user
app.get('/likedNames/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.likedNames);
  } catch (error) {
    console.error('Error fetching liked names:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define route for retrieving matched names for a user
app.get('/matchedNames/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

  
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.matches);
  } catch (error) {
    console.error('Error fetching matched names:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define route for adding a partner to a user
app.post('/addPartner', async (req, res) => {
  try {
    const { username, partnerUsername } = req.body;

    console.log('Request data:', { username, partnerUsername });
    const currentUser = await User.findOne({ username });
    
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }
    const partnerUser = await User.findOne({ username: partnerUsername });

    if (!partnerUser) {
      console.log('Partner user not found:', partnerUsername);
      return res.status(404).json({ message: 'Partner user not found' });
    }

    console.log('Updating partner for user:', currentUser.username);

    currentUser.partner = partnerUser._id;
    await currentUser.save();

    console.log('Partner added successfully for user:', currentUser.username);
    res.status(200).json({ message: 'Partner added successfully', currentUser });
  } catch (error) {
    console.error('Error adding partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define route for removing a name from a user's list
app.post('/removeName/:userId', async (req, res) => {
  try {
      const { userId } = req.params;
      const { name, listType } = req.body;

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (listType === 'likedNames') {
          user.likedNames = user.likedNames.filter(n => n !== name);
      } else if (listType === 'matchedNames') {
          user.matches = user.matches.filter(n => n !== name);
      }

      await user.save();
      res.status(200).json({ message: 'Name removed successfully' });
  } catch (error) {
      console.error('Error removing name:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Define route for user logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).json({ message: 'Logout successful' });
    }
  });
});

// Define the port for the server to listen on
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
