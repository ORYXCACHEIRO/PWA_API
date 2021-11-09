let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let roomSchema = new Schema({
    name: { type: String, required: true},
    descrption: { type: String, required: true},
    id_hotel: { type: String, required: true },
    price_per_night: {type: Number, required: true},
    comodities: { type: Array, default: []},
    languages: {type: Array, default: []},
    //valor que decide se o hotel é visivel ou nao no frontend 0 - nao visivel, 1 - visivel
    state: {type: Number, default: 1}
});

let quartos = mongoose.model('rooms', roomSchema);

module.exports = quartos;