const express = require('express');

const rooms = require('../../controllers/rooms');
const comodities = require('../../controllers/comodities');

const verifyToken = require('../../middleware/verifyToken');
const {limitedAccess} = require('../../middleware/verifyAccess');

function comsRouter() {
    let router = express.Router({mergeParams: true});

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));


    router.route('/').get(function (req, res, next) { 
        
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

    router.route('/:comid').put(verifyToken, limitedAccess,function (req, res, next) { 

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

    return router;
}

module.exports = comsRouter
