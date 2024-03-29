const express = require('express');

const hotel = require('../controllers/hotel');
const gallery = require('../controllers/gallery');
const reviews = require('../controllers/reviews');
const rooms = require('../controllers/rooms');
const users = require('../controllers/user');
const reservations = require('../controllers/reservations');
const favorites = require('../controllers/favorites');
const pagination = require('../middleware/pagination/paginationUsers');

//routes
const roomAPI = require('../routes/rooms');
const reviewAPI = require('../routes/reviews');
const comsHotelAPI = require('../routes/comodities/comoditiesHotel');
const langsHotelAPI = require('../routes/langs/langsHotel');
const galleryHotelAPI = require('../routes/gallery/galleryHotel');

const verifyToken = require('../middleware/verifyToken');
const {onlyAdmin, limitedAccess, onlyClient, onlyEmployee} = require('../middleware/verifyAccess');

function hotelRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));
    router.use(pagination);

    
    router.route('/').get(function (req, res, next) {

        hotel.findAll(req.paginationUsers).then((hotel) => {
            res.send(hotel);
            res.status(200);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            res.status(400);
            res.send({message: "error getting hotels"});
            res.end();
            next();
        });

    }).post(verifyToken, onlyAdmin, function (req, res, next) {

        let body = req.body;

        if (
            (typeof body.name == 'string' && body.name.trim() !== "")
            && (typeof body.description == 'string' && body.description.trim() !== "")
            && (typeof body.category == 'number' && body.category >= 0 && body.category <= 5)
            && (typeof body.adress == 'string' && body.adress.trim() !== "")
            && (typeof body.postalc == 'string' && body.postalc.trim() !== "")
            && (typeof body.city == 'string' && body.city.trim() !== "")
            && (typeof body.city_gmaps == 'string' && body.city_gmaps.trim() !== "")
            && (typeof body.main_image == 'string' && body.main_image.trim() !== "")
            && (typeof body.about_hotel == 'string' && body.about_hotel.trim() !== "")
            && (typeof body.state == 'number' && (body.state == 0 || body.state == 1))
        ) {

            hotel.create(body).then(() => {
                res.status(200);
                res.send(body);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                err.status = err.status || 500;
                res.status(400);
                res.end();
                next();
            });

        } else {
            res.status(400);
            res.end();
            next();
        }

    });

    router.route('/recomended').get(function (req, res, next) {

        hotel.findAllRecomended().then((hotel) => {
            res.status(200);
            res.send(hotel);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            res.status(400);
            res.send({message: "room not found"});
            res.end();
            next();
        });

    });

    router.route('/all-reviews').get(verifyToken, onlyAdmin, function (req, res, next) {

        reviews.findAll().then((avs) => {
            res.send(avs);
            res.status(200);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            res.send(err);
            res.status(401);
            res.end();
            next();
        });

    });

    router.route('/all-reservs').get(verifyToken, onlyAdmin, function (req, res, next) {

        reservations.findAll().then((reserv) => {
            //console.log(ress);
            res.status(200);
            res.send(reserv);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            res.send(err);
            res.status(401);
            res.end();
            next();
        });

    });

    router.route('/workstations').get(verifyToken, onlyEmployee, function (req, res, next) {

        users.findAllWorkStations(req.user_id).then((hotels) => hotel.findByWorkStationsId(hotels, req.paginationUsers)).then((hotels) => {
            //console.log(ress);
            res.status(200);
            res.send(hotels);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            res.send(err);
            res.status(401);
            res.end();
            next();
        });

    });

    router.route('/:hotelid').get(function (req, res, next) {

        let id = req.params.hotelid;

        if (typeof id == 'string' && id.trim() !== "") {

            hotel.findOneById(id).then((hotel) => {
                res.status(200);
                res.send(hotel);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                err.status = err.status || 500;
                res.status(400);
                res.end();
                next();
            });

        } else {
            res.status(400);
            res.end();
            next();
        }

    }).put(verifyToken, limitedAccess, function (req, res, next) {

        let id = req.params.hotelid;
        let body = req.body;

        if ((typeof id == 'string' && id.trim() !== "") && (typeof body.name == 'string' && body.name.trim() !== "")
        && (typeof body.description == 'string' && body.description.trim() !== "")
        && (typeof parseInt(body.category) == 'number' && parseInt(body.category) >= 0 && parseInt(body.category) <= 5)
        && (typeof body.adress == 'string' && body.adress.trim() !== "")
        && (typeof body.postalc == 'string' && body.postalc.trim() !== "")
        && (typeof body.city == 'string' && body.city.trim() !== "")
        && (typeof body.city_gmaps == 'string' && body.city_gmaps.trim() !== "")
        && (typeof body.main_image == 'string' && body.main_image.trim() !== "")
        && (typeof body.about_hotel == 'string' && body.about_hotel.trim() !== "")
        && (typeof parseInt(body.state) == 'number' && (parseInt(body.state) == 0 || parseInt(body.state) == 1))) {

            hotel.updateById(id, body).then(() => {
                res.status(200);
                res.send({message: "hotel updated"});
                res.end();
                next();
            }).catch((err) => {
                console.log(err);
                err.status = err.status || 500;
                res.status(400);
                res.send({message: "error updating hotel"});
                res.end();
                next();
            });

        } else {
            res.status(400);
            res.end();
            next();
        }

    }).delete(verifyToken, onlyAdmin, function (req, res, next) {

        let id = req.params.hotelid;

        if (typeof id == 'string' && id.trim() !== "") {
            hotel.findOneById(id).then(() => rooms.findIdsByHotelId(id)).then((room) => reservations.removeAllRoomRes(room).then(() => gallery.removeFinalbyRoomId(room))).then(() =>  favorites.removeByHotelId(id)).then(() => rooms.removeAllHotelRooms(id)).then(() => reviews.removeByHotelId(id)).then(() => gallery.removeByHotelId(id)).then(() => users.removeWorkStation(id)).then(() => hotel.removeById(id)).then(() => {
                res.status(200);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                err.status = err.status || 500;
                res.status(400);
                res.end();
                next();
            });

        } else {
            res.status(400);
            res.end();
            next();
        }

    });

    router.route('/:hotelid/favorites').post(verifyToken, onlyClient, function (req, res, next) { 

        let id = req.params.hotelid;

        if (typeof id == 'string' && id.trim() !== "") { 

            let user_id = req.user_id;

            let obj = new Object({
                id_user: user_id,
                id_hotel: id
            });

            hotel.findOneById(id).then(() => favorites.checkIfFavorite(user_id, id)).then(() => favorites.create(obj)).then((fav) => {
                res.status(200);
                res.send({response: true});
                res.end();
                next();
            }).catch((err) => {
                console.log(err);
                err.status = err.status || 500;
                res.status(err)
                res.status(400);
                res.end();
                next();
            });

        } else {
            res.status(400);
            res.end();
            next();
        }

    });

    //----------------comodities-----------------------

    router.use('/:hotelid/comodities',comsHotelAPI());

    //------------------languages----------------------------

    router.use('/:hotelid/languages', langsHotelAPI());

    //-------------------rooms-----------------------

    router.use('/:hotelid/rooms', roomAPI());
    
    //--------------------reviews--------------------------------

    router.use('/:hotelid/reviews', reviewAPI());

    //-----------------gallery------------------------

    router.use('/:hotelid/gallery', galleryHotelAPI());
    

    return router;
}

module.exports = hotelRouter;