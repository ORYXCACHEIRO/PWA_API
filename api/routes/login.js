const express = require('express');
const bcrypt = require('bcrypt');
const user = require('../controllers/user');

function LoginRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));
    router.set('trust proxy', true);

    router.route('/').post((req, res, next) => {

        let body = req.body;
        //const ip = req.ip;

        if (!(typeof body.email=="string" && body.email.trim()!=="") && !(typeof body.password=="string" && body.password.trim()!=="")) {
            res.status(400).send("All input is required");
            res.end();
            next();
        } else {
 
           user.findByEmail(body.email).then((user) => {

                bcrypt.compare(body.password, user.password, function (err, result) {

                    if (err) {
                        console.log(err);
                        res.status(404);
                        res.send('Email or password are incorrect');
                        res.end();
                        next();
                    }

                    if (result) {
                        res.status(200).send('Login successfull');
                        res.end();
                        next();
                    } else {
                        res.status(404);
                        res.send('Email or password are incorrect');
                        res.end();
                        next();
                    }

                });

           }).catch((err) => {
            //console.log(err);
            res.status(404);
            res.send('Email or password are incorrect');
            res.end();
            next();
           });
        }

    });

    return router;
}

module.exports = LoginRouter;