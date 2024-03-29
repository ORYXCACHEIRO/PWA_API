let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const config = require('../config/config');

let rec_passSchema = new Schema({
    key: { type: String, required: true},
    id_user: { type: String, required: true },
    expire_date: { type: Date, default:Date.now , expires: config.expireTokenPass }
});

let rec_pass = mongoose.model('rec_pass_keys', rec_passSchema);

module.exports = rec_pass;