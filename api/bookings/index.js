const { getContainer } = require('../shared/database');
const { requireAuth } = require('../shared/auth');

module.exports = async function (context, req) {
  context.log('Headers:', JSON.stringify(req.headers));
  context.log('JWT_SECRET set:', !!process.env.JWT_SECRET, 'length:', (process.env.JWT_SECRET || '').length);

  const result = requireAuth(req);
  if (result.status) {
    const secret = (process.env.JWT_SECRET || 'dev-secret-change-in-production').trim();
    const authHeader = req.headers.authorization || req.headers.Authorization || '';
    const tokenStr = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    let testVerify = null;
    try { const jwt = require('jsonwebtoken'); testVerify = jwt.decode(tokenStr); } catch(e) { testVerify = e.message; }
    context.res = { status: result.status, headers: { 'Content-Type': 'application/json' }, body: { error: result.body.error, debug: { secretHash: require('crypto').createHash('md5').update(secret).digest('hex'), tokenFirst50: tokenStr.substring(0, 50), decoded: testVerify, authError: req._authError } } };
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
