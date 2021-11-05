let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let avaliacaoSchema = new Schema({
    avalicao: { type: Number, required: true},
    id_hotel: { type: String, required: true },
    id_user: { type: String, required: true },
    coment: { type: String, required: false },
    data_av: { type: Date, default: Date.now }
});

let avaliacao = mongoose.model('avaliacoes', avaliacaoSchema);

module.exports = avaliacao;