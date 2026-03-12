const bcrypt = require('bcryptjs');
const { getContainer } = require('../shared/database');
const { generateToken } = require('../shared/auth');

module.exports = async function (context, req) {
  if (req.method !== 'POST') {
    context.res = { status: 405, body: { error: 'Method not allowed' } };
    return;
  }

  const { name, email, password, phone, role } = req.body || {};

  if (!name || !email || !password) {
    context.res = { status: 400, body: { error: 'Name, email and password are required' } };
    return;
  }

  if (password.length < 6) {
    context.res = { status: 400, body: { error: 'Password must be at least 6 characters' } };
    return;
  }

  try {
    const container = await getContainer('users');

    // Check if email already exists
    const { resources } = await container.items
      .query({ query: 'SELECT * FROM c WHERE c.email = @email', parameters: [{ name: '@email', value: email }] })
      .fetchAll();

    if (resources.length > 0) {
      context.res = { status: 409, body: { error: 'Email already registered' } };
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: `user_${Date.now()}`,
      partitionKey: 'user',
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      role: role === 'parent' ? 'parent' : 'student',
      createdAt: new Date().toISOString(),
    };

    await container.items.create(user);

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;

    context.res = {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: { user: safeUser, token },
    };
  } catch (err) {
    context.log.error('Register error:', err.message);
    context.res = { status: 500, body: { error: 'Internal server error' } };
  }
};
