
const { RtcRole } = require('agora-token');
const express = require('express');
const http = require('http');
const cors = require("cors");
const { generateToken } = require('./tools/token');
const { default: axios } = require('axios');

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 53001;

app.use(express.json())

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration


app.get('/token', (req, res) => {
    const { channelName } = req.query;
    console.log("New Request for channel: " + channelName);

    if (!channelName) {
        return res.status(400).json({ error: 'channelName is required' });
    }

    const tokenWithUid = generateToken(channelName, RtcRole.PUBLISHER);

    res.status(200).json({ token: tokenWithUid });
});

app.get('/channel', async (req, res) => {
    const plainCredentials = `${process.env.AGORA_RESTFUL_CUSTOMER_ID}:${process.env.AGORA_RESTFUL_CUSTOMER_SECRET}`;
    const base64Credentials = Buffer.from(plainCredentials).toString('base64');
    const response = await axios.create({
        baseURL: 'https://api.agora.io',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64Credentials}`
        }
    }).get('/dev/v1/channel/' + process.env.AGORA_APP_ID)
    if (response.status !== 200 || !response.data.success) {
        return res.status(500).json({ error: 'Failed to fetch channels' });
    }

    // Retrieve active channel names
    const channels = response.data.data.channels.map(channel => channel.channel_name);

    // generate 6 number unique code
    do {
        var code = Math.floor(100000 + Math.random() * 900000)
    } while (channels.includes(code))

    const token = generateToken(code.toString(), RtcRole.PUBLISHER);
    res.status(200).json({
        channelName: code,
        token: token
    })
})

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});