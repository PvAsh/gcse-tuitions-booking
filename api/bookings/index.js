const { getContainer } = require('../shared/database');
const { requireAuth } = require('../shared/auth');

module.exports = async function (context, req) {
  const result = requireAuth(req);
  if (result.status) {
    context.res = result;
    return;
  }
  const user = result.user;

  try {
    const container = await getContainer('bookings');

    if (req.method === 'GET') {
      const isAdmin = user.role === 'admin';
      const query = isAdmin
        ? 'SELECT * FROM c ORDER BY c.createdAt DESC'
        : {
            query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC',
            parameters: [{ name: '@userId', value: user.id }],
          };

      const { resources } = await container.items.query(query).fetchAll();

      context.res = {
        headers: { 'Content-Type': 'application/json' },
        body: resources,
      };
      return;
    }

    if (req.method === 'POST') {
      const { subjectId, subjectName, tutorId, tutorName, level, date, time, duration, notes, totalPrice } = req.body || {};

      if (!subjectId || !tutorId || !date || !time) {
        context.res = { status: 400, body: { error: 'Missing required booking fields' } };
        return;
      }

      const booking = {
        id: `booking_${Date.now()}`,
        partitionKey: 'booking',
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        subjectId,
        subjectName,
        tutorId,
        tutorName,
        level,
        date,
        time,
        duration: Number(duration) || 60,
        notes: notes || '',
        totalPrice: Number(totalPrice) || 0,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      await container.items.create(booking);

      context.res = {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: booking,
      };
      return;
    }

    context.res = { status: 405, body: { error: 'Method not allowed' } };
  } catch (err) {
    context.log.error('Bookings error:', err.message);
    context.res = { status: 500, body: { error: 'Internal server error' } };
  }
};
