import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

const mainNavigation = (props) => (
  <header className="main-navigation"> 
    <div className="main-navigation__logo">
      navbar
    </div>
    <nav className="main-navigation__items">
      <ul>
        <li> <NavLink to="/auth">auth nav link</NavLink> </li>
        <li> <NavLink to="/events">events nav link</NavLink> </li>
        <li> <NavLink to="/bookings">bookings nav link</NavLink> </li>
      </ul>

    </nav>
  </header>
)

export default mainNavigation;