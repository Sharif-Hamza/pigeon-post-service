# Pigeon Post Service - Backend API

A Node.js backend API for the Pigeon Post Service tracking application.

## Features

- **SQLite Database** - Lightweight, file-based database
- **RESTful API** - Full CRUD operations for tracking data
- **Admin Authentication** - Simple session-based auth
- **Automatic Status Updates** - Time-based tracking status progression
- **CORS Support** - Cross-origin requests enabled for frontend

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm

### Installation

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Start production server:
   ```bash
   npm start
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Admin Authentication
- `POST /api/admin/login` - Login with username/password
- `POST /api/admin/logout` - Logout and invalidate session
- `GET /api/admin/verify` - Verify current session

### Tracking Management
- `GET /api/tracking` - Get all trackings (admin only)
- `GET /api/tracking/:trackingNumber` - Get specific tracking (public)
- `POST /api/tracking` - Create new tracking (admin only)
- `PUT /api/tracking/:trackingNumber` - Update tracking (admin only)
- `DELETE /api/tracking/:trackingNumber` - Delete tracking (admin only)

### Admin Tools
- `GET /api/admin/stats` - Get tracking statistics
- `POST /api/admin/force-update` - Force status updates for all trackings
- `DELETE /api/admin/clear-data` - Clear all tracking data

## Default Credentials

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Change these in production!**

## Database

The SQLite database (`pigeon_post.db`) is automatically created in the `/database` folder on first run.

### Tables

- **trackings** - Main tracking data
- **admin_users** - Admin authentication (future use)
- **admin_sessions** - Session management (future use)

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Deployment

### Render.com (Recommended)

1. Connect your GitHub repository
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables in Render dashboard
5. Deploy!

### Railway

1. Connect GitHub repository
2. Set root directory to `/backend`
3. Railway auto-detects Node.js and runs `npm start`
4. Add environment variables
5. Deploy!

### Manual Deployment

1. Copy backend folder to your server
2. Run `npm install --production`
3. Set environment variables
4. Run `npm start`
5. Use PM2 or similar for process management

## Features

### Automatic Status Updates

Tracking statuses automatically progress based on time:

- **processing** - Initial status
- **assigned** - 4+ hours before delivery
- **in-transit** - 2-4 hours before delivery  
- **approaching** - 30 minutes - 2 hours before delivery
- **delivered** - After delivery time

### Timeline Generation

Each tracking gets a realistic 5-stage timeline:

1. Message Received
2. Pigeon Assigned  
3. In Flight
4. Approaching Destination
5. Delivered

## Security Notes

- Uses simple session-based authentication
- Sessions stored in memory (use Redis for production)
- No password hashing implemented (add bcrypt for production)
- CORS configured for development (restrict in production)

## Development

- `npm run dev` - Start with nodemon for auto-reload
- `npm start` - Start production server

## Database Schema

```sql
CREATE TABLE trackings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trackingNumber TEXT UNIQUE NOT NULL,
  sender TEXT NOT NULL,
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  estimatedDelivery DATETIME NOT NULL,
  actualDelivery DATETIME NULL,
  timeline TEXT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
