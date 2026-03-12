const bcrypt = require('bcryptjs');
const { getContainer } = require('../shared/database');

// Run once to seed the admin user into Cosmos DB
module.exports = async function (context, req) {
  if (req.method !== 'POST') {
    context.res = { status: 405, body: { error: 'Method not allowed' } };
    return;
  }

  const seedKey = req.headers['x-seed-key'];
  if (seedKey !== process.env.SEED_KEY) {
    context.res = { status: 403, body: { error: 'Invalid seed key' } };
    return;
  }

  try {
    const container = await getContainer('users');

    const { resources } = await container.items
      .query({ query: 'SELECT * FROM c WHERE c.email = @email', parameters: [{ name: '@email', value: 'admin@gcsetuitions.co.uk' }] })
      .fetchAll();

    if (resources.length > 0) {
      context.res = { body: { message: 'Admin user already exists' } };
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = {
      id: 'user_admin',
      partitionKey: 'user',
      name: 'Admin',
      email: 'admin@gcsetuitions.co.uk',
      password: hashedPassword,
      phone: '',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };

    await container.items.create(admin);

    context.res = {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'Admin user created' },
    };
  } catch (err) {
    context.log.error('Seed error:', err.message);
    context.res = { status: 500, body: { error: 'Internal server error' } };
  }
};
