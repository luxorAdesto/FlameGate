const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');


const app = express();
app.use(cors());
app.use(bodyParser.json());


// 🔥 Twilio credentials
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = 'VA383e44155388b1eb338787e260cada65'; // from your screenshot


const client = twilio(accountSid, authToken);


// 🚀 Send Code
app.post('/send', async (req, res) => {
  const { phone } = req.body;
  try {
    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phone, channel: 'sms' });
    res.send({ status: verification.status });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


// ✅ Check Code
app.post('/check', async (req, res) => {
  const { phone, code } = req.body;
  try {
    const verificationCheck = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code });
    res.send({ status: verificationCheck.status });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


app.listen(3000, () => console.log('🔥 FlameBridge active on port 3000'));
