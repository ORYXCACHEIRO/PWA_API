const rooms = require('../controllers/rooms');
const reviews = require('../controllers/reviews');

function hotelService(Model) {

    let service = {
        create,
        findAll,
        findAllWithStatus,
        findOneById,
        updateById,
        removeById,
        findQuartoByHotelId,
        findAllReviews,
        createReview
    };

    function createReview(values){
        return reviews.create(values);
    }

    function findAllReviews(id){
        return reviews.findRevsByHotelId(id);
    }

    function findQuartoByHotelId(id){
        return rooms.findByHotelId(id);
    }

    function findAll() {
        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, hoteis) {
                if (err) reject(err);

                resolve(hoteis);
            }).select("-visivel -__v");
        });
    }

    function findOneById(values){
        return new Promise(function (resolve, reject) {
            Model.findOne({_id:values}, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
            }).select("-visivel -__v");
        });
    }

    function updateById(id, values){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id,values, {new: true}, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
            }).select("-__v");
        });
    }

    function removeById(id){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndRemove(id, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function findAllWithStatus() {
        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, hoteis) {
                if (err) reject(err);

                resolve(hoteis);
            });
        });
    }


    function create(values) {
        let newHotel = Model(values);
        return new Promise(function (resolve, reject) {
            newHotel.save(function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    return service;

}

module.exports = hotelService;