let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reservationsSchema = new Schema({
    begin_date: { type: Date, required: true},
    end_date: { type: Date, required: true },
    id_user: { type: String, required: true },
    id_room: { type: String, required: true },
    total_price: {type: Number, required: true}
});

let reservations = mongoose.model('reservations', reservationsSchema);

module.exports = reservations;