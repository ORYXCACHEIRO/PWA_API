let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let gallerySchema = new Schema({
    path: { type: String, required: true},
    //0 - nao pertence a nenhum hotel e se tiver um id obviamente pertence (mesmo pra quartos)
    id_hotel: { type: String, required: false, default: "" },
    id_room: { type: String, required: false, default: "" },
    //valor que decide se o hotel é visivel ou nao no frontend 0 - nao visivel, 1 - visivel
    state: {type: Number, default: 1}
});

let gallery = mongoose.model('gallery', gallerySchema);

module.exports = gallery;