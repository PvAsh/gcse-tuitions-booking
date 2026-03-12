const jwt = require('jsonwebtoken');

const JWT_SECRET = (process.env.JWT_SECRET || 'dev-secret-change-in-production').trim();

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function verifyToken(req) {
  const headers = req.headers || {};
  const authHeader = headers['x-auth-token'];
  if (!authHeader) return null;

  try {
    return jwt.verify(authHeader.trim(), JWT_SECRET);
  } catch (err) {
    req._authError = err.message;
    return null;
  }
}

function requireAuth(req) {
  const user = verifyToken(req);
  if (!user) {
    return { status: 401, body: { error: 'Unauthorized' } };
  }
  return { user };
}

function requireAdmin(req) {
  const result = requireAuth(req);
  if (result.status) return result;
  if (result.user.role !== 'admin') {
    return { status: 403, body: { error: 'Forbidden' } };
  }
  return result;
}

module.exports = { generateToken, verifyToken, requireAuth, requireAdmin };
