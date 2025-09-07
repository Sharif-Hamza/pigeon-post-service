const { getDatabase } = require('../database/init');

// Generate session ID
const generateSessionId = () => {
  return 'admin-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2);
};

// Create session in database
const createSession = (sessionId, username, expiresAt) => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.run(
      'INSERT OR REPLACE INTO admin_sessions (sessionId, username, expiresAt) VALUES (?, ?, ?)',
      [sessionId, username, expiresAt.toISOString()],
      function(err) {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

// Get session from database
const getSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.get(
      'SELECT * FROM admin_sessions WHERE sessionId = ? AND expiresAt > datetime("now")',
      [sessionId],
      (err, row) => {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

// Delete session from database
const deleteSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.run(
      'DELETE FROM admin_sessions WHERE sessionId = ?',
      [sessionId],
      function(err) {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

// Clean up expired sessions
const cleanupExpiredSessions = () => {
  const db = getDatabase();
  db.run('DELETE FROM admin_sessions WHERE expiresAt <= datetime("now")', (err) => {
    db.close();
    if (err) {
      console.error('Error cleaning up expired sessions:', err);
    }
  });
};

// Middleware to verify admin session using database
const verifyAdmin = async (req, res, next) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized - Admin login required' });
  }
  
  try {
    const session = await getSession(sessionId);
    if (session) {
      req.adminUser = { username: session.username };
      next();
    } else {
      return res.status(401).json({ error: 'Invalid or expired session - Please login again' });
    }
  } catch (error) {
    console.error('Session verification error:', error);
    return res.status(401).json({ error: 'Session verification failed' });
  }
};

// Clean up expired sessions every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

module.exports = {
  generateSessionId,
  createSession,
  getSession,
  deleteSession,
  verifyAdmin
};
