const express = require('express');
const { getDatabase } = require('../database/init');
const router = express.Router();

// Helper function to generate timeline
const generateTimeline = (estimatedDelivery, status) => {
  const now = new Date();
  const delivery = new Date(estimatedDelivery);
  const totalDuration = delivery - now;
  
  if (totalDuration <= 0) {
    // Already delivered or past due
    return [
      { stage: 'Message Received', time: new Date(now - 4 * 60 * 60 * 1000).toISOString(), completed: true },
      { stage: 'Pigeon Assigned', time: new Date(now - 3 * 60 * 60 * 1000).toISOString(), completed: true },
      { stage: 'In Flight', time: new Date(now - 2 * 60 * 60 * 1000).toISOString(), completed: true },
      { stage: 'Approaching Destination', time: new Date(now - 1 * 60 * 60 * 1000).toISOString(), completed: true },
      { stage: 'Delivered', time: delivery.toISOString(), completed: true }
    ];
  }

  const stages = [
    { stage: 'Message Received', offset: 0, completed: false },
    { stage: 'Pigeon Assigned', offset: 0.2, completed: false },
    { stage: 'In Flight', offset: 0.4, completed: false },
    { stage: 'Approaching Destination', offset: 0.8, completed: false },
    { stage: 'Delivered', offset: 1, completed: false }
  ];

  return stages.map((stage, index) => {
    const stageTime = new Date(now.getTime() + (totalDuration * stage.offset));
    let completed = false;
    
    // Mark stages as completed based on current status and time
    switch (status) {
      case 'processing':
        completed = index === 0;
        break;
      case 'assigned':
        completed = index <= 1;
        break;
      case 'in-transit':
        completed = index <= 2;
        break;
      case 'approaching':
        completed = index <= 3;
        break;
      case 'delivered':
        completed = true;
        break;
      default:
        completed = stageTime <= now;
    }

    return {
      stage: stage.stage,
      time: stageTime.toISOString(),
      completed
    };
  });
};

// Update tracking status based on time
const updateTrackingStatus = (tracking) => {
  const now = new Date();
  const delivery = new Date(tracking.estimatedDelivery);
  const timeUntilDelivery = delivery - now;
  
  let newStatus = tracking.status;
  
  if (timeUntilDelivery <= 0) {
    newStatus = 'delivered';
  } else if (timeUntilDelivery <= 30 * 60 * 1000) { // 30 minutes
    newStatus = 'approaching';
  } else if (timeUntilDelivery <= 2 * 60 * 60 * 1000) { // 2 hours
    newStatus = 'in-transit';
  } else if (timeUntilDelivery <= 4 * 60 * 60 * 1000) { // 4 hours
    newStatus = 'assigned';
  } else {
    newStatus = 'processing';
  }
  
  return newStatus;
};

// GET /api/tracking - Get all trackings (for admin)
router.get('/', (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT * FROM trackings ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Update statuses and timelines
    const updatedTrackings = rows.map(tracking => {
      const newStatus = updateTrackingStatus(tracking);
      const timeline = generateTimeline(tracking.estimatedDelivery, newStatus);
      
      return {
        ...tracking,
        status: newStatus,
        timeline: timeline
      };
    });
    
    res.json(updatedTrackings);
  });
  
  db.close();
});

// GET /api/tracking/:trackingNumber - Get specific tracking
router.get('/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;
  const db = getDatabase();
  
  db.get('SELECT * FROM trackings WHERE trackingNumber = ?', [trackingNumber], (err, row) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Tracking number not found' });
    }
    
    // Update status and generate timeline
    const newStatus = updateTrackingStatus(row);
    const timeline = generateTimeline(row.estimatedDelivery, newStatus);
    
    const updatedTracking = {
      ...row,
      status: newStatus,
      timeline: timeline
    };
    
    // Update status in database if it changed
    if (newStatus !== row.status) {
      db.run('UPDATE trackings SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE trackingNumber = ?', 
        [newStatus, trackingNumber], (updateErr) => {
          if (updateErr) {
            console.error('Error updating status:', updateErr.message);
          }
        });
    }
    
    res.json(updatedTracking);
  });
  
  db.close();
});

// POST /api/tracking - Create new tracking (admin only)
router.post('/', (req, res) => {
  const { sender, recipient, message, estimatedDelivery } = req.body;
  
  if (!sender || !recipient || !message || !estimatedDelivery) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Generate tracking number
  const trackingNumber = 'PPS' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
  
  const db = getDatabase();
  
  const insertTracking = `
    INSERT INTO trackings (trackingNumber, sender, recipient, message, estimatedDelivery)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(insertTracking, [trackingNumber, sender, recipient, message, estimatedDelivery], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to create tracking' });
    }
    
    // Get the created tracking with timeline
    db.get('SELECT * FROM trackings WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      
      const status = updateTrackingStatus(row);
      const timeline = generateTimeline(row.estimatedDelivery, status);
      
      const createdTracking = {
        ...row,
        status,
        timeline
      };
      
      res.status(201).json(createdTracking);
    });
  });
  
  db.close();
});

// PUT /api/tracking/:trackingNumber - Update tracking (admin only)
router.put('/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;
  const { sender, recipient, message, estimatedDelivery, status } = req.body;
  
  const db = getDatabase();
  
  const updateTracking = `
    UPDATE trackings 
    SET sender = ?, recipient = ?, message = ?, estimatedDelivery = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE trackingNumber = ?
  `;
  
  db.run(updateTracking, [sender, recipient, message, estimatedDelivery, status, trackingNumber], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to update tracking' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Tracking number not found' });
    }
    
    // Get updated tracking
    db.get('SELECT * FROM trackings WHERE trackingNumber = ?', [trackingNumber], (err, row) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      
      const newStatus = updateTrackingStatus(row);
      const timeline = generateTimeline(row.estimatedDelivery, newStatus);
      
      const updatedTracking = {
        ...row,
        status: newStatus,
        timeline
      };
      
      res.json(updatedTracking);
    });
  });
  
  db.close();
});

// DELETE /api/tracking/:trackingNumber - Delete tracking (admin only)
router.delete('/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;
  const db = getDatabase();
  
  db.run('DELETE FROM trackings WHERE trackingNumber = ?', [trackingNumber], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to delete tracking' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Tracking number not found' });
    }
    
    res.json({ message: 'Tracking deleted successfully' });
  });
  
  db.close();
});

module.exports = router;
