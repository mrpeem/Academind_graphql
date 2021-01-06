import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';
import AuthContext from '../../context/auth-context';

const mainNavigation = (props) => (
  <AuthContext.Consumer> 
    { (context) => {
      return (
        <header className="main-navigation"> 
          <div className="main-navigation__logo">
            navbar
          </div>
          <nav className="main-navigation__items">
            <ul>
              {!context.token && <li> <NavLink to="/auth">auth nav link</NavLink> </li>}
              <li> <NavLink to="/events">events nav link</NavLink> </li>
              {context.token && <li> <NavLink to="/bookings">bookings nav link</NavLink> </li>}
            </ul>

          </nav>
        </header>
      )
    }}    
  </AuthContext.Consumer>
)

export default mainNavigation;