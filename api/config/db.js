const mongoose = require('mongoose');

const config = {
    db: 'mongodb://localhost/hotel',
    //secret: 'superscret',
    //expirePassword: 86400
}

exports.connect = () => {

    mongoose.connect(config.db)
    .then(()=> console.log('Connection successfull!'))
    .catch((err) => console.log(err));

}