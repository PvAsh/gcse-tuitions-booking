import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Subjects from './pages/Subjects';
import Tutors from './pages/Tutors';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import './App.css';

function seedAdminUser() {
  const users = JSON.parse(localStorage.getItem('gcse_users') || '[]');
  if (!users.find(u => u.email === 'admin@gcsetuitions.co.uk')) {
    users.push({
      id: 1,
      name: 'Admin',
      email: 'admin@gcsetuitions.co.uk',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('gcse_users', JSON.stringify(users));
  }
}
seedAdminUser();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/tutors" element={<Tutors />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
