const express = require('express');

const comodities = require('../../controllers/comodities');
const hotel = require('../../controllers/hotel');
const pagination = require('../../middleware/pagination/paginationUsers');

const verifyToken = require('../../middleware/verifyToken');
const {limitedAccess} = require('../../middleware/verifyAccess');

function comsRouter() {
    let router = express.Router({mergeParams: true});

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));
    router.use(pagination);

    router.route('/').get(function (req, res, next) {

        let id = req.params.hotelid;

        if (typeof id == 'string' && id.trim() !== "") {

            hotel.findAllHotelComs(id).then((coms) => {
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

            comodities.findComById(body.comodity).then(() => hotel.CheckHotelComs(body.comodity, id)).then((coms) => {
                if (coms!=null) {
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
                        console.log(err);
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

    router.route('/table').get(function (req, res, next) {

        let id = req.params.hotelid;

        if (typeof id == 'string' && id.trim() !== "") {

            hotel.findAllHotelComs(id).then((coms) => comodities.findComByIdTable(coms, req.paginationUsers)).then((coms) => {
                res.status(200);
                res.send(coms)
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
            res.status(401);
            res.end();
            next();
        }

    });

    router.route('/:comid').put(verifyToken, limitedAccess,function (req, res, next) {

        let idhotel = req.params.hotelid;
        let idcom = req.params.comid;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idcom == 'string' && idcom.trim() !== "")) {

            hotel.removeHotelComs(idhotel, idcom).then(() => {
                res.status(200);
                res.send({message: "comodity removed"});
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                err.status = err.status || 500;
                res.status(401);
                res.send({message: "error removing comodity"});
                res.end();
                next();
            });

        } else {
            res.status(401);
            res.send({message: "error removing comodity"});
            res.end();
            next();
        }

    });


    router.route('/:com').get(function (req, res, next) { 

        if(req.params.com && typeof req.params.com=="string"){
            
            let id = req.params.com;

            comodities.findComById(id).then((com) => {
                res.status(200);
                res.send(com);
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

    });

    return router;





}

module.exports = comsRouter;