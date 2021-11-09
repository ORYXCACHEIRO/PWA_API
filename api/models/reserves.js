let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reservesSchema = new Schema({
    begin_date: { type: Date, required: true},
    end_date: { type: Date, required: true },
    id_user: { type: String, required: true },
    id_room: { type: String, required: true }
});

let reserves = mongoose.model('reserves', reservesSchema);

module.exports = reserves;