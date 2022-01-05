const http = require('http');
const express = require('express');
const cookieParser = require("cookie-parser");
let router = require('./router');
const config = require('./config/config');
const mongoose = require('mongoose');
const cors = require('cors');

const host = '127.0.0.1';
const port = process.env.PORT || 5000;

var app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('trust proxy', true);
app.use(cors());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use(router.initialize());
const server = http.Server(app);

mongoose.connect(config.db).then(()=> console.log('Connection successfull!')).catch((err) => console.log(err));

server.listen(port, host, () => {
    console.log(`Server running at  http://${host}:${port}/`);
});