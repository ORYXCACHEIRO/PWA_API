const express = require('express');

const reservations = require('../controllers/reservations');

const verifyToken = require('../middleware/verifyToken');
const {limitedAccess} = require('../middleware/verifyAccess');

function reservationRouter() {
    let router = express.Router({mergeParams: true});

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.route('/').get(function (req, res, next) { 
        
        let idhotel = req.params.hotelid;
        let idroom = req.params.roomid;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idroom == 'string' && idroom.trim() !== "")) {

            reservations.findAllByRoomId(idroom).then((reservs) => {
                res.status(200);
                res.send(reservs);
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

        /*
        let idhotel = req.params.hotelid;
        let idroom = req.params.roomid;
        let body = req.body;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idroom == 'string' && idroom.trim() !== "")) {
        
            //if(body)
            let data = Date.now;
            res.send(new Date);

        } else {
            res.status(401);
            res.end();
            next();
        }
        */

    });

    router.route('/:res_id').get(function (req, res, next) { 

    }).put(function (req, res, next) { 

    }).delete(function (req, res, next) { });

    return router;
}

module.exports = reservationRouter;