/**
 * Submit data to the admin's Google Sheet via Apps Script (no sign-in).
 * Admin sets VITE_SHEETS_SCRIPT_URL in .env (deployed script URL).
 */

function getScriptUrl() {
  return import.meta.env.VITE_SHEETS_SCRIPT_URL || ''
}

/** Whether the form can submit (script URL is configured). */
export function isFormConfigured() {
  return !!getScriptUrl()?.trim()
}

/** Spreadsheet URL for viewing submissions (optional, set in .env as VITE_SHEETS_VIEW_URL). */
export function getSheetsViewUrl() {
  return import.meta.env.VITE_SHEETS_VIEW_URL || ''
}

/**
 * Append one row to the sheet via Apps Script.
 * @param {Record<string, string|number|boolean>} rowData - Certificate of Appearance fields
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
export async function appendToSheet(rowData) {
  const scriptUrl = getScriptUrl()?.trim()
  if (!scriptUrl) {
    return { ok: false, message: 'Unable to submit. Please try again later.' }
  }

  // Use Vercel serverless function in production, or direct script URL if API route not available
  const url = '/api/sheets'
  const payload = { action: 'append', data: rowData }

  try {
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      return { ok: false, message: text || `Request failed: ${res.status}` }
    }

    const result = await res.json().catch(() => ({}))
    if (result.error) {
      return { ok: false, message: result.error }
    }
    return {
      ok: true,
      spreadsheetUrl: result.spreadsheetUrl,
      spreadsheetName: result.spreadsheetName,
      rowAdded: result.rowAdded
    }
  } catch (err) {
    return { ok: false, message: err.message || 'Network error.' }
  }
}
