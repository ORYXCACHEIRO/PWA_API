let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let comoditiesSchema = new Schema({
    name: { type: String, required: true, unique: true},
    //0 - não, 1 - sim
    free: { type: Number, required: true }
});

let comodities = mongoose.model('comodities', comoditiesSchema);

module.exports = comodities;