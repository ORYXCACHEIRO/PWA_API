const express = require('express');
const nodemailer = require("nodemailer");

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

    router.route('/recover').post(function (req, res, next) {

        let body = req.body;

        //console.log(email);

        if((body.email && typeof body.email=="string" && body.email.trim()!="")){

            users.findByEmailReq(body.email).then((usv) => {

                var transporter = nodemailer.createTransport({
                    service: 'outlook',
                    auth: {
                        user: 'naotepergunteinadapwa2@outlook.pt',
                        pass: '123456789!=?'
                    }
                });

                //console.log(usv);
                //naotepergunteinadapwa@hotmail.com  123456789!=?

                let createtoken = users.createToken_req_pass(usv._id, usv.email);

                var mailOptions = {
                    from: 'naotepergunteinadapwa2@outlook.pt',
                    to: usv.email,
                    subject: 'Recuparação da Password',
                    html: `<b>http://127.0.0.1:3000/auth/recover/${createtoken.token}</b>`, // html body
                };

                //console.log(usv.id)

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        err.status = err.status || 500;
                        res.status(401);
                        res.end();
                        next();
                    } else {
                        res.status(200);
                        res.send('Email sent: ' + info.response);
                        res.end();
                        next();
                    }
                });

            }).catch((err) => {
                console.log(err);
                err.status = err.status || 500;
                res.status(401);
                res.end();
                next();
            });

        } else {
            console.log("ajgbfsjabkjsdgb")
            res.status(401);
            res.end();
            next();
        }

    });


    //aletara passaword apos receber email, body contem apenas passaword
    router.route('/recover/:token').post(function (req, res, next) {

        let token = req.params.token;
        let body = req.body;

        if ((typeof token == 'string' && token.trim() !== "") && (body.password && typeof body.password=="string" && body.password.trim()!="")) {

            users.verifyToken_req_pass(token).then((decoded) => users.findById(decoded.id).then(() => users.updatePassword(decoded.id, body.password).then(() => {
                res.status(200);
                res.send('Password updated');
                res.end();
                next();
            }).catch((err) => {
                console.log(err);
                err.status = err.status || 500;
                res.status(401);
                res.end();
                next();
            }))).catch((err) => {
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