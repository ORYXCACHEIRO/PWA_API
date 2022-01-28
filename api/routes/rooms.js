const express = require('express');

const rooms = require('../controllers/rooms');
const gallery = require('../controllers/gallery');
const reservations = require('../controllers/reservations');
const hotel = require('../controllers/hotel');
const pagination = require('../middleware/pagination/paginationUsers');

const verifyToken = require('../middleware/verifyToken');
const {limitedAccess} = require('../middleware/verifyAccess');

//routes
const comsRoomAPI = require('../routes/comodities/comoditiesRoom');
const galleryRoomAPI = require('../routes/gallery/galleryRoom');
const reservationsAPI = require('./reservations');


function roomRouter() {
    let router = express.Router({mergeParams: true});

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));
    router.use(pagination);

    router.route('/').get(function (req, res, next) {

        let id = req.params.hotelid;

        if (typeof id == 'string' && id.trim() !== "") {
            
            rooms.findByHotelId(id).then((room) => {
                res.status(200);
                res.send(room);
                res.end();
                next();
            }).catch((err) => {
                console.log(err);
                err.status = err.status || 500;
                res.status(401);
                res.end();
                next();
            });

        } else {
            //console.log("shbghsgdhsgb")
            res.status(401);
            res.end();
            next();
        }

    }).post(verifyToken, limitedAccess,function (req, res, next) {

        let id = req.params.hotelid;
        let body = req.body;

        if (typeof id == 'string' && id.trim() !== "") {

            body.id_hotel = id;

            hotel.findOneById(id).then(() => rooms.create(body)).then((room) => {
                res.status(200);
                res.send(room);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                err.status = err.status || 500;
                res.status(401);
                res.end();
                next();
            });

        } else {
            res.status(401);
            res.end();
            next();
        }

    });

    router.route('/table').get(function (req, res, next) {

        let id = req.params.hotelid;

        if (typeof id == 'string' && id.trim() !== "") {
            
            rooms.findByHotelIdTable(id, req.paginationUsers).then((room) => {
                res.status(200);
                res.send(room);
                res.end();
                next();
            }).catch((err) => {
                console.log(err);
                err.status = err.status || 500;
                res.status(401);
                res.end();
                next();
            });

        } else {
            //console.log("shbghsgdhsgb")
            res.status(401);
            res.end();
            next();
        }

    });

    router.route('/:roomid').get(function (req, res, next) {

        let idhotel = req.params.hotelid;
        let idroom = req.params.roomid;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idroom == 'string' && idroom.trim() !== "")) {

            rooms.findById(idroom).then((quarto) => {
                res.status(200);
                res.send(quarto);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                err.status = err.status || 500;
                res.status(401);
                res.end();
                next();
            });

        } else {
            res.status(401);
            res.end();
            next();
        }

    }).put(verifyToken, limitedAccess, function (req, res, next) {

        let idhotel = req.params.hotelid;
        let idroom = req.params.roomid;
        let body = req.body;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idroom == 'string' && idroom.trim() !== "")) {

            rooms.updateById(idroom, body).then((room) => {
                res.status(200);
                res.send(room);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                err.status = err.status || 500;
                res.status(401);
                res.end();
                next();
            });

        } else {
            res.status(401);
            res.end();
            next();
        }

    }).delete(verifyToken, limitedAccess,function (req, res, next) {

        let idhotel = req.params.hotelid;
        let idroom = req.params.roomid;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idroom == 'string' && idroom.trim() !== "")) {

            rooms.findById(idroom).then(() => gallery.removeByRoomId(idroom)).then(() => reservations.removeAllRoomRes(idroom)).then(() => rooms.removeById(idroom)).then(() => {
                res.status(200);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                err.status = err.status || 500;
                res.status(401);
                res.end();
                next();
            });

        } else {
            res.status(401);
            res.end();
            next();
        }

    });

    //---------------comodities-------------------------

    router.use('/:roomid/comodities', comsRoomAPI());

    //------------------gallery-----------------------

    router.use('/:roomid/gallery', galleryRoomAPI());

    //-------------------reservations-------------------------

    router.use('/:roomid/reservations', reservationsAPI());

    return router;
}

module.exports = roomRouter;