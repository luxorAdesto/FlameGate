console.log("🔥 FlameGate is LIVE");

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());


// Twilio client setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


// Temporary in-memory code storage
const verifications = {}; // Example: { "+15555555555": "834912" }


app.post('/start-verification', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).send('Phone number required');


  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verifications[phone] = code;


  try {
    console.log(`Sending code ${code} to ${phone}`);
    await client.messages.create({
      body: `Your FlameGate verification code is: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER, // Add this to your .env
      to: phone
    });


    res.status(200).send({ message: 'Verification code sent' });
  } catch (err) {
    console.error("SMS Failed:", err.message);
    res.status(500).send({ error: 'Failed to send SMS', details: err.message });
  }
});


app.post('/check-verification', (req, res) => {
  const { phone, code } = req.body;
  const stored = verifications[phone];


  if (!stored) return res.status(404).send({ message: 'No code found for this number' });
  if (stored === code) return res.status(200).send({ success: true });
  else return res.status(401).send({ success: false, message: 'Code mismatch' });
});


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`🔥 FlameGate is LIVE on port ${PORT}`);
});
