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
        findAllRooms,
        findAllReviews,
        createReview,
        removeRoom,
        createRoom,
        findOneRoom,
        findHotelLangs,
        updateHotelLangs,
        removeHotelLangs,
        findHotelComs,
        updateHotelComs
    };

    //------------------Reviews----------------

    function createReview(values){
        return reviews.create(values);
    }

    function findAllReviews(id){
        return reviews.findRevsByHotelId(id);
    }

    //--------------Quarto-------------------------

    function findAllRooms(id){
        return rooms.findByHotelId(id);
    }

    function findOneRoom(id){
        return rooms.findQuartById(id);
    }

    function removeRoom(id){
        return rooms.removeById(id);
    }

    function createRoom(values){
        return rooms.create(values);
    }

    //-----------------------Hotel--------------------------
    function findAll() {
        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, hoteis) {
                if (err) reject(err);

                resolve(hoteis);
            }).select("-status -__v");
        });
    }

    function findOneById(id){
        return new Promise(function (resolve, reject) {
            Model.findById(id, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
            }).select("-status -__v");
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

    function findHotelLangs(id){
        return new Promise(function (resolve, reject) {
        Model.findById(id, 'languages', function (err, langs) {
                if (err) reject(err);
                resolve(langs);
            }).select("-_id");
        });
    }

    function updateHotelLangs(id, values){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, { $push: { languages:{ $each: values } } }, 'languages', {new: true}, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
            }).select("-__v");
        });
    }

    function removeHotelLangs(id, value){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, { $pull: { languages:{ language: value } } }, {new: true}, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
            }).select("-__v");
        });
    }

    function findHotelComs(id){
        return new Promise(function (resolve, reject) {
        Model.findById(id, 'comodities', function (err, langs) {
                if (err) reject(err);
                resolve(langs);
            }).select("-_id");
        });
    }

    function updateHotelComs(id, values){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, { $push: { comodities:{ $each: values } } }, 'comodities', {new: true}, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
            }).select("-__v");
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