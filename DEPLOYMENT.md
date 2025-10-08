# Deployment Guide - Shira Studio

## Overview
This guide provides step-by-step instructions for deploying the Shira Studio e-commerce application to production.

## Architecture
- **Frontend**: Next.js deployed on Vercel
- **Backend**: Express.js deployed on Railway
- **Database**: MongoDB

## Environment Configuration

### Frontend (Vercel)

#### Required Environment Variables

1. **API_URL** (Required)
   - Description: The URL of your backend API
   - Production Value: `https://shira-studio-production.up.railway.app/api`
   - Local Development: `http://localhost:3001/api`

#### How to Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Name**: `API_URL`
   - **Value**: `https://shira-studio-production.up.railway.app/api`
   - **Environment**: Select "Production", "Preview", and "Development" as needed
   - **Important**: The URL MUST include the `https://` protocol

4. After adding the variable, **redeploy** your application:
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Select **Redeploy**

### Backend (Railway)

#### Required Environment Variables

1. **DB_CONN_STRING** (Required)
   - Description: MongoDB connection string
   - Railway Internal: `mongodb://mongo:PtnpoSneKRrmuDwiiEKsiCqxPOqkaItg@mongodb.railway.internal:27017`
   - Railway Public: `mongodb://mongo:PtnpoSneKRrmuDwiiEKsiCqxPOqkaItg@ballast.proxy.rlwy.net:54055`
   - Note: Use the internal URL for better performance within Railway's network

2. **DB_NAME** (Required)
   - Description: Database name
   - Example: `shira-studio`
   - Note: This will be appended to the connection string automatically

3. **PORT** (Optional)
   - Description: Server port (Railway sets this automatically)
   - Default: `3001`

4. **FRONTEND_URL** (Optional)
   - Description: Additional frontend URL for CORS (if using custom domain)
   - Example: `https://your-custom-domain.com`

#### How to Configure Railway Environment Variables

1. Go to your Railway project dashboard
2. Select your backend service
3. Navigate to **Variables** tab
4. Add the required environment variables
5. Railway will automatically redeploy after changes

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:3000` (local development)
- `https://shira-studio.vercel.app` (production Vercel domain)
- Any URL specified in `FRONTEND_URL` environment variable

If you're using a custom domain, add it to the `FRONTEND_URL` environment variable on Railway.

## Deployment Steps

### Initial Deployment

1. **Deploy Backend to Railway**
   ```bash
   # From backend directory
   git push railway main
   ```

2. **Configure Backend Environment Variables** (see above)

3. **Deploy Frontend to Vercel**
   ```bash
   # From project root
   vercel --prod
   ```

4. **Configure Frontend Environment Variables** (see above)

5. **Redeploy Frontend** to apply environment variables

### Updating Deployments

#### Frontend Updates
```bash
# Commit your changes
git add .
git commit -m "Your commit message"
git push origin main

# Vercel will automatically deploy
```

#### Backend Updates
```bash
# Commit your changes
git add .
git commit -m "Your commit message"
git push railway main

# Railway will automatically deploy
```

## Troubleshooting

### CORS Errors
**Symptom**: Browser console shows CORS policy errors

**Solutions**:
1. Verify the Vercel domain is listed in backend CORS configuration
2. Check that `API_URL` environment variable is set correctly in Vercel
3. Ensure backend is deployed and running on Railway
4. Check Railway logs for CORS-related warnings

### API Connection Errors
**Symptom**: Frontend cannot connect to backend

**Solutions**:
1. Verify `API_URL` is set in Vercel environment variables
2. Confirm the Railway backend URL is correct
3. Check Railway service is running (not sleeping)
4. Verify Railway environment variables are set correctly
5. Redeploy frontend after changing environment variables

### Environment Variables Not Applied
**Symptom**: Changes to environment variables don't take effect

**Solutions**:
1. **Vercel**: Redeploy the application after changing variables
2. **Railway**: Service automatically redeploys, but you can manually trigger a redeploy
3. Clear browser cache and hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

## Verification Checklist

After deployment, verify:

- [ ] Frontend loads at Vercel URL
- [ ] Backend responds at Railway URL
- [ ] Categories load on homepage
- [ ] Products display correctly
- [ ] No CORS errors in browser console
- [ ] API requests succeed (check Network tab)
- [ ] Authentication works (if applicable)
- [ ] Cart functionality works
- [ ] Admin panel accessible (if applicable)

## Local Development

### Frontend
```bash
# Install dependencies
npm install

# Create .env.local file
echo "API_URL=http://localhost:3001/api" > .env.local

# Run development server
npm run dev
```

### Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your MongoDB credentials
# DB_CONN_STRING=your_mongodb_connection_string
# DB_NAME=shira-studio

# Run development server
npm run dev
```

## Support

For issues or questions:
1. Check Railway logs for backend errors
2. Check Vercel deployment logs for frontend errors
3. Review browser console for client-side errors
4. Verify all environment variables are correctly set