const rooms = require('../controllers/rooms');
const reviews = require('../controllers/reviews');
const gallery = require('../controllers/gallery');
const comodities = require('../controllers/comodities');

function hotelService(Model) {

    let service = {
        create,
        findAll,
        findOneById,
        updateById,
        removeById,
        findAllRooms,
        findAllReviews,
        createReview,
        deleteReview,
        checkReview,
        removeRoom,
        createRoom,
        findOneRoom,
        updateRoom,
        findHotelLangs,
        updateHotelLangs,
        removeHotelLang,
        findHotelComs,
        updateHotelComs,
        removeHotelComs,
        checkComodity,
        removeHotelComsAll,
        addPhoto,
        deletePhoto,
        findPhotos
    };

    //------------------Reviews----------------

    function createReview(values){
        return reviews.create(values);
    }

    function findAllReviews(id){
        return reviews.findRevsByHotelId(id);
    }

    function deleteReview(id){
        return reviews.removeByRevId(id);
    }

    function checkReview(idhotel, iduser){
        return reviews.checkReviews(idhotel,iduser);
    }

    //--------------Quarto-------------------------

    function findAllRooms(id){
        return rooms.findByHotelId(id);
    }

    function findOneRoom(id){
        return rooms.findById(id);
    }

    function removeRoom(id){
        return rooms.removeById(id);
    }

    function updateRoom(id, room){
        return rooms.updateById(id, room);
    }

    function createRoom(values){
        return rooms.create(values);
    }

    //--------------Galeria-------------------------

    function addPhoto(values){
        return gallery.create(values);
    }

    function findPhotos(id){
        return gallery.findAllByHotel(id);
    }

    function deletePhoto(id){
        return gallery.removeById(id);
    }

    //---------------------Comodities---------------------------

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
            Model.findByIdAndUpdate(id, { $push: { comodities:{ $each: values } } }, {new: true}, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel.comodities);
            }).select("-__v");
        });
    }

    //remove hotel em especifico
    function removeHotelComs(id, value){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, { $pull: { comodities:{ comodity: value } } }, {new: true}, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel.comodities);
            }).select("-__v");
        });
    }

    //remove de todos os hoteis
    function removeHotelComsAll(value){
        return new Promise(function (resolve, reject) {
            Model.updateMany({}, { $pull: { comodities:{ comodity: value } } }, {new: true}, function (err) {
                if (err) reject(err);

                resolve();
            }).select("-__v");
        });
    }

    function checkComodity(id){
        return comodities.findComById(id);
    }

    //--------------------Languages------------------------------

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
            Model.findByIdAndUpdate(id, { $push: { languages:{ $each: values } } }, {new: true}, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel.languages);
            }).select("-__v");
        });
    }

    function removeHotelLang(id, value){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, { $pull: { languages:{ language: value } } }, {new: true}, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel.languages);
            }).select("-__v");
        });
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