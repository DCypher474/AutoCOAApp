/**
 * Vercel serverless function to proxy requests to Google Apps Script
 * This avoids CORS issues in production
 */

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const scriptUrl = process.env.VITE_SHEETS_SCRIPT_URL

  if (!scriptUrl) {
    return res.status(500).json({ error: 'VITE_SHEETS_SCRIPT_URL is not configured' })
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json().catch(async () => {
      const text = await response.text()
      return { error: text || 'Unknown error' }
    })

    // Forward status and data
    return res.status(response.status).json(data)
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Network error' })
  }
}
