// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useUserContext } from "../context/UserContext";
import "../pages_css/NavBar.css";

function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { userID, username, logout } = useUserContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <Link to={userID ? "/dashboard" : "/"}>
        <h2>Club Hub{username ? ` for ${username}` : ""}</h2>
      </Link>
      <div>
        {!userID && <Link to="/">Home</Link>}
        {userID && <Link to="/dashboard">Dashboard</Link>}
        {userID ? (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
        <button
          className="toggle-dark-mode"
          onClick={toggleDarkMode}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
