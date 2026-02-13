# AutoCOA App

A React Progressive Web App (PWA) built with Vite.

## Setup

```bash
npm install
```

## Scripts

- **`npm run dev`** – Start dev server
- **`npm run build`** – Production build
- **`npm run preview`** – Preview production build locally

## PWA

- **Offline**: Cached for offline use; service worker updates automatically.
- **Install**: Add to home screen from the browser (Chrome/Edge "Install app").
- **Icons**: Add `public/icons/icon-192.png` and `public/icons/icon-512.png` for install icons (192×192 and 512×512 PNG).

## Project structure

```
src/
  components/   # Reusable UI components
  pages/        # Route-level pages
  hooks/        # Custom React hooks
  utils/        # Helpers and utilities
  assets/       # Images, fonts, etc.
  styles/       # Global or shared CSS
  services/     # API and external services
  contexts/     # React context providers
public/         # Static files (favicon, icons, etc.)
```

## How it works

- **External users**: Open the app, fill the form, and submit. Data is sent to the Google Sheet. No sign-in.
- **Admin**: View submissions by opening the spreadsheet link directly (bookmark or share link).

### One-time setup (admin only)

1. Create a **Google Sheet** (or use your existing one) and add the Apps Script from `google-apps-script/Code.js` (Extensions → Apps Script).
2. **Deploy → New deployment** → type **Web app** → Execute as **Me**, Who has access **Anyone** → Deploy. Copy the **Web app URL** (ends with `/exec`).
3. In the project root, create a `.env` file and set:
   ```bash
   VITE_SHEETS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
   ```
4. Restart the dev server.

Share the app link with external users. Admin opens the spreadsheet link to view data.

## Tech stack

- React 18
- Vite 6, Tailwind CSS
- vite-plugin-pwa (service worker, offline)
- Google Sheets via Apps Script (no sign-in, one shared sheet)
