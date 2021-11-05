let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let idiomaSchema = new Schema({
    name: { type: String, required: true, unique: true }
});

let idioma = mongoose.model('idioma', idiomaSchema);

module.exports = idioma;