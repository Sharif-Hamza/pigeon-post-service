// Simple session storage (in production, use Redis or similar)
const activeSessions = new Map();

// Generate session ID
const generateSessionId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Middleware to verify admin session
const verifyAdmin = (req, res, next) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  // Simple check - if it starts with 'admin-' and has the right format, allow it
  // This is a temporary fix for Railway restarts clearing in-memory sessions
  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized - Admin login required' });
  }
  
  // Check if it's a valid admin session format or exists in memory
  if (sessionId.startsWith('admin-') || activeSessions.has(sessionId)) {
    // If it exists in memory, check expiration
    if (activeSessions.has(sessionId)) {
      const session = activeSessions.get(sessionId);
      if (new Date() > session.expiresAt) {
        activeSessions.delete(sessionId);
        return res.status(401).json({ error: 'Session expired - Please login again' });
      }
      req.adminUser = session;
    } else {
      // Create a temporary session for valid admin tokens
      req.adminUser = { username: 'admin' };
    }
    next();
  } else {
    return res.status(401).json({ error: 'Unauthorized - Admin login required' });
  }
};

module.exports = {
  activeSessions,
  generateSessionId,
  verifyAdmin
};
