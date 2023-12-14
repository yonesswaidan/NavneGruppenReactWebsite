import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 

import Header from './components/Header/Header';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import LikedNames from './components/LikedNames/LikedNames';
import ListOfNames from './components/ListOfNames/ListOfNames';
import Support from './components/Support/Support';
import Register from './components/Register/Register';
import RegisterPartner from './components/RegisterPartner/RegisterPartner';
import Logout from './components/Logout/Logout';


function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes> 
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/likednames" element={<LikedNames />} />
          <Route path="/listofnames" element={<ListOfNames />} />
          <Route path="/support" element={<Support />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerpartner" element={<RegisterPartner />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
