import { useState, useMemo } from 'react';
import { useBookings } from '../context/BookingContext';
import { FaCalendarAlt, FaUsers, FaPoundSign, FaChartBar } from 'react-icons/fa';
import './Admin.css';

export default function Admin() {
  const { getAllBookings, cancelBooking } = useBookings();
  const [tab, setTab] = useState('overview');
  const [filter, setFilter] = useState('all');

  const allBookings = getAllBookings();

  const stats = useMemo(() => {
    const confirmed = allBookings.filter(b => b.status === 'confirmed');
    const revenue = confirmed.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const uniqueStudents = new Set(allBookings.map(b => b.userId)).size;
    return {
      total: allBookings.length,
      confirmed: confirmed.length,
      cancelled: allBookings.filter(b => b.status === 'cancelled').length,
      revenue,
      students: uniqueStudents,
    };
  }, [allBookings]);

  const filteredBookings = useMemo(() => {
    if (filter === 'all') return allBookings;
    return allBookings.filter(b => b.status === filter);
  }, [allBookings, filter]);

  const sortedBookings = [...filteredBookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="admin">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage bookings, view analytics, and oversee operations</p>
      </div>
      <div className="section-container">
        <div className="dashboard-tabs">
          <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>
            <FaChartBar /> Overview
          </button>
          <button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>
            <FaCalendarAlt /> All Bookings
          </button>
        </div>

        {tab === 'overview' && (
          <div className="admin-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <FaCalendarAlt className="stat-icon" />
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Bookings</div>
              </div>
              <div className="stat-card">
                <FaCalendarAlt className="stat-icon confirmed" />
                <div className="stat-value">{stats.confirmed}</div>
                <div className="stat-label">Confirmed</div>
              </div>
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <div className="stat-value">{stats.students}</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-card">
                <FaPoundSign className="stat-icon revenue" />
                <div className="stat-value">£{stats.revenue.toFixed(2)}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>

            <h3>Recent Bookings</h3>
            {sortedBookings.slice(0, 5).length === 0 ? (
              <p className="no-data">No bookings yet.</p>
            ) : (
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Subject</th>
                    <th>Tutor</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBookings.slice(0, 5).map(b => (
                    <tr key={b.id}>
                      <td>{b.userName}</td>
                      <td>{b.subjectName}</td>
                      <td>{b.tutorName}</td>
                      <td>{new Date(b.date).toLocaleDateString('en-GB')}</td>
                      <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'bookings' && (
          <div className="admin-bookings">
            <div className="filter-bar">
              {['all', 'confirmed', 'cancelled'].map(f => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'all' ? `(${allBookings.length})` : `(${allBookings.filter(b => b.status === f).length})`}
                </button>
              ))}
            </div>

            {sortedBookings.length === 0 ? (
              <p className="no-data">No bookings found.</p>
            ) : (
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Tutor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBookings.map(b => (
                    <tr key={b.id}>
                      <td>#{String(b.id).slice(-6)}</td>
                      <td>{b.userName}</td>
                      <td>{b.userEmail}</td>
                      <td>{b.subjectName}</td>
                      <td>{b.tutorName}</td>
                      <td>{new Date(b.date).toLocaleDateString('en-GB')}</td>
                      <td>{b.time}</td>
                      <td>£{b.totalPrice?.toFixed(2)}</td>
                      <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                      <td>
                        {b.status === 'confirmed' && (
                          <button className="btn-cancel-sm" onClick={() => cancelBooking(b.id)}>Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
