const TARGET_URL = process.env.TARGET_URL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Pouze POST metoda je podporována' });
  }

  if (!TARGET_URL) {
    return res.status(500).json({ error: 'Proxy není správně nakonfigurována. Chybí TARGET_URL.' });
  }

  try {
    // 🟡⬇️ PŘESMĚROVÁNÍ NA BACKENDOVÝ ENDPOINT (Z ENV PROMĚNNÉ)
    const response = await fetch(`${TARGET_URL}/create-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    // 🟡⬆️

    const text = await response.text();

    try {
      const json = JSON.parse(text);
      return res.status(response.status).json(json);
    } catch {
      return res.status(response.status).send(text);
    }

  } catch (err) {
    console.error('Chyba proxy:', err);
    return res.status(500).json({ error: 'Chyba proxy', detail: err.message });
  }
}
