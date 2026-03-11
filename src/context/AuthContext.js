import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('gcse_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('gcse_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, message: 'Invalid email or password' };
    const { password: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem('gcse_user', JSON.stringify(userData));
    return { success: true };
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('gcse_users') || '[]');
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }
    const newUser = {
      id: Date.now(),
      ...userData,
      role: userData.role || 'student',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('gcse_users', JSON.stringify(users));
    const { password: _, ...safe } = newUser;
    setUser(safe);
    localStorage.setItem('gcse_user', JSON.stringify(safe));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gcse_user');
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('gcse_user', JSON.stringify(updated));
    const users = JSON.parse(localStorage.getItem('gcse_users') || '[]');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem('gcse_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
