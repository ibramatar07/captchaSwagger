const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/verify-captcha', async (req, res) => {
    const { token, secret } = req.body;

    if (!token || !secret) {
        return res.status(400).json({ success: false, message: 'Missing token or secret' });
    }

    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secret}&response=${token}`
        });

        const data = await response.json();

        // Return only what K2 needs
        res.json({ success: data.success });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

app.listen(port, () => console.log(`Captcha proxy running on http://localhost:${port}`));
