export default function handler(req, res) {
  // Reaguje pouze na GET požadavky
  if (req.method === 'GET') {
    res.status(200).json({ message: 'GPT Proxy API je aktivní ✨' });
  } else {
    res.status(405).json({ error: 'Metoda není podporována' });
  }
}
