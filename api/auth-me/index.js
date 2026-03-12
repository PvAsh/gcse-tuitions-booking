const { requireAuth } = require('../shared/auth');

module.exports = async function (context, req) {
  if (req.method !== 'GET') {
    context.res = { status: 405, body: { error: 'Method not allowed' } };
    return;
  }

  const result = requireAuth(req);
  if (result.status) {
    context.res = result;
    return;
  }

  context.res = {
    headers: { 'Content-Type': 'application/json' },
    body: { user: result.user },
  };
};
