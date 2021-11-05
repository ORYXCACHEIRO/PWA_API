let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reservaSchema = new Schema({
    data_ini: { type: Date, required: true},
    data_fim: { type: Date, required: true },
    id_user: { type: String, required: true },
    id_quarto: { type: String, required: true }
});

let reservas = mongoose.model('reservas', reservaSchema);

module.exports = reservas;