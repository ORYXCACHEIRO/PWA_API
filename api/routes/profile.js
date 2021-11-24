const express = require('express');
const profile = require('../controllers/profile');
const users = require('../controllers/user');
const reviews = require('../controllers/reviews');
const favorites = require('../controllers/favorites');
const nodemailer = require("nodemailer");
const verifyToken = require('../middleware/verifyToken');

function profileRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));



    router.route('/mail/:email').get( function (req, res, next) {
        let email = req.params.email;

        console.log(email);
        nodemailer.createTestAccount((err, account) => {
            var transporter = nodemailer.createTransport({
                service: 'outlook',
                auth: {
                    user: 'naotepergunteinadapwa@hotmail.com',
                    pass: '123456789!=?'
                }
            });
            var mailOptions = {
                from: 'naotepergunteinadapwa@hotmail.com',
                to: email,
                subject: 'Trocar a Pass',
                text: 'http://127.0.0.1:3000/profile/mail/request' + reqid
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
        res.send("feitinho");
        next();

    });


    router.route('/mail/request').get(function (req, res, next) {
        res.send(req.userMemail);
        console.log(req.user);
        next();
    }).put(function (req, res, next) {

        let id = req.params.userid;
        let body = req.body;

        if ((typeof id == 'string' && id.trim() !== "")) {

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
            console.log(err);
            res.status(401);
            res.end();
            next();
        }

    });



    router.route('/').get(verifyToken, function (req, res, next) {
        res.send(req.user_id);
        next();
    }

    );

    router.route('/reviews/:userid').get(verifyToken, function (req, res, next) {

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


    router.route('/favorites').get(verifyToken, function (req, res, next) {

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

    router.route('/favorites/:favid').delete(verifyToken, function (req, res, next) {

        let id = req.params.favid;

        favorites.findById(id).then(() => favorites.removeById(id)).then(() => {
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

    return router;
}

module.exports = profileRouter;