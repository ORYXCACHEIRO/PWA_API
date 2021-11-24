const express = require('express');
let comAPI = require('./routes/comodities/comoditiesAdmin');
let hotelAPI = require('./routes/hotel');
let langsAPI = require('./routes/langs/langsAdmin');
let usersAPI = require('./routes/user');
let authAPI = require('./routes/auth');
let profAPI = require('./routes/profile');
let searchAPI = require('./routes/search');

function initialize(){
    let api = express();
    
    api.use('/comodities', comAPI());
    api.use('/hotel', hotelAPI());
    api.use('/languages', langsAPI());
    api.use('/users', usersAPI());
    api.use('/auth', authAPI());
    api.use('/profile', profAPI());
    api.use('/search', searchAPI());

    return api;
}

module.exports = {
    initialize: initialize,
};