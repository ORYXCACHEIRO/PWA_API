let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let comodidadesSchema = new Schema({
    name: { type: String, required: true, unique: true},
    free: { type: Number, required: true },
    //0 - hotel , 1 - quarto, 2 - ect...
    type: { type: Number, required: true }
});

let comodidades = mongoose.model('comodidades', comodidadesSchema);

module.exports = comodidades;