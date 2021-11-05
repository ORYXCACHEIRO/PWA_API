const http = require('http');
const express = require('express');
let router = require('./router');
require('./config/db').connect();

const host = '127.0.0.1';
const port = process.env.PORT || 3000;

var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('trust proxy', true);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(router.initialize());
const server = http.Server(app);

server.listen(port, host, () => {
    console.log(`Server running at  http://${host}:${port}/`);
});