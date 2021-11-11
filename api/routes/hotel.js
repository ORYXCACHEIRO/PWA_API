const express = require('express');
const hotel = require('../controllers/hotel');

function hotelSettingsRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));


    router.route('/all').get(function (req, res, next) {

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

    }).post(function (req, res, next) {

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

    }).put(function (req, res, next) {

        let id = req.params.hotelid;
        let body = req.body;

        if  ((typeof id == 'string' && id.trim() !== "")) {

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

    }).delete(function (req, res, next) {

        let id = req.params.hotelid;

        if (typeof id == 'string' && id.trim() !== "") {

            hotel.removeById(id).then(() => {
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

    }).put(function (req, res, next) {

        let id = req.params.hotelid;
        let body  = req.body;

        if (typeof id == 'string' && id.trim() !== "") {

            hotel.findHotelLangs(id).then((langs) => {

                let newArray = [];
                
                for(let i = 0; i<body.length; i++){
                    if (langs.languages.filter(function(e) { return e.language === body[i].language; }).length == 0 && newArray.filter(function(e) { return e.language === body[i].language; }).length == 0) {

                        let obj = new Object({
                            language: body[i].language
                        });
                        
                        newArray.push(obj); 
                    }
                }

                if(newArray.length>0){

                    hotel.updateHotelLangs(id, newArray).then((langs) => {
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
                    res.send("Language/s is already present at the Hotel");
                    res.end();
                    next();
                }
                
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

    }).delete(function (req, res, next) {

    });

    router.route('/:hotelid/quartos').get(function (req, res, next) {

        let id = req.params.hotelid;

        if (typeof id == 'string' && id.trim() !== "") {

            hotel.findAllRooms(id).then((quartos) => {
                res.status(200);
                res.send(quartos);
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

    }).post(function (req, res, next) {
        
        let id = req.params.hotelid;
        let body = req.body;

        if (typeof id == 'string' && id.trim() !== "") {

            body.id_hotel = id;

            hotel.createRoom(body).then((room) => {
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

    router.route('/:hotelid/quartos/:quartoid').get(function (req, res, next) {

        let idhotel = req.params.hotelid;
        let idroom = req.params.quartoid;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idroom == 'string' && idroom.trim() !== "")) {

            hotel.findOneRoom(idroom).then((quarto) => {
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

    }).delete(function (req, res, next) { 

        let idhotel = req.params.hotelid;
        let idroom = req.params.quartoid;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idroom == 'string' && idroom.trim() !== "")) {

            hotel.removeRoom(idroom).then(() => {
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

    router.route('/:hotelid/avalicao').get(function (req, res, next) {

        if (req.params.hotelid && typeof req.params.hotelid == "string") {

            let id = req.params.hotelid;


            hotel.findAllReviews(id).then((avs) => {
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

        }

    }).post(async (req, res, next) => {

        let body = req.body;

        //TODO: Mudar forma como obtenho o id depois de implementar o sistema de login

        if (
            (body.coment.length > 0 && typeof body.coment == 'string' && body.coment.trim() !== "" || body.coment.trim().length == 0)
            && (typeof body.id_user == 'string' && body.id_user.trim() !== "")
            && (typeof body.review == 'number' && (body.review >= 0 && body.review <= 10))
            && (req.params.hotelid && typeof req.params.hotelid == "string")
        ) {

            body.id_hotel = req.params.hotelid;

            hotel.createReview(body).then(() => {
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

    return router;
}

module.exports = hotelSettingsRouter;