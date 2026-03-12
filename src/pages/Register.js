import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'student',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: form.role,
    });
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <p className="auth-subtitle">Create an account to book tuition sessions.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="John Smith" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label>Phone (optional)</label>
            <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="07123 456789" />
          </div>
          <div className="form-group">
            <label>I am a...</label>
            <div className="radio-group">
              <label className={`radio-card ${form.role === 'student' ? 'selected' : ''}`}>
                <input type="radio" name="role" value="student" checked={form.role === 'student'} onChange={e => update('role', e.target.value)} />
                <span>Student</span>
              </label>
              <label className={`radio-card ${form.role === 'parent' ? 'selected' : ''}`}>
                <input type="radio" name="role" value="parent" checked={form.role === 'parent'} onChange={e => update('role', e.target.value)} />
                <span>Parent</span>
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min 6 characters" required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Confirm password" required />
          </div>
          <button type="submit" className="btn-primary btn-full">Create Account</button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
