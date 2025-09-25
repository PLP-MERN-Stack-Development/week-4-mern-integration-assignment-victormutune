import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">MERN Blog</Link>
      <div className="nav-links">
        <Link to="/posts">Posts</Link>
        <Link to="/categories">Categories</Link>
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <Link to="/create">New Post</Link>
            <Link to="/logout">Logout</Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
