# ✅ Render Deployment Checklist

## Before Deployment
- [ ] Code is committed to GitHub repository
- [ ] All dependencies are in `package.json`
- [ ] Environment variables are documented in `env.example`
- [ ] Database schema files are ready (`setup.sql`, migrations)

## Render Setup
- [ ] Create Render account at [render.com](https://render.com)
- [ ] Create PostgreSQL database service
- [ ] Create Web Service for backend API
- [ ] Set root directory to `backend`
- [ ] Configure build command: `npm install`
- [ ] Configure start command: `npm start`

## Environment Variables
- [ ] `DB_HOST` - PostgreSQL host from Render
- [ ] `DB_PORT` - 5432
- [ ] `DB_USER` - Database username from Render
- [ ] `DB_PASSWORD` - Database password from Render
- [ ] `DB_NAME` - Database name from Render
- [ ] `OPENAI_API_KEY` - Your OpenAI API key
- [ ] `NODE_ENV` - production
- [ ] `PORT` - 10000 (Render requirement)

## Database Setup
- [ ] Run `npm run setup-db` in Render shell
- [ ] Verify tables are created
- [ ] Test database connection

## Testing
- [ ] API health check: `https://your-app.onrender.com/`
- [ ] Database viewer: `https://your-app.onrender.com/db-viewer`
- [ ] User registration endpoint
- [ ] Trip creation endpoint
- [ ] AI recommendations endpoint

## Mobile App Update
- [ ] Update API base URL in mobile app
- [ ] Test mobile app with deployed API
- [ ] Verify all features work correctly

## Post-Deployment
- [ ] Monitor logs for errors
- [ ] Set up alerts if needed
- [ ] Document deployment URL
- [ ] Share API documentation with team

## Quick Commands
```bash
# Test API health
curl https://your-app.onrender.com/

# Test database stats
curl https://your-app.onrender.com/api/stats

# Test user registration
curl -X POST https://your-app.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'
```

**🎯 Your app should be live at: `https://your-app-name.onrender.com`** 