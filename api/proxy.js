const express = require('express');
const fetch = require('node-fetch'); // 🔵 fetch proxy call
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ Root kontrola dostupnosti
app.get('/', (req, res) => {
  res.status(200).json({ message: 'GPT Proxy běží správně 🚀' });
});

// 🔵 Proxy přeposílá na /create-event z TARGET_URL
app.post('/proxy/create-event', async (req, res) => {
  try {
    const target = process.env.TARGET_URL || 'https://createcalendarevent-558541143249.europe-central2.run.app';

    const response = await fetch(`${target}/create-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const raw = await response.text();

    try {
      const data = JSON.parse(raw);
      return res.status(response.status).json(data);
    } catch (e) {
      return res.status(500).json({
        error: 'Proxy selhala – neplatný JSON z backendu',
        rawResponse: raw
      });
    }

  } catch (error) {
    return res.status(500).json({
      error: 'Proxy výjimka',
      detail: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy běží na portu ${PORT}`);
});
