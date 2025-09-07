# 🚂 Railway Deployment Guide for Pigeon Post Service

## 📋 Pre-Deployment Checklist

✅ Git repository initialized  
✅ Backend configured for Railway  
✅ Frontend domain: [https://pigeonpostalservice.netlify.app/](https://pigeonpostalservice.netlify.app/)  
✅ CORS configured for your Netlify domain  

## 🚀 Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended)

### Step 2: Push to GitHub
```bash
# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/pigeon-post-service.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Railway
1. Go to Railway dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect the backend

### Step 4: Configure Environment Variables
In Railway dashboard, go to your service > Variables tab:

```
NODE_ENV=production
FRONTEND_URL=https://pigeonpostalservice.netlify.app
PORT=3001
```

### Step 5: Set Root Directory
In Railway dashboard > Settings:
- **Root Directory:** `backend`
- **Build Command:** `npm install` (auto-detected)
- **Start Command:** `npm start` (auto-detected)

## 🔗 After Deployment

### 1. Get Your Railway URL
After deployment, Railway will give you a URL like:
`https://your-app-name.railway.app`

### 2. Update Netlify Configuration
Update your `netlify.toml`:
```toml
[build.environment]
  VITE_API_URL = "https://your-railway-app.railway.app/api"
```

### 3. Test Your API
Visit: `https://your-railway-app.railway.app/api/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-07T...",
  "service": "Pigeon Post Service API"
}
```

### 4. Redeploy Frontend
1. Commit the updated `netlify.toml`
2. Push to trigger Netlify rebuild
3. Your frontend will now connect to Railway backend!

## 🎯 Complete Workflow Test

1. **Visit:** [https://pigeonpostalservice.netlify.app/admin/login](https://pigeonpostalservice.netlify.app/admin/login)
2. **Login:** `admin` / `admin123`
3. **Create tracking** with future delivery time
4. **Copy tracking number** (e.g., `PPS123ABC`)
5. **Open new browser/incognito**
6. **Visit:** [https://pigeonpostalservice.netlify.app/](https://pigeonpostalservice.netlify.app/)
7. **Search** with tracking number
8. **✅ Universal tracking works!**

## 🔧 Troubleshooting

### Backend Not Starting
- Check Railway logs for errors
- Verify `backend` folder structure
- Ensure `npm start` script exists

### CORS Errors
- Verify `FRONTEND_URL` environment variable
- Check Railway logs for CORS messages
- Ensure Netlify domain matches exactly

### Database Issues
- SQLite database auto-creates on first run
- Check Railway logs for database initialization
- Database persists between deployments

### API Connection Issues
- Verify `VITE_API_URL` in Netlify build settings
- Check network tab in browser dev tools
- Test API health endpoint directly

## 📊 Monitoring

### Railway Dashboard
- View logs in real-time
- Monitor resource usage
- Check deployment status

### API Health Check
Set up monitoring for: `https://your-railway-app.railway.app/api/health`

## 💰 Railway Pricing

- **Hobby Plan:** $5/month (sufficient for this app)
- **Free Trial:** Available for testing
- **Usage-based:** Pay for what you use

## 🔒 Security Notes

- Change default admin credentials in production
- Railway provides HTTPS automatically
- Environment variables are encrypted
- Consider adding rate limiting for production

## 📈 Next Steps

After successful deployment:
1. Test all functionality end-to-end
2. Monitor for any issues
3. Consider upgrading to paid Railway plan
4. Set up custom domain if needed
5. Add monitoring/alerting

---

**Your Pigeon Post Service will be fully operational with universal tracking! 🕊️✨**
