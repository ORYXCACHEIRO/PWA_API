const express = require('express');

const reservations = require('../controllers/reservations');
const rooms = require('../controllers/rooms');
const users = require('../controllers/user');
const pagination = require('../middleware/pagination/paginationUsers');

const verifyToken = require('../middleware/verifyToken');
const {limitedAccess, limitedAccessWithClient,  onlyClient} = require('../middleware/verifyAccess');

function reservationRouter() {
    let router = express.Router({mergeParams: true});

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));
    router.use(pagination);

    router.route('/').get(verifyToken, function (req, res, next) { 
        
        let idhotel = req.params.hotelid;
        let idroom = req.params.roomid;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idroom == 'string' && idroom.trim() !== "")) {

            rooms.findByRoomAndHotel(idroom, idhotel).then(() => reservations.findAllByRoomId(idroom, req.paginationUsers)).then((reservs) => {

                res.status(200);
                res.send(reservs);
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
            console.log("adesss")
            res.status(401);
            res.end();
            next();
        }

    }).post(verifyToken, function (req, res, next) { 

        let idhotel = req.params.hotelid;
        let idroom = req.params.roomid;
        let body = req.body;



        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idroom == 'string' && idroom.trim() !== "")) {

            rooms.findByRoomAndHotel(idroom, idhotel).then((room) => {


                body.id_room = idroom;

                let beginDate =  new Date(body.begin_date) || null;
                let endDate = new Date(body.end_date) || null;

                if(beginDate==null || endDate==null || (beginDate>endDate) || body.numberAdults && body.numberAdults>room.maxAdult || !body.id_user || body.numberAdults==0 ){
                    res.status(401);
                
                    res.send('Reservation is invalid');
                    res.end();
                    next();
                }

                //console.log(beginDate);
                //console.log(endDate);
            
                users.checkIfUserClient(body.id_user).then(() => reservations.checkAvalability(beginDate, endDate, idroom)).then(() => reservations.create(body)).then((reserv) => {
                    res.status(200);
                    res.send(reserv);
                    res.end();
                    next();
                }).catch((err) => {
                    console.log(err);
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

    router.route('/:res_id').get(verifyToken, limitedAccess, function (req, res, next) { 

        let idhotel = req.params.hotelid;
        let idroom = req.params.roomid;
        let idres = req.params.res_id;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idroom == 'string' && idroom.trim() !== "") && (typeof idres == 'string' && idres.trim() !== "")) {

            rooms.findByRoomAndHotel(idroom, idhotel).then(() => reservations.findById(idres)).then((reserv) => {
                res.status(200);
                res.send(reserv);
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
        let idres = req.params.res_id;
        let body = req.body;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idroom == 'string' && idroom.trim() !== "") && (typeof idres == 'string' && idres.trim() !== "")) {

            /* if(!body.begin_date && !body.end_date){

                reservations.updateById(idres).then((reserv) => {
                    res.status(200);
                    res.send(reserv);
                    res.end();
                    next();
                }).catch((err) => {
                    //console.log(err);
                    err.status = err.status || 500;
                    res.status(401);
                    res.end();
                    next();
                });

            } */

            rooms.findByRoomAndHotel(idroom, idhotel).then(() => reservations.findById(idres)).then((reserv) => {

                let bdDateBegin = reserv.begin_date;
                let bdDateEnd = reserv.end_date;

                if(body.begin_date){
                    //console.log("beggg");
                    let beginDate =  new Date(body.begin_date) || null;
                    bdDateBegin = beginDate;
                }

                if(body.end_date){
                    //console.log("sjkbgbjgs");
                    let endDate = new Date(body.end_date) || null;
                    bdDateEnd = endDate;
                }

                if(bdDateBegin==null || bdDateEnd==null || (bdDateBegin>bdDateEnd)){
                    res.status(401);
                    res.send('Dates are invalid');
                    res.end();
                    next();
                }

                //console.log("afaf");

                reservations.checkAvalabilityOnUpdate(bdDateBegin, bdDateEnd, idroom, idres).then(() => reservations.updateById(idres, body)).then((reserv) => {
                    res.status(200);
                    res.send(reserv);
                    res.end();
                    next();
                }).catch((err) => {
                    console.log(err);
                    err.status = err.status || 500;
                    res.status(401);
                    res.end();
                    next();
                });

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

    }).delete(verifyToken, limitedAccess, function (req, res, next) { 

        let idhotel = req.params.hotelid;
        let idroom = req.params.roomid;
        let idres = req.params.res_id;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idroom == 'string' && idroom.trim() !== "") && (typeof idres == 'string' && idres.trim() !== "")) {

           rooms.findByRoomAndHotel(idroom, idhotel).then(() => reservations.removeById(idres)).then((reserv) => {
                res.status(200);
                res.send(reserv);
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

    return router;
}

module.exports = reservationRouter;