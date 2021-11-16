const express = require('express');
const profile = require('../controllers/profile');
const users = require('../controllers/user');
const reviews = require('../controllers/reviews');

function profileRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    //6192a6edaabbf0f5264dc80c
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzcwOTY1OTEsImV4cCI6MTYzNzE4Mjk5MX0.1nCDy2rxQ9kBhLxzlhEX0RHQaDkvJHgYvkCalfF8YVk
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxOTQxYzhmYWRkMmIzYjhmMzQzYmNlNiIsImVtYWlsIjoiODIwMDEwN0Blc3RnLmlwcC5wdCIsInJvbGUiOiIwIiwiaWF0IjoxNjM3MDk3NDg3LCJleHAiOjE2MzcxODM4ODd9.1iZY1-8wxlY7XaLp4VJ81-6V-PHRYDO2iqf_ar2Tw4c



    router.use(function (req, res, next) {
        let token = req.headers['x-access-token'];
        users.verifyToken(token).then((user) => {
            req.user = user;
            next();
        }).catch((err) => {
            res.status(401).send({auth:false, message: 'No token provided'}).end();
        })
    })


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

    return router;
}

module.exports = profileRouter;