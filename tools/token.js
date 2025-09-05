const { RtcTokenBuilder } = require('agora-token');

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

module.exports = { generateToken };