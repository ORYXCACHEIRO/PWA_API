let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let hotelSchema = new Schema({
    name: { type: String, required: true, unique: true},
    description: { type: String, required: true },
    // 1 estrela, 2 estrelas...
    category: { type: Number, default: 0 },
    adress: { type: String, required: true },
    postalc: { type: String, required: true },
    city: { type: String, required: true },
    //iframe
    city_gmaps: { type:String, required: true },
    //caminho para a imagem para já vazio por nao haver upload da mesma
    main_image: { type: String, default: "aaaaaaaaaaaaaaa"},
    about_hotel: { type: String, required: true},
    //valor que decide se o hotel é visivel ou nao no frontend 0 - nao visivel, 1 - visivel
    comodities: { type: Array, default: []},
    languages: {type: Array, default: []},
    recomended: {type: Number, default: 0},
    //0 - nao visivel ao publico
    state: {type: Number, default: 0}
   
});

hotelSchema.index( { name: "text" } );

let hotel = mongoose.model('hotels', hotelSchema);

module.exports = hotel;