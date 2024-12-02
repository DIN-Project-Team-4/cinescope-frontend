import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo_full.png';
import { useMovieSearchContext } from '../context/MovieSearchContext.js';
import './Header.css';
import Search from './Search/Search.js';
import SignInModal from './Sign-In/SignInModal.js';

const Header = ({ showSearchBox = true, showDropdownMenu = true }) => {
  const navigate = useNavigate(); // Initialize navigate hook
  const {
    filterMethod,
    setFilterMethod,
    searchText,
    setSearchText,
    newSearch,
  } = useMovieSearchContext();

  const [showSignInModal, setShowSignInModal] = useState(false);
  const handleSignInShow = () => setShowSignInModal(true);
  const handleSignInClose = () => setShowSignInModal(false);
  const [loginstatus,setLoginstatus] = useState(true);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/groups', label: 'Groups' },
  ];

  const dropdownItems = [
    { href: '/mygroups', label: 'My Groups' },
    { href: '/profile', label: 'My Profile' },
    { href: '/settings', label: 'Settings' },
  ];

  //handle LogOut.
  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    setLoginstatus(true);
     // Delete all cookies
    document.cookie.split(";").forEach(cookie => {
    const accessToken = cookie.split("=");    
    document.cookie = `${accessToken}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }); 
      // Redirect to the home page
      navigate('/');
  };

  // Retrieve user data from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));

  return (
    <>
      <Navbar className="navbar-style" fixed="top" expand="md" style={{ fontSize: '1.2rem' }}>
        <Container fluid>
          <Navbar.Brand href="/">
            <img src={Logo} alt="logo" className="navbar-logo" />
          </Navbar.Brand>
          <Nav variant="underline" className="w-100">
            <Navbar.Toggle aria-controls="cinescope-navbar" />
            <Nav className="me-auto">
              <Navbar.Collapse id="cinescope-navbar">
                {navLinks.map((link) => (
                  <Nav.Link href={link.href} key={link.href}>
                    {link.label}
                  </Nav.Link>
                ))}
              </Navbar.Collapse>
            </Nav>
            {showSearchBox && (
              <Nav className="mx-auto">
                <Nav.Item>
                  <Search
                    filterMethod={filterMethod}
                    setFilterMethod={setFilterMethod}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    newSearch={newSearch}
                  />
                </Nav.Item>
              </Nav>
            )}
            <Nav className="ms-auto">
            {userData ? (
                <Nav.Item>
                  {/* Display welcome message */}
                  <span>Welcome,<br /> {userData.username}!</span>
                </Nav.Item>                
              ) : (                
                loginstatus && (
                  <Nav.Item>
                    {/* Display Sign In link */}
                    <Nav.Link onClick={handleSignInShow}>Sign In</Nav.Link>
                  </Nav.Item>
                )
              )}
              {showDropdownMenu && (
                <NavDropdown align="end" title={<i className="bi bi-person-circle" />}>
                  {dropdownItems.map((item) => (
                    <NavDropdown.Item href={item.href} key={item.href}>
                      {item.label}
                    </NavDropdown.Item>
                  ))}
                  <NavDropdown.Divider />
                  <NavDropdown.Item  onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Nav>
        </Container>
      </Navbar>

      <SignInModal show={showSignInModal} handleClose={handleSignInClose} />
    </>
  );
};

export default Header;
