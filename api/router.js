const express = require('express');
let regAPI = require('./routes/register');
let comtAPI = require('./routes/comodidades');
let hotelAPI = require('./routes/hotel');
let idiomasAPI = require('./routes/idiomas');
let loginAPI = require('./routes/login');

function initialize(){
    let api = express();
    
    
    api.use('/register', regAPI());
    api.use('/comodidades', comtAPI());
    api.use('/hotel', hotelAPI());
    api.use('/idiomas', idiomasAPI());
    api.use('/login', loginAPI());

    return api;
}

module.exports = {
    initialize: initialize,
};