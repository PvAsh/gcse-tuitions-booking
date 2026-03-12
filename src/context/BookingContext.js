import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      return;
    }
    try {
      const data = await api.getBookings();
      setBookings(data);
    } catch {
      setBookings([]);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (bookingData) => {
    if (!user) return { success: false, message: 'Please log in to book' };
    try {
      const booking = await api.createBooking(bookingData);
      setBookings(prev => [booking, ...prev]);
      return { success: true, booking };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const updated = await api.cancelBooking(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
    } catch {
      // silent fail, could add toast here
    }
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
      refreshBookings: fetchBookings,
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
