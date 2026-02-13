# Deploy to Vercel

## Quick Steps

1. **Push to GitHub** (or GitLab/Bitbucket)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click **Add New...** → **Project**
   - Import your repository
   - Vercel will auto-detect **Vite** framework

3. **Set Environment Variables**
   In Vercel dashboard → Your Project → **Settings** → **Environment Variables**, add:
   - `VITE_SHEETS_SCRIPT_URL` = `https://script.google.com/macros/s/.../exec` (your Apps Script URL)
   - `VITE_SHEETS_VIEW_URL` = `https://docs.google.com/spreadsheets/d/...` (optional, spreadsheet link)

4. **Deploy**
   - Click **Deploy**
   - Vercel will build and deploy automatically
   - Your app will be live at `https://your-project.vercel.app`

## How It Works

- **Development**: Uses Vite proxy (`/api/sheets` → Google Apps Script)
- **Production**: Uses Vercel serverless function (`api/sheets.js`) that proxies to your Apps Script, avoiding CORS issues

## After Deployment

- Share your Vercel URL with users to submit forms
- Admin opens the spreadsheet link to view submissions
- The serverless function handles all form submissions automatically
