const config = {
    db: 'mongodb://localhost/hotel',
    secret: 'superscret',
    secretpass: 'superscretpass',
    expiresPassword: 86400,
    expireTokenPass: 60*5,
    valideImgFormat: [".png", ".jpg"],
    saltRounds: 10
}

module.exports = config;