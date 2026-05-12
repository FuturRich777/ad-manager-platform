# Admin Dashboard Deployment

Your admin dashboard is ready to deploy! Choose one of these options:

## Option 1: Deploy to Render (Easiest)

1. Go to https://render.com
2. Sign in or create an account with your email
3. Click **"New +"** → **"Web Service"**
4. Select your GitHub repository: `FuturRich777/ad-manager-platform`
5. Select branch: `claude/awesome-goldberg-cf206d`
6. Configure:
   - **Name**: `minex-form-dashboard`
   - **Root Directory**: (leave blank)
   - **Build Command**: `cd dashboard-app && npm install`
   - **Start Command**: `cd dashboard-app && npm start`
   - **Plan**: Select **Free**
7. Click **"Create Web Service"**

Your dashboard will be live at: `https://minex-form-dashboard.onrender.com`

**Login**: Password is `minexmedia2024`

---

## Option 2: Deploy to Railway (Free Alternative)

1. Go to https://railway.app
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Select: `FuturRich777/ad-manager-platform`
6. Select branch: `claude/awesome-goldberg-cf206d`
7. Railway will auto-detect as Node.js
8. Set environment variable:
   - **PORT**: `3000`
9. Your app deploys automatically

---

## Option 3: Deploy to Heroku (Also Free)

1. Go to https://www.heroku.com/
2. Create account or sign in
3. Create new app
4. Connect to GitHub repo
5. Deploy branch: `claude/awesome-goldberg-cf206d`
6. Add Procfile to root:

```
web: cd dashboard-app && npm start
```

---

## What's in the Dashboard

- Professional admin interface matching your form colors
- Login required (password: `minexmedia2024`)
- View all submissions in a table
- Search/filter by name, email, or business
- Click "View" to see full submission details
- Export to CSV
- Auto-connected to your Supabase database

**Ready?** Pick your favorite option above and deploy!
