const express = require('express');

const users = require('../controllers/user');
const reviews = require('../controllers/reviews');
const favorites = require('../controllers/favorites');
const reservas = require('../controllers/reservations');

const verifyToken = require('../middleware/verifyToken');
const {onlyClient, onlyEmployee} = require('../middleware/verifyAccess');
const reservations = require('../models/reservations');

function profileRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.route('/alt-password').put(verifyToken, function (req, res, next) { 

        let body = req.body;

        if((body.password && body.password.trim()!="") && (body.nPassword && body.nPassword.trim()!="")){
            
            if(body.password==body.nPassword){

                users.updatePassword(req.user_id, body.password).then(() => {
                    res.status(200);
                    res.end();
                    next();
                }).catch((err) => {
                    //console.log(err);
                    err.status = err.status || 500;
                    res.send({message: "Error editing password"});
                    res.status(401);
                    res.end();
                    next();
                });

            } else {
                res.status(401);
                res.send({message: "Passwords didnt match"});
                res.end();
                next();
            }
            

        } else {
            res.status(401);
            res.send({message: "Error editing password"});
            res.end();
            next();
        }

    });

    router.route('/settings').get(verifyToken, function (req, res, next) {

        users.findById(req.user_id).then((user) => {
            res.status(200);
            res.send(user);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            err.status = err.status || 500;
            res.status(401);
            res.end();
            next();
        });

    }).put(verifyToken, function (req, res, next) { 

        let body = req.body;

        if  ((!body.password && !body.role) && body.name.trim()!=="" && body.lastName.trim()!=="" && body.email.trim()!=="") {

            users.updateById(req.user_id, body).then((users) => {
                res.status(200);
                res.send(users);
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

    router.route('/reviews').get(verifyToken, onlyClient, function (req, res, next) {

        let id = req.user_id;
        reviews.findRevsByUserId(id).then((avs) => {
            res.status(200);
            res.send(avs);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            err.status = err.status || 500;
            res.status(401);
            res.end();
            next();
        });

    });

    router.route('/reviews/:userid').get(verifyToken, onlyClient, function (req, res, next) {

        let id = req.params.userid;
        reviews.findRevsByUserId(id).then((avs) => {
            res.status(200);
            res.send(avs);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            err.status = err.status || 500;
            res.status(401);
            res.end();
            next();
        });

    });

    router.route('/reviews/:revid').delete(verifyToken, onlyClient, function (req, res, next) {

        let id = req.params.revid;

        reviews.removeById(id).then(() => {
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

    });

    router.route('/reservations').get(verifyToken, onlyClient, function (req, res, next) {

        let id = req.user_id;
        reservas.findByUserId(id).then((avs) => {
            res.status(200);
            res.send(avs);
            res.end();
            next();
        }).catch((err) => {
            console.log(err);
            err.status = err.status || 500;
            res.status(401);
            res.end();
            next();
        });

    });

    router.route('/reservations/:userid').get(verifyToken, onlyClient, function (req, res, next) {

        let id = req.params.userid;
        reservas.findByUserId(id).then((avs) => {
            res.status(200);
            res.send(avs);
            res.end();
            next();
        }).catch((err) => {
            console.log(err);
            err.status = err.status || 500;
            res.status(401);
            res.end();
            next();
        });

    });


    
    router.route('/reservations/:resid').delete(verifyToken, onlyClient, function (req, res, next) {

        let id = req.params.resid;

        reservations.removeById(id).then(() => {
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

    });

    router.route('/favorites').get(verifyToken, onlyClient, function (req, res, next) {

        favorites.findByUserId(req.user_id).then((favorites) => {
            res.send(favorites);
            res.end();
            next();
        }).catch((err) => {
            console.log(err);
            next();
        });

    });

    router.route('/favorites/:hotelid').delete(verifyToken, onlyClient, function (req, res, next) {

        let id = req.params.hotelid;

        favorites.removeOneByHotelId(id).then(() => {
            res.status(200);
            res.send({response: "successfull"})
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            err.status = err.status || 500;
            res.send({
                response: "unsuccessfull",
                err: err
            })
            res.status(401);
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

    });

    return router;
}

module.exports = profileRouter;