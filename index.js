console.log("🔥 FlameGate is LIVE");

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.get('/test', (req, res) => {
  res.send('✅ FlameGate test route reached.');
});
app.get('/', (req, res) => {
  res.send('🔥 FlameGate server is up!');
});

// Temporary in-memory code storage
const verifications = {}; // Example: { "+15555555555": "834912" }

app.post('/start-verification', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).send({ error: 'Phone number required' });

  
// 🔥 SEND VERIFICATION CODE

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verifications[phone] = code;

console.log(`Code ${code} stored for ${phone}`);
res.status(200).send({ message: 'Verification code stored (no SMS sent)' });

console.error("SMS Failed:", err.message);
res.status(500).send({ error: 'Failed to send SMS', details: err.message });

app.post('/check-verification', (req, res) => {
  const { phone, code } = req.body;
  const stored = verifications[phone];

  if (!stored) return res.status(404).send({ message: 'No code found for this number' });
  if (stored === code) return res.status(200).send({ success: true });
  else return res.status(401).send({ success: false, message: 'Code mismatch' });
});

app.get('/', (req, res) => {
  res.send('🔥 FlameGate is running');
});

app.get('/test', (req, res) => {
  res.send('✅ FlameGate test route is working');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 FlameGate is listening on port ${PORT}`);
});
