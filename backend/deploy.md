# Backend Deployment Guide

## 🚀 Deploy to Render.com (Recommended)

### Step 1: Prepare Your Repository
1. Push your code to GitHub
2. Make sure the `backend` folder contains all necessary files

### Step 2: Create Render Service
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Build & Deploy:**
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-url.netlify.app
```

### Step 3: Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Copy your service URL (e.g., `https://your-app.onrender.com`)

## 🌐 Deploy to Railway

### Step 1: Prepare
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`

### Step 2: Deploy
```bash
cd backend
railway init
railway up
```

### Step 3: Set Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://your-frontend-url.netlify.app
```

## ⚡ Deploy to Heroku

### Step 1: Prepare
```bash
cd backend
echo "web: npm start" > Procfile
```

### Step 2: Deploy
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-url.netlify.app
git subtree push --prefix backend heroku main
```

## 🔧 Environment Variables

Set these in your deployment platform:

| Variable | Value | Description |
|----------|--------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` (Render) or auto | Server port |
| `FRONTEND_URL` | `https://your-frontend.netlify.app` | Frontend URL for CORS |

## 📝 Post-Deployment

### 1. Test Your API
Visit `https://your-backend-url.com/api/health` to verify it's working.

### 2. Update Frontend
Update your frontend's `netlify.toml` with your backend URL:
```toml
[build.environment]
  VITE_API_URL = "https://your-backend-url.com/api"
```

### 3. Redeploy Frontend
Trigger a new frontend build with the updated API URL.

## 🔍 Troubleshooting

### Database Issues
- SQLite database is created automatically on first run
- Database file persists between deployments on most platforms

### CORS Errors
- Make sure `FRONTEND_URL` environment variable matches your frontend domain exactly
- Include protocol (`https://`) in the URL

### Build Failures
- Ensure `package.json` and all dependencies are in the `backend` folder
- Check that Node.js version is compatible (16+)

### Performance
- Free tiers may have cold start delays
- Consider upgrading to paid plans for production use

## 📊 Monitoring

### Logs
- **Render:** View logs in the dashboard
- **Railway:** Use `railway logs`
- **Heroku:** Use `heroku logs --tail`

### Health Checks
Set up monitoring for your `/api/health` endpoint.

## 🔒 Security Checklist

- [ ] Change default admin credentials
- [ ] Set strong environment variables
- [ ] Enable HTTPS (usually automatic on hosting platforms)
- [ ] Restrict CORS to your frontend domain only
- [ ] Consider adding rate limiting for production
