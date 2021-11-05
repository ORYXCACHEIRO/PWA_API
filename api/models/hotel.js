let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let hotelSchema = new Schema({
    name: { type: String, required: true, unique: true},
    descricao: { type: String, required: true },
    // 1 estrela, 2 estrelas...
    categoria: { type: Number, required: true },
    morada: { type: String, required: true },
    cpostal: { type: String, required: true },
    local: { type: String, required: true },
    //iframe
    local_gmaps: { type:String, required: true },
    //caminho para a imagem
    imagem_principal: { type: String, required: true},
    sobre_hotel: { type: String, required: true},
    //valor que decide se o hotel é visivel ou nao no frontend 0 - nao visivel, 1 - visivel
    comodidades: { type: Array, default: []},
    idiomas: {type: Array, default: []},
    visivel: {type: Number, default: 1}
   
});

let hotel = mongoose.model('hoteis', hotelSchema);

module.exports = hotel;