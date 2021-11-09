let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let languageSchema = new Schema({
    name: { type: String, required: true, unique: true }
});

let langs = mongoose.model('langs', languageSchema);

module.exports = langs;