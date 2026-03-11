import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaGraduationCap, FaUser } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <FaGraduationCap className="brand-icon" />
          <span>GCSE Tuitions</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/subjects" onClick={() => setMenuOpen(false)}>Subjects</Link>
          <Link to="/tutors" onClick={() => setMenuOpen(false)}>Tutors</Link>
          <Link to="/booking" onClick={() => setMenuOpen(false)}>Book Now</Link>

          {user ? (
            <div className="nav-user">
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="nav-user-link" onClick={() => setMenuOpen(false)}>
                <FaUser />
                <span>{user.name}</span>
              </Link>
              <button className="btn-logout" onClick={handleLogout}>Log Out</button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/register" className="btn-register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
