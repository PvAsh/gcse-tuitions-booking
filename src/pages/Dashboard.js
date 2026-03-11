import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { FaCalendarAlt, FaTimes, FaUser, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Dashboard.css';

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const { getUserBookings, cancelBooking } = useBookings();
  const [tab, setTab] = useState('bookings');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const bookings = getUserBookings();
  const upcoming = bookings
    .filter(b => b.status === 'confirmed' && new Date(b.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = bookings
    .filter(b => b.status !== 'confirmed' || new Date(b.date) < new Date())
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(id);
      toast.info('Booking cancelled');
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    toast.success('Profile updated');
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>My Dashboard</h1>
        <p>Welcome back, {user?.name}</p>
      </div>
      <div className="section-container">
        <div className="dashboard-tabs">
          <button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>
            <FaCalendarAlt /> My Bookings
          </button>
          <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>
            <FaUser /> Profile
          </button>
        </div>

        {tab === 'bookings' && (
          <div className="bookings-section">
            <div className="bookings-header">
              <h2>Upcoming Sessions ({upcoming.length})</h2>
              <Link to="/booking" className="btn-primary">Book New Session</Link>
            </div>

            {upcoming.length === 0 ? (
              <div className="empty-state">
                <FaCalendarAlt className="empty-icon" />
                <p>No upcoming sessions</p>
                <Link to="/booking" className="btn-outline">Book Your First Session</Link>
              </div>
            ) : (
              <div className="booking-cards">
                {upcoming.map(b => (
                  <div key={b.id} className="booking-card">
                    <div className="booking-card-header">
                      <h3>{b.subjectName}</h3>
                      <span className={`status-badge ${b.status}`}>{b.status}</span>
                    </div>
                    <p className="booking-tutor">{b.tutorName}</p>
                    <div className="booking-card-details">
                      <span>{new Date(b.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      <span>{b.time} ({b.duration} mins)</span>
                      <span>£{b.totalPrice?.toFixed(2)}</span>
                    </div>
                    <button className="btn-cancel" onClick={() => handleCancel(b.id)}>
                      <FaTimes /> Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}

            {past.length > 0 && (
              <>
                <h2 className="past-heading">Past / Cancelled Sessions ({past.length})</h2>
                <div className="booking-cards">
                  {past.map(b => (
                    <div key={b.id} className={`booking-card ${b.status === 'cancelled' ? 'cancelled' : 'past'}`}>
                      <div className="booking-card-header">
                        <h3>{b.subjectName}</h3>
                        <span className={`status-badge ${b.status}`}>{b.status}</span>
                      </div>
                      <p className="booking-tutor">{b.tutorName}</p>
                      <div className="booking-card-details">
                        <span>{new Date(b.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                        <span>{b.time} ({b.duration} mins)</span>
                        <span>£{b.totalPrice?.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div className="profile-section">
            <h2>My Profile</h2>
            <form onSubmit={handleProfileSave}>
              <div className="profile-info">
                <p><FaEnvelope /> {user?.email}</p>
                <p><FaUser /> Role: {user?.role}</p>
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="07123 456789"
                />
              </div>
              <button type="submit" className="btn-primary">Save Changes</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
