# Deployment & script verification

## 1. Deployment URL in your app (.env)

**Current value:**
```
https://script.google.com/macros/s/AKfycbyCxT6r3KMLHS2fMFlOAcW-rjG59qrQAmcjFWEFr7pOMyWlgcP1-Fob7kQ_yzUSxEBi/exec
```

- Format is correct: `https://script.google.com/macros/s/.../exec`
- No spaces or quotes in .env
- Must match exactly the URL from Apps Script **Deploy → Manage deployments** (the Web app deployment)

---

## 2. What the deployed script must have

The script that is deployed at the URL above **must** contain (from `google-apps-script/Code.js`):

| Required | Purpose |
|----------|---------|
| `var SPREADSHEET_ID = '1Z9KSgthbzvMatoGQqTLeEn06M8OyLvCmEBEdbODwqD8'` | Letter **O** in `M8Oy` and `EdbOD` (not digit 0). |
| `function doPost(e) { ... }` | Handles form submit (POST). |
| `SpreadsheetApp.openById(SPREADSHEET_ID)` | Writes to COA List by ID (not `getActiveSpreadsheet()`). |
| `function doGet() { ... }` | Optional; used to verify which sheet the script uses. |
| `function createResponse(...)` | Sends JSON back to the app. |

---

## 3. How to verify in Google

### A. Check which sheet the deployment uses

1. Open this URL in your browser (same as in .env):
   ```
   https://script.google.com/macros/s/AKfycbyCxT6r3KMLHS2fMFlOAcW-rjG59qrQAmcjFWEFr7pOMyWlgcP1-Fob7kQ_yzUSxEBi/exec
   ```
2. You should see text like:
   ```
   This script saves form data to: COA List
   https://docs.google.com/spreadsheets/d/1Z9KSgthbzvMatoGQqTLeEn06M8OyLvCmEBEdbODwqD8/...
   ```
3. If you see **"Script function not found: doGet"** → the deployment is running **old code**. Update Code.gs in Apps Script (paste full `google-apps-script/Code.js`) and **Save**. No need to create a new deployment; the same URL will use the new code.
4. If you see **"Error: ..."** → note the message (e.g. permission or invalid ID).

### B. Confirm the deployment URL in Apps Script

1. Open your **COA List** sheet → **Extensions → Apps Script** (or [script.google.com](https://script.google.com) → open project **COA List**).
2. Go to **Deploy → Manage deployments**.
3. Open the **Web app** deployment (click the pencil or the URL).
4. Copy the **Web app URL** shown there.
5. It must be **exactly** the same as in your `.env`:
   ```
   https://script.google.com/macros/s/AKfycbyCxT6r3KMLHS2fMFlOAcW-rjG59qrQAmcjFWEFr7pOMyWlgcP1-Fob7kQ_yzUSxEBi/exec
   ```
   If it’s different, either:
   - Update `.env` with this URL, **or**
   - Create **Deploy → New deployment** and use that new URL in `.env`.

### C. Check runs after submitting the form

1. In Apps Script: **Executions** (clock icon on the left).
2. Submit the form once from your app.
3. Find the latest **doPost** run.
   - **Completed** → script ran; if the sheet is still empty, the script may be writing to another file (wrong SPREADSHEET_ID in the deployed code).
   - **Failed** → open it and read the error (e.g. wrong ID, no permission).

---

## 4. Spreadsheet ID (no typo)

Correct ID (letter O, not zero):

```
1Z9KSgthbzvMatoGQqTLeEn06M8OyLvCmEBEdbODwqD8
                ^^              ^^
                O               O
```

Wrong (digit 0):

```
...M80y...  or  ...Edb0D...
```

Your COA List link:  
https://docs.google.com/spreadsheets/d/1Z9KSgthbzvMatoGQqTLeEn06M8OyLvCmEBEdbODwqD8/edit

So the script and .env must use the ID above with the two **O**s as shown.
