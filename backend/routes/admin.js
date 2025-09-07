const express = require('express');
const { getDatabase } = require('../database/init');
const router = express.Router();

// Simple session storage (in production, use Redis or similar)
const activeSessions = new Map();

// Generate session ID
const generateSessionId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// POST /api/admin/login - Admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  // Simple authentication (in production, use proper password hashing)
  if (username === 'admin' && password === 'admin123') {
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    activeSessions.set(sessionId, {
      username,
      expiresAt
    });
    
    res.json({
      success: true,
      sessionId,
      expiresAt,
      message: 'Login successful'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// POST /api/admin/logout - Admin logout
router.post('/logout', (req, res) => {
  const { sessionId } = req.body;
  
  if (sessionId && activeSessions.has(sessionId)) {
    activeSessions.delete(sessionId);
  }
  
  res.json({ message: 'Logged out successfully' });
});

// GET /api/admin/verify - Verify admin session
router.get('/verify', (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId || !activeSessions.has(sessionId)) {
    return res.status(401).json({ error: 'Invalid session' });
  }
  
  const session = activeSessions.get(sessionId);
  if (new Date() > session.expiresAt) {
    activeSessions.delete(sessionId);
    return res.status(401).json({ error: 'Session expired' });
  }
  
  res.json({ 
    valid: true, 
    username: session.username,
    expiresAt: session.expiresAt
  });
});

// Middleware to verify admin session
const verifyAdmin = (req, res, next) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId || !activeSessions.has(sessionId)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const session = activeSessions.get(sessionId);
  if (new Date() > session.expiresAt) {
    activeSessions.delete(sessionId);
    return res.status(401).json({ error: 'Session expired' });
  }
  
  req.adminUser = session;
  next();
};

// GET /api/admin/stats - Get admin statistics
router.get('/stats', verifyAdmin, (req, res) => {
  const db = getDatabase();
  
  const queries = [
    'SELECT COUNT(*) as total FROM trackings',
    'SELECT COUNT(*) as processing FROM trackings WHERE status = "processing"',
    'SELECT COUNT(*) as assigned FROM trackings WHERE status = "assigned"',
    'SELECT COUNT(*) as inTransit FROM trackings WHERE status = "in-transit"',
    'SELECT COUNT(*) as approaching FROM trackings WHERE status = "approaching"',
    'SELECT COUNT(*) as delivered FROM trackings WHERE status = "delivered"'
  ];
  
  const stats = {};
  let completed = 0;
  
  queries.forEach((query, index) => {
    db.get(query, [], (err, row) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      
      const key = Object.keys(row)[0];
      stats[key] = row[key];
      
      completed++;
      if (completed === queries.length) {
        res.json(stats);
        db.close();
      }
    });
  });
});

// POST /api/admin/force-update - Force status update for all trackings
router.post('/force-update', verifyAdmin, (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT * FROM trackings', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    let updated = 0;
    let toUpdate = rows.length;
    
    if (toUpdate === 0) {
      return res.json({ message: 'No trackings to update', updated: 0 });
    }
    
    rows.forEach(tracking => {
      const now = new Date();
      const delivery = new Date(tracking.estimatedDelivery);
      const timeUntilDelivery = delivery - now;
      
      let newStatus = tracking.status;
      
      if (timeUntilDelivery <= 0) {
        newStatus = 'delivered';
      } else if (timeUntilDelivery <= 30 * 60 * 1000) {
        newStatus = 'approaching';
      } else if (timeUntilDelivery <= 2 * 60 * 60 * 1000) {
        newStatus = 'in-transit';
      } else if (timeUntilDelivery <= 4 * 60 * 60 * 1000) {
        newStatus = 'assigned';
      } else {
        newStatus = 'processing';
      }
      
      if (newStatus !== tracking.status) {
        db.run('UPDATE trackings SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', 
          [newStatus, tracking.id], (updateErr) => {
            if (!updateErr) updated++;
            
            toUpdate--;
            if (toUpdate === 0) {
              res.json({ message: 'Status update complete', updated });
              db.close();
            }
          });
      } else {
        toUpdate--;
        if (toUpdate === 0) {
          res.json({ message: 'Status update complete', updated });
          db.close();
        }
      }
    });
  });
});

// DELETE /api/admin/clear-data - Clear all tracking data (debug)
router.delete('/clear-data', verifyAdmin, (req, res) => {
  const db = getDatabase();
  
  db.run('DELETE FROM trackings', [], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to clear data' });
    }
    
    res.json({ 
      message: 'All tracking data cleared', 
      deletedCount: this.changes 
    });
  });
  
  db.close();
});

module.exports = router;
