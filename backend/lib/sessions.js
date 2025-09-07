// Simple session storage (in production, use Redis or similar)
const activeSessions = new Map();

// Generate session ID
const generateSessionId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Middleware to verify admin session
const verifyAdmin = (req, res, next) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId || !activeSessions.has(sessionId)) {
    return res.status(401).json({ error: 'Unauthorized - Admin login required' });
  }
  
  const session = activeSessions.get(sessionId);
  if (new Date() > session.expiresAt) {
    activeSessions.delete(sessionId);
    return res.status(401).json({ error: 'Session expired - Please login again' });
  }
  
  req.adminUser = session;
  next();
};

module.exports = {
  activeSessions,
  generateSessionId,
  verifyAdmin
};
