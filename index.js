
const { RtcRole } = require('agora-token');
const { RtcTokenBuilder } = require('agora-token');
const express = require('express');
const http = require('http');

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 53001;

app.use(express.json())

app.get('/publisher', (req, res) => {
    const { channelName } = req.query;

    if (!channelName) {
        return res.status(400).json({ error: 'channelName is required' });
    }

    const tokenWithUid = generateToken(channelName, RtcRole.PUBLISHER);

    res.status(200).json({ token: tokenWithUid });
});

app.get('/subscriber', (req, res) => {
    const { channelName } = req.query;
    console.log(channelName);
    if (!channelName) {
        return res.status(400).json({ error: 'channelName is required' });
    }
    const tokenWithUid = generateToken(channelName, RtcRole.SUBSCRIBER);

    res.status(200).json({ token: tokenWithUid });
});

const generateToken = (channelName, role) => {
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    const tokenExpirationInSecond = 3600;
    const uid = 0
    const privilegeExpirationInSeconds = 3600

    // Generate Token
    const tokenWithUid = RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        channelName,
        uid,
        role,
        tokenExpirationInSecond,
        privilegeExpirationInSeconds
    )
    return tokenWithUid;
}

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});