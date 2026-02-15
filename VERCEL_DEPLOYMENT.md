# Vercel Deployment Guide for HireHub Job Portal

This guide will help you deploy your MERN stack job portal to Vercel.

## Important Notes

⚠️ **Socket.io Limitations**: Vercel's serverless functions don't support persistent WebSocket connections required by Socket.io. For production with real-time features, consider:
- Using Vercel for frontend + separate hosting for backend (Railway, Render, or DigitalOcean)
- Deploying backend with Socket.io support on a platform with persistent connections
- Using alternative real-time solutions compatible with serverless (e.g., Pusher, Ably)

## Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. MongoDB Atlas account with a database
3. Cloudinary account for file uploads
4. GitHub repository with your code

## Deployment Steps

### 1. Prepare Environment Variables

Create a `.env` file in the `backend` directory with:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
SECRET_KEY=your_jwt_secret_key_here
PORT=8002
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

Create a `.env` file in the `frontend` directory with:

```env
VITE_API_BASE_URL=https://your-vercel-project.vercel.app
VITE_SOCKET_URL=https://your-vercel-project.vercel.app
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from project root:
   ```bash
   vercel
   ```

4. Follow the prompts and confirm settings

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: frontend/dist

4. Add Environment Variables in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from both `.env` files

### 3. Configure Environment Variables in Vercel

In your Vercel project settings, add these environment variables:

**Backend Variables:**
- `MONGO_URI`
- `SECRET_KEY`
- `CLOUD_NAME`
- `API_KEY`
- `API_SECRET`
- `FRONTEND_URL` (your Vercel deployment URL)
- `NODE_ENV` = `production`

**Frontend Variables:**
- `VITE_API_BASE_URL` (your Vercel deployment URL)
- `VITE_SOCKET_URL` (your Vercel deployment URL)

### 4. Update CORS After Deployment

After your first deployment, update the `FRONTEND_URL` environment variable with your actual Vercel URL.

### 5. Verify Deployment

Test these endpoints:
- Frontend: `https://your-project.vercel.app`
- Backend Health: `https://your-project.vercel.app/api/v1/user` (should return 404 or method not allowed, not 500)

## Troubleshooting

### 404 NOT_FOUND Error

If you see `404: NOT_FOUND` error:

1. **Check API Routes**: Ensure all API calls use relative paths `/api/...` instead of full URLs
2. **Verify Environment Variables**: Make sure `VITE_API_BASE_URL` is set correctly
3. **Check vercel.json**: Ensure routing is configured properly
4. **Review Build Logs**: Check Vercel deployment logs for build errors
5. **Clear Cache**: Try redeploying with "Force Rebuild" option

### Database Connection Issues

- Whitelist Vercel IPs in MongoDB Atlas (or allow all IPs: 0.0.0.0/0)
- Verify `MONGO_URI` includes correct username/password
- Check MongoDB Atlas cluster is accessible

### CORS Errors

- Update `FRONTEND_URL` in backend environment variables
- Ensure credentials are properly configured

## Alternative Deployment Strategy (Recommended for Socket.io)

For full functionality with Socket.io:

1. **Frontend**: Deploy to Vercel
   ```bash
   cd frontend
   vercel
   ```

2. **Backend**: Deploy to Railway/Render/DigitalOcean
   - These platforms support persistent connections
   - Configure environment variables there
   - Update `VITE_API_BASE_URL` in frontend to point to backend URL

## Local Testing

Test production build locally:

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Support

For issues, check:
- Vercel deployment logs
- Browser console for errors
- Network tab for failed requests
- MongoDB Atlas logs

## Security Checklist

Before going live:
- [ ] Change all default secrets
- [ ] Use strong JWT secret
- [ ] Configure proper CORS origins
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS for all API calls
- [ ] Add rate limiting middleware
- [ ] Sanitize user inputs
- [ ] Add helmet.js for security headers
