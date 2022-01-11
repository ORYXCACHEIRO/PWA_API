const express = require('express');

const users = require('../controllers/user');
const reviews = require('../controllers/reviews');
const hotel = require('../controllers/hotel');
const favorites = require('../controllers/favorites');
const reservations = require('../controllers/reservations');

const verifyToken = require('../middleware/verifyToken');
const {onlyAdmin} = require('../middleware/verifyAccess');
const paginationn = require('../middleware/pagination/paginationUsers');
const req = require('express/lib/request');

function usersRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.use(verifyToken);
    router.use(onlyAdmin);
    router.use(paginationn);

    router.route('/workstation/:userid').get(function (req, res, next) { 

        let id = req.params.userid;

        users.findAllWorkStations(id).then((works) => hotel.findByWorkStationsId(works, req.paginationUsers)).then((hoteis) => {
            res.status(200);
            res.send(hoteis);
            res.end();
            next();
        }).catch((err) => {
            console.log(err);
            err.status = err.status || 500;
            res.status(401);
            res.end();
            next();
        });

    }).put(function (req, res, next) { 

        let id = req.params.userid;
        let body = req.body;

        console.log(body);

        if(id.trim()!="" && Object.keys(body).length==1 && body.hotel && typeof body.hotel=="string" && body.hotel.trim()!=""){

           hotel.findOneById(body.hotel).then(() =>  users.checkIfUserEmployee(id)).then(() => users.checkWorkStation(id, body.hotel)).then(() => users.addWorkStation(id, body.hotel)).then((work) => {
                res.status(200);
                res.send(work.workStation);
                res.end();
                next();
            }).catch((err) => {
                console.log(err);
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

    }).delete(function (req, res, next) { 
    
        let id = req.params.userid;
        let body = req.body;

        if(id.trim()!="" && Object.keys(body).length==1 && body.hotel && typeof body.hotel=="string" && body.hotel.trim()!=""){

            hotel.findOneById(body.hotel).then(() => users.removeWorkStation(id, body.hotel)).then((users) => {
                res.status(200);
                res.send(users);
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

    router.route('/alt-password/:userid').put( function (req, res, next) { 

        let id = req.params.userid;
        let body = req.body;

        if((body.password && body.password.trim()!="") && (body.nPassword && body.nPassword.trim()!="")){

            if(body.password==body.nPassword){
                
                users.updatePassword(id, body.password).then(() => {
                    res.status(200);
                    res.end();
                    next();
                }).catch((err) => {
                    //console.log(err);
                    err.status = err.status || 500;
                    res.status(400);
                    res.send({message: "Error editing password"});
                    res.end();
                    next();
                });

            }
            else {
                res.status(401);
                res.send({message: "Passwords didnt match"});
                res.end();
                next();
            }
            
            

        } else {
            res.status(400);
            res.send({message: "Error editing password"});
            res.end();
            next();
        }

    });


    router.route('/').get(function (req, res, next) {
        users.findAllTable(req.paginationUsers).then((users) => {
            res.send(users);
            res.status(200);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            res.status(400);
            res.end();
            next();
        });

    });

    router.route('/reservations/:userid').get(function (req, res, next) {

        let id = req.params.userid;

        reservations.findByUserIdForTable(id, req.paginationUsers).then((revs) => {
            res.send(revs);
            res.status(200);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            res.status(400);
            res.end();
            next();
        });

    });

    router.route('/reviews/:userid').get(function (req, res, next) {

        let id = req.params.userid;
        reviews.findRevsByUserIdLimit(id, req.paginationUsers).then((avs) => {
            res.status(200);
            res.send(avs);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            err.status = err.status || 500;
            res.status(401);
            res.send({message: "error finding reviews"});
            res.end();
            next();
        });

    });

    router.route('/reviews/:revid').delete(function (req, res, next) {

        let id = req.params.revid;
        reviews.removeByRevId(id).then(() => {
            res.status(200);
            res.send({message: "review deleted"});
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            err.status = err.status || 500;
            res.status(401);
            res.send({message: "error deleting review"});
            res.end();
            next();
        });

    });

    router.route('/count').get(function (req, res, next) {

        users.findAll().then((users) => {
            res.send(users);
            res.status(200);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            res.status(400);
            res.end();
            next();
        });

    });

    router.route('/favs/:userid').get(function (req, res, next) {

        let id = req.params.userid;

        favorites.findByUserId(id).then((favs) => hotel.findByFavId(favs, req.paginationUsers)).then((hotels) => {
            res.send(hotels);
            res.status(200);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            res.status(400);
            res.end();
            next();
        });

    });

    router.route('/favs/:userid').delete(function (req, res, next) {

        let id = req.params.userid;
        let body = req.body;

        favorites.removeById(id, body.id_hotel).then(() => {
            res.send({message: "favorite deleted"});
            res.status(200);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            res.status(400);
            res.send({message: "error deleting favorite"});
            res.end();
            next();
        });

    });

    router.route('/:userid').get(function (req, res, next) {
        
        let id = req.params.userid;

        if (typeof id == 'string' && id.trim() !== "" ) {

            users.findById(id).then((user) => {
                res.send(user);
                res.status(200);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                res.status(400);
                res.end();
                next();
            });

        } else {
            res.status(400);
            res.end();
            next();
        }

    }).put(function (req, res, next) { 

        let id = req.params.userid;
        let body = req.body;

        if  ((typeof id == 'string' && id.trim() !== "" && !body.password && !body.role)) {

            users.findById(id).then(() => users.updateById(id, body)).then((user) => {
                res.status(200);
                res.send(user);
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

    }).delete(function (req, res, next) { 

        let id = req.params.userid;

        if (typeof id == 'string' && id.trim() !== "") {

            users.checkIfUserAdmin(id).then(() =>  favorites.removeByUserId(id)).then(() =>  reviews.removeByUserId(id)).then(() => users.removeById(id)).then(() => {
                res.status(200);
                res.send({message: "User deleted"});
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

    return router;

}


module.exports = usersRouter;