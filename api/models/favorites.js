let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let favoritesSchema = new Schema({
    id_user: { type: String, required: true },
    id_hotel: { type: String, required: true }
});

let favorites = mongoose.model('favorites', favoritesSchema);

module.exports = favorites;