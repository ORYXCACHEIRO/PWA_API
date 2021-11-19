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




    router.route('/mail').get(function (req, res, next) {
        let token = req.headers['x-access-token'];
        console.log(token);
        req.email = req.user_email;
        console.log(req.email);
        nodemailer.createTestAccount((err, account) => {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'ticadeliobeta@gmail.com',
                  pass: '90GRTEABCc!'
                }
              });
            var mailOptions = {
                from: 'deus@gmail.com',
                to: req.email,
                subject: 'A coca que eu nao vi',
                text: 'http://127.0.0.1:3000/profile/mail/' + token
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


    router.route('/mail/:token').get(function (req, res, next) {
        res.send(req.user.password);
        console.log(req.user);
        next();
    }

    );



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

    router.route('/favorites/:favid').delete(function (req, res, next) {

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