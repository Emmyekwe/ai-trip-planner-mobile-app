# 🚀 Deploying Travel App on Render

This guide will walk you through deploying your Travel App backend API and PostgreSQL database on Render.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **OpenAI API Key** - For AI recommendations feature

## 🗄️ Step 1: Create PostgreSQL Database on Render

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Sign in to your account

2. **Create New PostgreSQL Database**
   - Click **"New +"** → **"PostgreSQL"**
   - Choose a name: `travel-app-db`
   - Select **"Free"** plan (for development)
   - Choose a region close to you
   - Click **"Create Database"**

3. **Save Database Credentials**
   - Copy the **Internal Database URL** (you'll need this later)
   - Note down the database name, username, and password

## 🌐 Step 2: Deploy Your Backend API

1. **Create New Web Service**
   - In Render Dashboard, click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Select the repository containing your travel app

2. **Configure the Service**
   - **Name**: `travel-app-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend` (since your API is in the backend folder)

3. **Set Environment Variables**
   Click **"Environment"** and add these variables:
   ```
   DB_HOST=your-postgres-host.render.com
   DB_PORT=5432
   DB_USER=your-db-username
   DB_PASSWORD=your-db-password
   DB_NAME=your-db-name
   OPENAI_API_KEY=your-openai-api-key
   NODE_ENV=production
   PORT=10000
   ```

4. **Deploy**
   - Click **"Create Web Service"**
   - Render will automatically build and deploy your app

## 🗃️ Step 3: Set Up Database Schema

1. **Access Your Database**
   - Go to your PostgreSQL service in Render
   - Click **"Connect"** → **"External Database URL"**
   - Copy the connection string

2. **Run Database Setup**
   - In your deployed web service, go to **"Shell"** tab
   - Run: `npm run setup-db`
   - This will create all necessary tables

## 🔗 Step 4: Update Your Mobile App

1. **Update API Base URL**
   - Replace `localhost:3000` with your Render URL
   - Example: `https://travel-app-api.onrender.com`

2. **Test Your API**
   - Visit: `https://your-app-name.onrender.com/db-viewer`
   - You should see your database viewer interface

## 📱 Step 5: Test Your Deployment

### Test API Endpoints:
```bash
# Test health check
curl https://your-app-name.onrender.com/

# Test user registration
curl -X POST https://your-app-name.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test database viewer
curl https://your-app-name.onrender.com/api/stats
```

### Test Database Viewer:
- Visit: `https://your-app-name.onrender.com/db-viewer`
- You should see statistics and data tables

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version is compatible (>=16.0.0)

2. **Database Connection Fails**
   - Verify environment variables are correct
   - Check that database is running
   - Ensure SSL is configured for production

3. **API Returns 500 Errors**
   - Check Render logs in the "Logs" tab
   - Verify database schema is set up correctly

### Check Logs:
- Go to your web service in Render
- Click **"Logs"** tab to see real-time logs
- Look for error messages and debug issues

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit secrets to your repository
   - Use Render's environment variable system
   - Rotate API keys regularly

2. **CORS Configuration**
   - Update CORS settings to allow your mobile app domain
   - Consider restricting to specific domains in production

3. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Consider using connection pooling

## 📊 Monitoring

1. **Render Dashboard**
   - Monitor CPU, memory usage
   - Check request logs
   - Set up alerts for downtime

2. **Database Monitoring**
   - Monitor database connections
   - Check query performance
   - Set up backup schedules

## 🚀 Next Steps

1. **Custom Domain** (Optional)
   - Add a custom domain in Render settings
   - Configure DNS records

2. **SSL Certificate**
   - Render provides free SSL certificates
   - Automatically enabled for custom domains

3. **Scaling**
   - Upgrade to paid plans for more resources
   - Consider load balancing for high traffic

## 📞 Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Render Support**: Available in dashboard
- **Community**: Stack Overflow, Reddit r/webdev

---

**🎉 Congratulations! Your Travel App is now deployed and accessible worldwide!** 