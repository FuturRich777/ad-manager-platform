# Admin Dashboard

Professional admin dashboard for viewing and managing form submissions from your intake form.

## Features

- 🔒 Password-protected login (`minexmedia2024`)
- 📊 View all form submissions in a table
- 🔍 Search and filter submissions
- 📥 Export submissions to CSV
- 📋 View detailed submission information
- 🔄 Real-time data from Supabase

## Running Locally

```bash
npm install
npm start
```

Open http://localhost:3000 and log in with password: `minexmedia2024`

## Deploy to Production

### Option 1: Railway (Recommended - 2 minutes)

1. Visit https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `FuturRich777/ad-manager-platform`
5. Select branch: `claude/awesome-goldberg-cf206d`
6. Railway auto-deploys! ✅

Your dashboard will be live at: `https://your-project-name.railway.app`

### Option 2: Heroku (2 minutes)

1. Install Heroku CLI: `brew install heroku` (Mac) or download from heroku.com
2. Login: `heroku login`
3. Create app: `heroku create minex-dashboard`
4. Deploy: `git push heroku claude/awesome-goldberg-cf206d:main`
5. Open: `heroku open`

Your dashboard will be live at: `https://minex-dashboard.herokuapp.com`

### Option 3: Render (2 minutes)

1. Visit https://render.com
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Select `FuturRich777/ad-manager-platform` 
5. Select branch: `claude/awesome-goldberg-cf206d`
6. Build: `cd dashboard-app && npm install`
7. Start: `cd dashboard-app && npm start`
8. Deploy! ✅

Your dashboard will be live at: `https://your-service-name.onrender.com`

---

**Login Credentials:**
- Password: `minexmedia2024`

**Data Source:**
Connects directly to your Supabase database at `lmgqwgjdzrmufadfxezs`
