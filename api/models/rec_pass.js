let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let rec_passSchema = new Schema({
    key: { type: String, required: true},
    id_user: { type: String, required: true },
    data_expira: { type: Date, required: true }
});

let rec_pass = mongoose.model('rec_pass_keys', rec_passSchema);

module.exports = rec_pass;