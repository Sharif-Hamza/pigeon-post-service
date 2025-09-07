# 🕊️ Pigeon Post Service

A beautiful, modern tracking application for a fictional pigeon-based message delivery service. Built with React, TypeScript, and Node.js.

## ✨ Features

### 🎨 Frontend
- **Mobile-First Design** - Fully responsive, optimized for mobile devices
- **Beautiful UI** - Built with Shadcn/UI and Tailwind CSS
- **Smooth Animations** - Powered by Framer Motion
- **Real-Time Tracking** - Live countdown timers and status updates
- **Admin Dashboard** - Full CRUD operations for managing deliveries
- **Direct Tracking Links** - Share tracking URLs with customers

### 🚀 Backend
- **RESTful API** - Complete backend with SQLite database
- **Universal Access** - Anyone with a tracking number can view status
- **Automatic Status Updates** - Time-based progression of delivery stages
- **Admin Authentication** - Secure login for administrators
- **Persistent Storage** - All data survives server restarts

### 📱 User Experience
- **Public Tracking** - Anyone can track with just a tracking number
- **Admin Portal** - Secure dashboard for creating and managing deliveries
- **Live Countdown** - Real-time countdown to delivery time
- **Professional Branding** - Clean, professional pigeon post service theme
- **Timeline View** - Visual progress through delivery stages

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Beautiful, accessible components
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Sonner** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **SQLite** - Lightweight database
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development auto-reload

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm

### 1. Clone & Install

```bash
git clone <your-repo>
cd project

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### 3. Access the Application

- **Public Tracking:** `http://localhost:5173`
- **Admin Login:** `http://localhost:5173/admin/login`
- **Admin Dashboard:** `http://localhost:5173/admin/dashboard`

### 4. Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

## 📖 How It Works

### For Users (Public)
1. Visit the main page
2. Enter a tracking number (e.g., `PPS123ABC`)
3. View real-time tracking status and countdown timer
4. See delivery progress through 5 stages

### For Admins
1. Login at `/admin/login`
2. Access the admin dashboard
3. Create new tracking entries with:
   - Sender and recipient information
   - Message content
   - Estimated delivery time
4. View all trackings and their statuses
5. Debug tools for testing and data management

### Automatic Status Updates
The system automatically updates tracking statuses based on time:

- **Processing** → **Assigned** → **In-Transit** → **Approaching** → **Delivered**

Each tracking gets a realistic timeline with pigeon-themed updates!

## 🌐 Deployment

### Frontend (Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set up redirects for SPA routing (already configured)

### Backend (Render/Railway)
1. Deploy the `backend` folder
2. Set environment variables:
   ```
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://your-frontend-url.netlify.app
   ```
3. Update frontend API URL to point to your backend

### Full-Stack Deployment
- **Frontend:** Netlify, Vercel, or GitHub Pages
- **Backend:** Render.com, Railway, Heroku, or any Node.js hosting
- **Database:** SQLite file (included with backend deployment)

## 🔧 Configuration

### Frontend Environment Variables
Create `.env.local`:
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend Environment Variables
Create `backend/.env`:
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## 📁 Project Structure

```
project/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── context/           # React context providers
│   ├── services/          # API service layer
│   ├── lib/               # Utility functions
│   └── ...
├── backend/               # Backend API
│   ├── routes/            # Express routes
│   ├── database/          # Database setup
│   └── ...
├── dist/                  # Frontend build output
└── ...
```

## 🎯 Key Features Explained

### Universal Tracking
- **Problem Solved:** Previously, tracking data was stored locally, so only the admin who created it could see it
- **Solution:** Backend database stores all tracking data, accessible by anyone with the tracking number

### Real-Time Updates
- **Automatic Status Progression:** Statuses update based on estimated delivery time
- **Live Countdown:** Shows exactly how long until delivery
- **Timeline View:** Visual progress through delivery stages

### Mobile-First Design
- **Responsive Layout:** Works perfectly on all screen sizes
- **Touch-Friendly:** Large buttons and intuitive gestures
- **Fast Loading:** Optimized assets and code splitting

### Admin Experience
- **Secure Login:** Session-based authentication
- **Easy Management:** Create, view, and manage all trackings
- **Debug Tools:** Force updates and clear data for testing

## 🔍 API Endpoints

### Public
- `GET /api/tracking/:trackingNumber` - Get tracking info
- `GET /api/health` - Health check

### Admin Only
- `POST /api/admin/login` - Login
- `GET /api/tracking` - Get all trackings
- `POST /api/tracking` - Create tracking
- `PUT /api/tracking/:id` - Update tracking
- `DELETE /api/tracking/:id` - Delete tracking

## 🎨 Design Philosophy

- **Professional yet Whimsical** - Serious service with charming pigeon theme
- **Mobile-First** - Designed for mobile, enhanced for desktop  
- **Accessible** - WCAG compliant components from Shadcn/UI
- **Fast** - Optimized for performance with lazy loading and code splitting
- **Reliable** - Graceful fallbacks and error handling

## 🚨 Production Considerations

### Security
- Change default admin credentials
- Add password hashing (bcrypt)
- Use environment variables for secrets
- Implement rate limiting
- Add HTTPS

### Performance
- Use Redis for session storage
- Add database indexing
- Implement caching
- Set up CDN for static assets

### Monitoring
- Add logging (Winston)
- Set up error tracking (Sentry)
- Monitor uptime
- Database backups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use for any purpose!

---

**Built with ❤️ for the Pigeon Post Service**

*Professional message delivery since 1850* 🕊️
