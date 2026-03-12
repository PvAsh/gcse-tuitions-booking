const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('gcse_token');
}

function setToken(token) {
  localStorage.setItem('gcse_token', token);
}

function clearToken() {
  localStorage.removeItem('gcse_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = data?.error || `Request failed (${res.status})`;
    throw new Error(error);
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),

  // Bookings
  getBookings: () => request('/bookings'),
  createBooking: (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  cancelBooking: (id) => request(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'cancelled' }) }),
};

export { getToken, setToken, clearToken };
