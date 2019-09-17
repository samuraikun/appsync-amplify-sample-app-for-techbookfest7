import React from "react";
import { Menu as Nav, Button } from 'element-react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ user, handleSignout }) => (
  <Nav mode='horizontal' theme='dark' defaultActive='1'>
    <div className='nav-container'>
      <Nav.Item index='1'>
        <NavLink to='/' className='nav-link'>
          <span className='app-title'>
            <img
              src='https://icon.now.sh/home'
              alt='App Icon'
              className='app-icon'
            />
            Storehouse App
          </span>
        </NavLink>
      </Nav.Item>

      <div className='nav-items'>
        <Nav.Item index='2'>
          <span className='app-user'>Hello, {user.username}</span>
        </Nav.Item>
        <Nav.Item index='3'>
          <Button type='warning' onClick={handleSignout}>
            Sign Out
          </Button>
        </Nav.Item>
      </div>
    </div>
  </Nav>
)

export default Navbar;
