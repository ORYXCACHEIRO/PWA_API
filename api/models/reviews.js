let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reviewSchema = new Schema({
    review: { type: Number, required: true},
    id_hotel: { type: String, required: true },
    id_user: { type: String, required: true },
    coment: { type: String, required: false },
    review_date: { type: Date, default: Date.now }
});

let review = mongoose.model('reviews', reviewSchema);

module.exports = review;