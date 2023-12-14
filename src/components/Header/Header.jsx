import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';


function Header() {
  return (
    <div className="topnav" id="myTopnav">
      <Link to="/homepage">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/likednames">Likede Navne</Link>
      <Link to="/listofnames">Liste af Navne</Link>
      <Link to="/support">Support</Link>
      <Link to="/registerpartner">Register Partner</Link>
      <Link to="/logout">Logout</Link>
      <i className="fa fa-bars"></i>
    </div>
  );
}
export default Header;
