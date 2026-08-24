// This file runs on Vercel's server, never in the browser.
// The API key lives in an environment variable (LDK_AI_API_KEY), set in the
// Vercel dashboard — it is never sent to, or visible from, the client.
//
// The frontend (script.js) calls "/api/chat" instead of calling
// api.ejolabs.com directly. This function receives that request, attaches
// the real key server-side, forwards it to ejolabs.com, and passes the
// reply back. Anyone inspecting the site's JS or network tab only ever
// sees "/api/chat" — the real endpoint and key are never exposed.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.LDK_AI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing LDK_AI_API_KEY. Set it in the Vercel project settings.' });
    return;
  }

  try {
    const upstream = await fetch('https://api.ejolabs.com/api/v1/subiza', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(req.body)
    });

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Could not reach the AI service: ' + err.message });
  }
}
