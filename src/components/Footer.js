import { Link } from 'react-router-dom';
import { FaGraduationCap, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-brand">
            <FaGraduationCap className="footer-icon" />
            <h3>GCSE Tuitions</h3>
          </div>
          <p>Helping students achieve their best GCSE results with expert one-to-one tuition.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/subjects">Subjects</Link>
          <Link to="/tutors">Our Tutors</Link>
          <Link to="/booking">Book a Session</Link>
          <Link to="/login">Student Login</Link>
        </div>

        <div className="footer-section">
          <h4>Subjects</h4>
          <Link to="/subjects">Mathematics</Link>
          <Link to="/subjects">English</Link>
          <Link to="/subjects">Sciences</Link>
          <Link to="/subjects">Humanities</Link>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <p><FaPhone /> 07718229814</p>
          <p><FaEnvelope /> info@gcsetuitions.co.uk</p>
          <p><FaMapMarkerAlt /> Watford, United Kingdom</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} GCSE Tuitions. All rights reserved.</p>
      </div>
    </footer>
  );
}
