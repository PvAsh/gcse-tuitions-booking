import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('gcse_bookings') || '[]');
    setBookings(stored);
  }, []);

  const saveBookings = (updated) => {
    setBookings(updated);
    localStorage.setItem('gcse_bookings', JSON.stringify(updated));
  };

  const createBooking = (bookingData) => {
    if (!user) return { success: false, message: 'Please log in to book' };
    const newBooking = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      ...bookingData,
    };
    const updated = [...bookings, newBooking];
    saveBookings(updated);
    return { success: true, booking: newBooking };
  };

  const cancelBooking = (bookingId) => {
    const updated = bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    );
    saveBookings(updated);
  };

  const getUserBookings = () => {
    if (!user) return [];
    return bookings.filter(b => b.userId === user.id);
  };

  const getAllBookings = () => bookings;

  const getBookingsByDate = (date) => {
    return bookings.filter(b => b.date === date && b.status !== 'cancelled');
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      createBooking,
      cancelBooking,
      getUserBookings,
      getAllBookings,
      getBookingsByDate,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBookings must be used within BookingProvider');
  return context;
}
