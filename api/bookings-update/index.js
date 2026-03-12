const { getContainer } = require('../shared/database');
const { requireAuth } = require('../shared/auth');

module.exports = async function (context, req) {
  const result = requireAuth(req);
  if (result.status) {
    context.res = result;
    return;
  }
  const user = result.user;

  if (req.method !== 'PATCH') {
    context.res = { status: 405, body: { error: 'Method not allowed' } };
    return;
  }

  const bookingId = context.bindingData.id;
  const { status } = req.body || {};

  if (status !== 'cancelled') {
    context.res = { status: 400, body: { error: 'Only cancellation is supported' } };
    return;
  }

  try {
    const container = await getContainer('bookings');
    const { resource: booking } = await container.item(bookingId, 'booking').read();

    if (!booking) {
      context.res = { status: 404, body: { error: 'Booking not found' } };
      return;
    }

    // Only the booking owner or an admin can cancel
    if (booking.userId !== user.id && user.role !== 'admin') {
      context.res = { status: 403, body: { error: 'Forbidden' } };
      return;
    }

    booking.status = 'cancelled';
    await container.item(bookingId, 'booking').replace(booking);

    context.res = {
      headers: { 'Content-Type': 'application/json' },
      body: booking,
    };
  } catch (err) {
    context.log.error('Booking update error:', err.message);
    context.res = { status: 500, body: { error: 'Internal server error' } };
  }
};
