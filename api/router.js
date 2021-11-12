const express = require('express');
let comAPI = require('./routes/comodities');
let hotelAPI = require('./routes/hotel');
let langsAPI = require('./routes/langs');
let usersAPI = require('./routes/user');
let authAPI = require('./routes/auth');

function initialize(){
    let api = express();
    
    api.use('/comodities', comAPI());
    api.use('/hotel', hotelAPI());
    api.use('/languages', langsAPI());
    api.use('/users', usersAPI());
    api.use('/auth', authAPI());

    return api;
}

module.exports = {
    initialize: initialize,
};