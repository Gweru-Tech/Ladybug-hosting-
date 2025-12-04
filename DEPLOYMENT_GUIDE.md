# Ladybug Hosting - Render.com Deployment Guide

## Quick Deployment to Render.com

### Step 1: Prepare Your Repository
1. Push all code to a GitHub repository
2. Ensure all files are included, especially:
   - `render.yaml`
   - `package.json`
   - `Dockerfile`
   - `.env.example`

### Step 2: Create Render Account
1. Sign up at [render.com](https://render.com)
2. Connect your GitHub account

### Step 3: Create New Web Service
1. Click "New +" → "Web Service"
2. Select your GitHub repository
3. Configure the service:

#### Service Configuration
- **Name**: `ladybug-hosting`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free` (to start) or `Starter`

#### Environment Variables
Add these environment variables in Render dashboard:
```
NODE_ENV=production
PORT=10000
SESSION_SECRET=your-secure-session-secret-here
JWT_SECRET=your-secure-jwt-secret-here
```

### Step 4: Database Setup

#### Option A: Use Render MongoDB
1. Add MongoDB service: "New +" → "MongoDB"
2. Choose "Free" plan for testing
3. Once created, copy the connection string
4. Add to your web service environment variables:
   ```
   MONGODB_URI=your-mongodb-connection-string
   ```

#### Option B: Use MongoDB Atlas (Recommended)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Add to environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ladybug-hosting?retryWrites=true&w=majority
   ```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Access your app at `https://your-app-name.onrender.com`

### Step 6: Seed Initial Data
After deployment:
1. Go to Render dashboard → Services → your service
2. Click "Shell" tab
3. Run:
   ```bash
   node seed-data.js
   ```

## Post-Deployment Setup

### Admin Access
- Navigate to `https://your-app-name.onrender.com/admin`
- Login with:
  - Username: `Ntando`
  - Password: `Ntando`

### Create Sample Servers
Use the admin panel to:
1. Create free and paid servers
2. Set up server categories (gaming, web, bot, etc.)
3. Configure connection details

### Custom Domain (Optional)
1. Go to your service settings
2. Add custom domain
3. Update DNS records
4. SSL is automatically configured

## Environment Variables Explained

### Required Variables
```
NODE_ENV=production              # Production mode
PORT=10000                       # Required by Render
SESSION_SECRET=random-string     # Session encryption
JWT_SECRET=another-random-string # JWT token secret
MONGODB_URI=connection-string    # Database connection
```

### Optional Variables
```
CORS_ORIGIN=https://yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Troubleshooting

### Common Issues

#### 1. Deployment Fails
- Check `render.yaml` syntax
- Verify `package.json` dependencies
- Ensure all files are committed to Git

#### 2. Database Connection Errors
- Verify MongoDB connection string
- Check if MongoDB service is running
- Ensure IP whitelist includes Render's IP

#### 3. Server Not Starting
- Check build logs for errors
- Verify PORT environment variable
- Ensure all dependencies are installed

#### 4. Admin Panel Not Working
- Clear browser cookies
- Verify session configuration
- Check environment variables

### Getting Help

1. **Render Documentation**: [docs.render.com](https://docs.render.com)
2. **MongoDB Atlas Guide**: [docs.mongodb.com](https://docs.mongodb.com)
3. **Node.js Best Practices**: [nodejs.dev](https://nodejs.dev)

### Scaling Considerations

#### When to Upgrade from Free Plan
- More than 100 concurrent users
- Need for custom domain
- Better performance requirements
- Production workloads

#### Monitoring and Logging
- Check Render dashboard for metrics
- Monitor response times
- Set up alerts for downtime

## Security Best Practices

1. **Strong Secrets**: Use long, random strings for secrets
2. **Environment Variables**: Never commit secrets to Git
3. **Regular Updates**: Keep dependencies updated
4. **HTTPS**: Always use HTTPS in production
5. **Database Security**: Use strong database passwords

## Performance Optimization

1. **Enable Caching**: Use CDN for static assets
2. **Database Indexing**: Add indexes for frequently queried fields
3. **Compression**: Enable gzip compression
4. **Load Balancing**: Use multiple instances for high traffic

## Backup Strategy

1. **Database Backups**: Enable automatic backups in MongoDB Atlas
2. **Code Backups**: Use Git for version control
3. **Configuration**: Document environment variables

This deployment guide ensures your Ladybug Hosting platform runs smoothly on Render.com with all features working correctly.