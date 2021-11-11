const express = require('express');
let regAPI = require('./routes/register');
let comAPI = require('./routes/comodities');
let hotelAPI = require('./routes/hotel');
let langsAPI = require('./routes/langs');
let loginAPI = require('./routes/login');
let usersAPI = require('./routes/users');

function initialize(){
    let api = express();
    
    
    api.use('/register', regAPI());
    api.use('/comodities', comAPI());
    api.use('/hotel', hotelAPI());
    api.use('/languages', langsAPI());
    api.use('/login', loginAPI());
    api.use('/users', usersAPI());

    return api;
}

module.exports = {
    initialize: initialize,
};