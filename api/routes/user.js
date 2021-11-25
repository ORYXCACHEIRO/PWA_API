const express = require('express');

const users = require('../controllers/user');
const reviews = require('../controllers/reviews');
const hotel = require('../controllers/hotel');

const verifyToken = require('../middleware/verifyToken');
const {onlyAdmin} = require('../middleware/verifyAccess');

function usersRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.use(verifyToken);
    router.use(onlyAdmin);

    router.route('/workstation/:userid').get(function (req, res, next) { 

        let id = req.params.userid;

        if(id.trim()!=""){

            users.findById(id).then((user) => {
                res.status(200);
                res.send(user.workStation);
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

    }).put(function (req, res, next) { 

        let id = req.params.userid;
        let body = req.body;

        if(id.trim()!="" && Object.keys(body).length==1 && body.hotel && typeof body.hotel=="string" && body.hotel.trim()!=""){

            console.log("dsgsdgsdgg")

           hotel.findOneById(body.hotel).then(() => users.checkWorkStation(id, body.hotel)).then(() => users.addWorkStation(id, body.hotel)).then((work) => {
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

        if(body.password && body.password.trim()!=""){
            
            users.updatePassword(id, body.password).then(() => {
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


    router.route('/').get(function (req, res, next) {

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

            users.checkIfUserAdmin(id).then(() => reviews.removeByUserId(id)).then(() => users.removeById(id)).then(() => {
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

    return router;

}


module.exports = usersRouter;