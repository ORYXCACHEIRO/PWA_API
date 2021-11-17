const express = require('express');
const profile = require('../controllers/profile');
const users = require('../controllers/user');
const reviews = require('../controllers/reviews');
const favorites = require('../controllers/favorites');
const verifyToken = require('../middleware/verifyToken');

function profileRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    //6192a6edaabbf0f5264dc80c
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzcwOTY1OTEsImV4cCI6MTYzNzE4Mjk5MX0.1nCDy2rxQ9kBhLxzlhEX0RHQaDkvJHgYvkCalfF8YVk
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxOTQxYzhmYWRkMmIzYjhmMzQzYmNlNiIsImVtYWlsIjoiODIwMDEwN0Blc3RnLmlwcC5wdCIsInJvbGUiOiIwIiwiaWF0IjoxNjM3MTY1MTc2LCJleHAiOjE2MzcyNTE1NzZ9.6GMzqh21pKfCLv4MOCwFu1ud-8myGzUKg_F56p3fxv8

    // adicionar middleware~
    // favourites fazer tudo? schema id user id hotel
    // prontos


    /// necessita mudancas

    router.use(function (req, res, next) {
        let token = req.headers['x-access-token'];
        users.verifyToken(token).then((user) => {
            req.user = user;
            next();
        }).catch((err) => {
            res.status(401).send({ auth: false, message: 'No token provided' }).end();
        })
    })

    //// mas ta ca por necessidade


    router.use(verifyToken);


    router.route('/').get(function (req, res, next) {
        res.send(req.user);
        next();
    }

    );

    router.route('/reviews/:userid').get(function (req, res, next) {

        if (req.params.userid && typeof req.params.userid == "string") {

            let id = req.params.userid;
            reviews.findRevsByUserId(id).then((avs) => {
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

        } else {
            res.status(401);
            res.end();
            next();
        }

    });

    router.route('/favorites').get(function (req, res, next) {

        favorites.findByUserId(req.user.id).then((favorites) => {
            res.send(favorites);
            res.end();
            next();
        }).catch((err) => {
            console.log(err);
            next();
        });

    }).post(function (req, res, next) {

        let body = req.body;

        favorites.create(body).then(() => {
            res.status(200);
            res.send(body);
            next();
        }).catch((err) => {
            //console.log(err);
            err.status = err.status || 500;
            res.status(401);
            res.end();
            next();
        });

    });

    return router;
}

module.exports = profileRouter;