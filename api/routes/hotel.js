const express = require('express');
const hotel = require('../controllers/hotel');
const comodities = require('../controllers/comodities');
const gallery = require('../controllers/gallery');
const reviews = require('../controllers/reviews');
const rooms = require('../controllers/rooms');
const langs = require('../controllers/langs');

const verifyToken = require('../middleware/verifyToken');
const {onlyAdmin, limitedAccess} = require('../middleware/verifyAccess');

function hotelRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));


    router.route('/').get(function (req, res, next) {

        hotel.findAll().then((hotel) => {
            res.send(hotel);
            res.status(200);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            res.status(401);
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
            && typeof body.comodaties == 'object'
            && typeof body.languages == 'object'
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

        let id = req.params.hotelid;
        let body = req.body;

        if ((typeof id == 'string' && id.trim() !== "")) {

            hotel.updateById(id, body).then((hotel) => {
                res.status(200);
                res.send(hotel);
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

    }).delete(verifyToken, onlyAdmin, function (req, res, next) {

        let id = req.params.hotelid;

        if (typeof id == 'string' && id.trim() !== "") {

            hotel.findOneById(id).then(() => rooms.removeAllHotelRooms(id)).then(() => reviews.removeByHotelId(id)).then(() => gallery.removeByHotelId(id)).then(() => hotel.removeById(id)).then(() => {
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

    router.route('/:hotelid/comodities').get(function (req, res, next) {

        let id = req.params.hotelid;

        if (typeof id == 'string' && id.trim() !== "") {

            hotel.findHotelComs(id).then((coms) => {
                res.status(200);
                res.send(coms)
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

        let id = req.params.hotelid;
        let body = req.body;

        if (typeof id == 'string' && id.trim() !== "" && (body.comodity && typeof body.comodity == 'string' && body.comodity.trim() !== "")) {

            comodities.findComById(body.comodity).then(() => hotel.findHotelComs(id)).then((coms) => {

                if (coms.comodities.filter(function (e) { return e.comodity === body.comodity; }).length > 0) {
                    res.status(401);
                    res.send("Comodity/s is already present at the Hotel");
                    res.end();
                    next();
                } else {

                    hotel.updateHotelComs(id, body.comodity).then((hotel) => {
                        res.status(200);
                        res.send(hotel)
                        res.end();
                        next();
                    }).catch((err) => {
                        //console.log(err);
                        err.status = err.status || 500;
                        res.status(401);
                        res.end();
                        next();
                    });

                }

            }).catch((err) => {
                console.log(err);
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

    router.route('/:hotelid/comodities/:comid').put(verifyToken, limitedAccess,function (req, res, next) {

        let idhotel = req.params.hotelid;
        let idcom = req.params.comid;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idcom == 'string' && idcom.trim() !== "")) {

            hotel.removeHotelComs(idhotel, idcom).then((coms) => {
                res.status(200);
                res.send(coms);
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

    router.route('/:hotelid/languages').get(function (req, res, next) {

        let id = req.params.hotelid;

        if (typeof id == 'string' && id.trim() !== "") {

            hotel.findHotelLangs(id).then((langs) => {
                res.status(200);
                res.send(langs)
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

    }).put(verifyToken, limitedAccess,function (req, res, next) {

        let id = req.params.hotelid;
        let body = req.body;

        if (typeof id == 'string' && id.trim() !== "" && (body.language && typeof body.language == 'string' && body.language.trim() !== ""))  {

            langs.findById(body.language).then(() => hotel.findHotelLangs(id)).then((langss) => {

                if (langss.languages.filter(function (e) { return e.language === body.language; }).length > 0) {
                    res.status(401);
                    res.send("Language/s is already present at the Hotel");
                    res.end();
                    next();
                } else {

                    hotel.updateHotelLangs(id, body.language).then((hotel) => {
                        res.status(200);
                        res.send(hotel)
                        res.end();
                        next();
                    }).catch((err) => {
                        //console.log(err);
                        err.status = err.status || 500;
                        res.status(401);
                        res.end();
                        next();
                    });

                }

            }).catch((err) => {
                console.log(err);
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

    router.route('/:hotelid/languages/:langid').put(verifyToken, limitedAccess, function (req, res, next) {

        let idhotel = req.params.hotelid;
        let idlang = req.params.langid;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idlang == 'string' && idlang.trim() !== "")) {

            hotel.removeHotelLang(idhotel, idlang).then((langs) => {
                res.status(200);
                res.send(langs);
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

    router.route('/:hotelid/rooms').get(function (req, res, next) {

        let id = req.params.hotelid;

        if (typeof id == 'string' && id.trim() !== "") {

            rooms.findByHotelId(id).then((rooms) => {
                res.status(200);
                res.send(rooms);
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

    }).post(verifyToken, limitedAccess,function (req, res, next) {

        let id = req.params.hotelid;
        let body = req.body;

        if (typeof id == 'string' && id.trim() !== "") {

            body.id_hotel = id;

            rooms.create(body).then((room) => {
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

    router.route('/:hotelid/rooms/:roomid').get(function (req, res, next) {

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

            rooms.removeById(idroom).then(() => {
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

    //TODO rotas em baixo

    router.route('/:hotelid/rooms/:roomid/comodities').get(function (req, res, next) { 
        
        let idhotel = req.params.hotelid;
        let idroom = req.params.roomid;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idroom == 'string' && idroom.trim() !== "")) {

            rooms.findRoomComs(idroom).then((coms) => {
                res.status(200);
                res.send(coms);
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

    }).put(verifyToken, limitedAccess,function (req, res, next) { 

        let idroom = req.params.roomid;
        let body = req.body;

        if (typeof idroom == 'string' && idroom.trim() !== "" && (body.comodity && typeof body.comodity == 'string' && body.comodity.trim() !== "")) {

            console.log(body.comodity);

            comodities.findComById(body.comodity).then(() => rooms.findRoomComs(idroom)).then((coms) => {

                if (coms.comodities.filter(function (e) { return e.comodity === body.comodity; }).length > 0) {
                    res.status(401);
                    res.send("Comodity/s is already present at the Hotel");
                    res.end();
                    next();
                } else {

                    rooms.updateRoomComs(idroom, body.comodity).then((room) => {
                        res.status(200);
                        res.send(room)
                        res.end();
                        next();
                    }).catch((err) => {
                        //console.log(err);
                        err.status = err.status || 500;
                        res.status(401);
                        res.end();
                        next();
                    });

                }

            }).catch((err) => {
                console.log(err);
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

    router.route('/:hotelid/rooms/:roomid/comodities/:comid').put(verifyToken, limitedAccess,function (req, res, next) { 

        let idhotel = req.params.hotelid;
        let idcom = req.params.comid;
        let idroom = req.params.roomid;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idcom == 'string' && idcom.trim() !== "") && (typeof idroom == 'string' && idroom.trim() !== "")) {

            rooms.removeRoomComs(idroom, idcom).then((coms) => {
                res.status(200);
                res.send(coms);
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

    router.route('/:hotelid/rooms/:roomid/gallery').get(function (req, res, next) { 
        
        if ((req.params.hotelid && typeof req.params.hotelid == "string") && (req.params.roomid && typeof req.params.roomid)) {

            let idroom = req.params.roomid;

            gallery.findAllByRoom(idroom).then((photos) => {
                res.send(photos);
                res.status(200);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                res.status(401);
                res.end();
                next();
            });

        } else {
            res.status(401);
            res.end();
            next();
        }

    }).post(function (req, res, next) { });

    router.route('/:hotelid/rooms/:roomid/gallery/:photoid').put(function (req, res, next) { });

    router.route('/:hotelid/rooms/:roomid/reservations').get(function (req, res, next) { 
        
    }).post(function (req, res, next) { });

    router.route('/:hotelid/rooms/:roomid/reservations/:res_id').get(function (req, res, next) { 

    }).put(function (req, res, next) { 

    }).delete(function (req, res, next) { });
    
    //--------------------------------------------------------

    router.route('/:hotelid/reviews').get(function (req, res, next) {

        if (req.params.hotelid && typeof req.params.hotelid == "string") {

            let id = req.params.hotelid;

            reviews.findRevsByHotelId(id).then((avs) => {
                res.send(avs);
                res.status(200);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                res.status(401);
                res.end();
                next();
            });

        } else {
            res.status(401);
            res.end();
            next();
        }

    }).post(verifyToken, async (req, res, next) => {

        let body = req.body;

        //TODO: Mudar forma como obtenho o id depois de implementar o sistema de login

        if (
            (body.coment && body.coment.length > 0 && typeof body.coment == 'string' && body.coment.trim() !== "" || !body.coment)
            && (typeof body.id_user == 'string' && body.id_user.trim() !== "")
            && (typeof body.review == 'number' && (body.review >= 0 && body.review <= 10))
            && (req.params.hotelid && typeof req.params.hotelid == "string")
            && req.user_role ==0
        ) {

            let id = req.params.hotelid;
            body.id_hotel = id;

            reviews.checkReviews(id, body.id_user).then((result) => {

                if (result.length > 0) {
                    res.status(401);
                    res.end();
                    next();
                }

                body.id_hotel = req.params.hotelid;

                if (!body.coment) {
                    body.coment = "";
                }

                reviews.create(body).then(() => {
                    res.status(200);
                    res.send(body);
                    res.end();
                    next();
                }).catch((err) => {
                    //console.log(err);
                    err.status = err.status || 500;
                    res.status(401);
                    res.end();
                    next();
                });

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

    router.route('/:hotelid/reviews/:reviewId').delete(verifyToken, limitedAccess,function (req, res, next) {

        if (req.params.reviewId && typeof req.params.reviewId == "string") {

            let id = req.params.reviewId;

            reviews.removeByRevId(id).then(() => {
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

    router.route('/:hotelid/gallery').get(function (req, res, next) {

        if (req.params.hotelid && typeof req.params.hotelid == "string") {

            let id = req.params.hotelid;

            gallery.findAllByHotel(id).then((photos) => {
                res.send(photos);
                res.status(200);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                res.status(401);
                res.end();
                next();
            });

        } else {
            res.status(401);
            res.end();
            next();
        }

    }).post(verifyToken, limitedAccess,function (req, res, next) {

        let body = req.body;

        if (req.params.hotelid && typeof req.params.hotelid == "string") {

            let id = req.params.hotelid;

            body.id_room = "";
            body.id_hotel = id;

            gallery.create(body).then(() => {
                res.status(200);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
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

    router.route('/:hotelid/gallery/:photoid').delete(verifyToken, limitedAccess,function (req, res, next) {

        if ((req.params.hotelid && typeof req.params.hotelid == "string") && (req.params.photoid && typeof req.params.photoid == "string")) {

            let photoid = req.params.photoid;

            gallery.removeById(photoid).then(() => {
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

    return router;
}

module.exports = hotelRouter;