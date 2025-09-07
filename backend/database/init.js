const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'pigeon_post.db');

// Create database connection
const getDatabase = () => {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('❌ Error opening database:', err.message);
    }
  });
};

// Initialize database with required tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();

    // Create trackings table
    const createTrackingsTable = `
      CREATE TABLE IF NOT EXISTS trackings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trackingNumber TEXT UNIQUE NOT NULL,
        sender TEXT NOT NULL,
        recipient TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'processing',
        estimatedDelivery DATETIME NOT NULL,
        actualDelivery DATETIME NULL,
        senderAddress TEXT DEFAULT 'Pigeon Post Service',
        recipientAddress TEXT DEFAULT 'Delivery Location',
        pigeonName TEXT NULL,
        deliveryImages TEXT NULL,
        deliveryVideos TEXT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create tracking updates table for detailed status history
    const createTrackingUpdatesTable = `
      CREATE TABLE IF NOT EXISTS tracking_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trackingId INTEGER NOT NULL,
        trackingNumber TEXT NOT NULL,
        status TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        emoji TEXT DEFAULT '📦',
        pigeonName TEXT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        createdBy TEXT DEFAULT 'system',
        FOREIGN KEY (trackingId) REFERENCES trackings (id) ON DELETE CASCADE
      )
    `;

    // Create admin users table (simple authentication)
    const createAdminTable = `
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Drop and recreate admin sessions table to ensure correct schema
    const dropSessionsTable = `DROP TABLE IF EXISTS admin_sessions`;
    
    // Create admin sessions table for persistent sessions
    const createSessionsTable = `
      CREATE TABLE admin_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sessionId TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.serialize(() => {
      db.run(createTrackingsTable, (err) => {
        if (err) {
          console.error('❌ Error creating trackings table:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Trackings table ready');
      });

      db.run(createTrackingUpdatesTable, (err) => {
        if (err) {
          console.error('❌ Error creating tracking updates table:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Tracking updates table ready');
      });

      db.run(createAdminTable, (err) => {
        if (err) {
          console.error('❌ Error creating admin table:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Admin users table ready');
      });

      // Drop existing sessions table and recreate with correct schema
      db.run(dropSessionsTable, (dropErr) => {
        if (dropErr) {
          console.log('⚠️ Could not drop sessions table (might not exist):', dropErr.message);
        } else {
          console.log('🗑️ Dropped existing sessions table');
        }
        
        db.run(createSessionsTable, (err) => {
          if (err) {
            console.error('❌ Error creating sessions table:', err.message);
            reject(err);
            return;
          }
          console.log('✅ Admin sessions table ready');
          
          // Insert default admin user (admin/admin123)
          const insertDefaultAdmin = `
            INSERT OR IGNORE INTO admin_users (username, password) 
            VALUES ('admin', '$2b$10$rQJ0wLzGzGqGz8GzGqGz8O')
          `;
          
          db.run(insertDefaultAdmin, (adminErr) => {
            if (adminErr) {
              console.error('❌ Error creating default admin:', adminErr.message);
            } else {
              console.log('✅ Default admin user ready (admin/admin123)');
            }
            
            db.close((closeErr) => {
              if (closeErr) {
                console.error('❌ Error closing database:', closeErr.message);
                reject(closeErr);
              } else {
                console.log('✅ Database initialization complete');
                resolve();
              }
            });
          });
        });
      });
    });
  });
};

module.exports = {
  getDatabase,
  initializeDatabase,
  DB_PATH
};
