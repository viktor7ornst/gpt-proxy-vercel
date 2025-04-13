export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Použij POST metodu' });
  }

  try {
    const target = process.env.TARGET_URL || 'https://createcalendarevent-558541143249.europe-central2.run.app';

    const response = await fetch(`${target}/create-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const raw = await response.text();

    try {
      const data = JSON.parse(raw);
      return res.status(response.status).json(data);
    } catch (e) {
      return res.status(500).json({
        error: 'Proxy selhala – neplatný JSON z backendu',
        rawResponse: raw,
      });
    }

  } catch (error) {
    return res.status(500).json({
      error: 'Proxy výjimka',
      detail: error.message,
    });
  }
}
