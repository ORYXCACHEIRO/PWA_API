let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: { type: String, required: true},
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 0 },
    workStation: { type: Array, default: []}
});

let user = mongoose.model('users', userSchema);

module.exports = user;