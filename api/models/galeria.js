let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let galeriaSchema = new Schema({
    caminho: { type: String, required: true},
    //0 - nao pertence a nenhum hotel e se tiver um id obviamente pertence (mesmo pra quartos)
    id_hotel: { type: String, required: true },
    id_quarto: { type: String, required: true },
    //valor que decide se o hotel é visivel ou nao no frontend 0 - nao visivel, 1 - visivel
    visivel: {type: Number, default: 1}
});

let galeria = mongoose.model('galeria', galeriaSchema);

module.exports = galeria;