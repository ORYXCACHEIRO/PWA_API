let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let quartosSchema = new Schema({
    nome: { type: String, required: true},
    descricao: { type: String, required: true},
    id_hotel: { type: String, required: true },
    preco_noite: {type: Number, required: true},
    comodidades: { type: Array, default: []},
    idiomas: {type: Array, default: []},
    //valor que decide se o hotel é visivel ou nao no frontend 0 - nao visivel, 1 - visivel
    visivel: {type: Number, default: 1}
});

let quartos = mongoose.model('quartos', quartosSchema);

module.exports = quartos;