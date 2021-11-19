const express = require('express');
const users = require('../controllers/user');
const verifyToken = require('../middleware/verifyToken');

function authRouter() {

    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.route('/register').post(function (req, res, next) {

        const body = req.body;

        users.create(body).then((user) => users.createToken(user))
            .then((response) => {
                res.status(200);
                res.send(response);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                res.status(500);
                res.send(err);
                res.end();
                next();
            });
    });

    router.route('/me').get(verifyToken);

    router.route('/login').post(function (req, res, next) { 

        const body = req.body;

        if (!(typeof body.email=="string" && body.email.trim()!=="") && !(typeof body.password=="string" && body.password.trim()!=="")) {
            res.status(400).send("All input is required");
            res.end();
            next();
        }

        users.findByEmail(body).then((user) => users.createToken(user)).then((response) => {
            res.status(200);
            res.send(response);
            res.end();
            next();
        }).catch((err) => {
            console.log(err);
            res.status(500);
            res.send(err);
            res.end();
            next();
        });
    }); 

    return router;
}

module.exports = authRouter;