import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import subjects from '../data/subjects';
import tutors from '../data/tutors';
import timeSlots from '../data/timeSlots';
import { toast } from 'react-toastify';
import { FaCheckCircle } from 'react-icons/fa';
import './Booking.css';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking, getBookingsByDate } = useBookings();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    subjectId: searchParams.get('subject') || '',
    tutorId: searchParams.get('tutor') || '',
    level: '',
    date: '',
    time: '',
    duration: '60',
    notes: '',
  });
  const [confirmed, setConfirmed] = useState(false);

  const availableTutors = useMemo(() => {
    if (!form.subjectId) return tutors;
    return tutors.filter(t => t.subjects.includes(form.subjectId));
  }, [form.subjectId]);

  const selectedSubject = subjects.find(s => s.id === form.subjectId);
  const selectedTutor = tutors.find(t => t.id === Number(form.tutorId));

  const bookedSlots = useMemo(() => {
    if (!form.date) return [];
    return getBookingsByDate(form.date)
      .filter(b => String(b.tutorId) === String(form.tutorId))
      .map(b => b.time);
  }, [form.date, form.tutorId, getBookingsByDate]);

  const availableTimeSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));

  const totalPrice = useMemo(() => {
    const base = selectedTutor?.pricePerHour || selectedSubject?.pricePerHour || 35;
    return (base * Number(form.duration)) / 60;
  }, [selectedTutor, selectedSubject, form.duration]);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const canProceed = () => {
    if (step === 1) return form.subjectId && form.level;
    if (step === 2) return form.tutorId;
    if (step === 3) return form.date && form.time;
    return true;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.info('Please log in to complete your booking');
      navigate('/login');
      return;
    }

    const result = await createBooking({
      subjectId: form.subjectId,
      subjectName: selectedSubject?.name,
      tutorId: Number(form.tutorId),
      tutorName: selectedTutor?.name,
      level: form.level,
      date: form.date,
      time: form.time,
      duration: Number(form.duration),
      notes: form.notes,
      totalPrice,
    });

    if (result.success) {
      setConfirmed(true);
      toast.success('Booking confirmed!');
    } else {
      toast.error(result.message);
    }
  };

  if (confirmed) {
    return (
      <div className="booking-page">
        <div className="section-container">
          <div className="booking-confirmed">
            <FaCheckCircle className="confirmed-icon" />
            <h2>Booking Confirmed!</h2>
            <p>Your session has been booked successfully.</p>
            <div className="confirmed-details">
              <p><strong>Subject:</strong> {selectedSubject?.name} ({form.level})</p>
              <p><strong>Tutor:</strong> {selectedTutor?.name}</p>
              <p><strong>Date:</strong> {new Date(form.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p><strong>Time:</strong> {form.time} ({form.duration} mins)</p>
              <p><strong>Total:</strong> £{totalPrice.toFixed(2)}</p>
            </div>
            <div className="confirmed-actions">
              <button className="btn-primary" onClick={() => navigate('/dashboard')}>View My Bookings</button>
              <button className="btn-outline" onClick={() => { setConfirmed(false); setStep(1); setForm({ subjectId: '', tutorId: '', level: '', date: '', time: '', duration: '60', notes: '' }); }}>Book Another</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="page-header">
        <h1>Book a Session</h1>
        <p>Choose your subject, tutor, and preferred time slot</p>
      </div>
      <div className="section-container">
        <div className="booking-steps">
          {['Subject', 'Tutor', 'Schedule', 'Confirm'].map((label, i) => (
            <div key={label} className={`step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'completed' : ''}`}>
              <div className="step-number">{step > i + 1 ? '\u2713' : i + 1}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="booking-form">
          {step === 1 && (
            <div className="step-content">
              <h2>Select Subject & Level</h2>
              <div className="form-group">
                <label>Subject</label>
                <select value={form.subjectId} onChange={e => update('subjectId', e.target.value)}>
                  <option value="">-- Choose a subject --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (from £{s.pricePerHour}/hr)</option>
                  ))}
                </select>
              </div>
              {selectedSubject && (
                <div className="form-group">
                  <label>Level</label>
                  <div className="radio-group">
                    {selectedSubject.levels.map(lvl => (
                      <label key={lvl} className={`radio-card ${form.level === lvl ? 'selected' : ''}`}>
                        <input type="radio" name="level" value={lvl} checked={form.level === lvl} onChange={e => update('level', e.target.value)} />
                        <span>{lvl}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h2>Choose Your Tutor</h2>
              <div className="tutor-selection">
                {availableTutors.map(t => (
                  <label key={t.id} className={`tutor-option ${Number(form.tutorId) === t.id ? 'selected' : ''}`}>
                    <input type="radio" name="tutor" value={t.id} checked={Number(form.tutorId) === t.id} onChange={e => update('tutorId', e.target.value)} />
                    <div className="tutor-option-initials">{t.initials}</div>
                    <div className="tutor-option-info">
                      <strong>{t.name}</strong>
                      <span>{t.qualifications}</span>
                      <span className="tutor-option-price">£{t.pricePerHour}/hr</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h2>Pick Date & Time</h2>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date} min={getMinDate()} onChange={e => update('date', e.target.value)} />
              </div>
              {form.date && (
                <>
                  <div className="form-group">
                    <label>Duration</label>
                    <div className="radio-group">
                      {[{ v: '60', l: '1 hour' }, { v: '90', l: '1.5 hours' }, { v: '120', l: '2 hours' }].map(d => (
                        <label key={d.v} className={`radio-card ${form.duration === d.v ? 'selected' : ''}`}>
                          <input type="radio" name="duration" value={d.v} checked={form.duration === d.v} onChange={e => update('duration', e.target.value)} />
                          <span>{d.l}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Time Slot</label>
                    <div className="time-slots">
                      {availableTimeSlots.length === 0 ? (
                        <p className="no-slots">No available slots for this date. Please try another date.</p>
                      ) : (
                        availableTimeSlots.map(slot => (
                          <button
                            key={slot}
                            type="button"
                            className={`time-slot ${form.time === slot ? 'selected' : ''}`}
                            onClick={() => update('time', slot)}
                          >
                            {slot}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={e => update('notes', e.target.value)}
                  placeholder="Any specific topics you'd like to cover?"
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-content">
              <h2>Confirm Your Booking</h2>
              <div className="booking-summary">
                <div className="summary-row">
                  <span>Subject</span>
                  <strong>{selectedSubject?.name} ({form.level})</strong>
                </div>
                <div className="summary-row">
                  <span>Tutor</span>
                  <strong>{selectedTutor?.name}</strong>
                </div>
                <div className="summary-row">
                  <span>Date</span>
                  <strong>{new Date(form.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </div>
                <div className="summary-row">
                  <span>Time</span>
                  <strong>{form.time} ({form.duration} mins)</strong>
                </div>
                {form.notes && (
                  <div className="summary-row">
                    <span>Notes</span>
                    <strong>{form.notes}</strong>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total Price</span>
                  <strong>£{totalPrice.toFixed(2)}</strong>
                </div>
              </div>
              {!user && (
                <p className="login-notice">You'll need to log in or sign up to complete this booking.</p>
              )}
            </div>
          )}

          <div className="booking-nav">
            {step > 1 && (
              <button className="btn-outline" onClick={() => setStep(step - 1)}>Back</button>
            )}
            {step < 4 ? (
              <button className="btn-primary" disabled={!canProceed()} onClick={() => setStep(step + 1)}>Continue</button>
            ) : (
              <button className="btn-primary" onClick={handleSubmit}>
                {user ? 'Confirm Booking' : 'Log In & Book'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
