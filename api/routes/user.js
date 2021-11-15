const express = require('express');
const users = require('../controllers/user');
const reviews = require('../controllers/reviews');

function usersRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.route('/').get(function (req, res, next) {

        users.findAll().then((users) => {
            res.send(users);
            res.status(200);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            res.status(401);
            res.end();
            next();
        });

    });

    router.route('/:userid').get(function (req, res, next) {
        
        let id = req.params.userid;

        if (typeof id == 'string' && id.trim() !== "") {

            users.findById(id).then((user) => {
                res.send(user);
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

    }).put(function (req, res, next) { 

        let id = req.params.userid;
        let body = req.body;

        if  ((typeof id == 'string' && id.trim() !== "")) {

            users.findById(id).then(() => users.updateById(id, body)).then((user) => {
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

        } else {
            res.status(401);
            res.end();
            next();
        }

    }).delete(function (req, res, next) { 

        let id = req.params.userid;

        //TODO ELEMINAR TUDO DO UTILIZADOR AO ELIMINAR O UTILIZADOR, TAIS COMO AVALIAÇÕES DO MESMO

        if (typeof id == 'string' && id.trim() !== "") {

            users.findById(id).then(() => reviews.removeByUserId(id)).then(() => users.removeById(id)).then(() => {
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


module.exports = usersRouter;