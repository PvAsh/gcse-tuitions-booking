const bcrypt = require('bcryptjs');
const { getContainer } = require('../shared/database');
const { generateToken } = require('../shared/auth');

module.exports = async function (context, req) {
  if (req.method !== 'POST') {
    context.res = { status: 405, body: { error: 'Method not allowed' } };
    return;
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    context.res = { status: 400, body: { error: 'Email and password are required' } };
    return;
  }

  try {
    const container = await getContainer('users');
    const { resources } = await container.items
      .query({ query: 'SELECT * FROM c WHERE c.email = @email', parameters: [{ name: '@email', value: email }] })
      .fetchAll();

    const user = resources[0];
    if (!user) {
      context.res = { status: 401, body: { error: 'Invalid email or password' } };
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      context.res = { status: 401, body: { error: 'Invalid email or password' } };
      return;
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;
    const secret = (process.env.JWT_SECRET || 'dev-secret-change-in-production').trim();

    context.res = {
      headers: { 'Content-Type': 'application/json' },
      body: { user: safeUser, token, debugSecretHash: require('crypto').createHash('md5').update(secret).digest('hex') },
    };
  } catch (err) {
    context.log.error('Login error:', err.message);
    context.res = { status: 500, body: { error: 'Internal server error' } };
  }
};
