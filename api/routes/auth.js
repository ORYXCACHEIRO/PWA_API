const express = require('express');
const nodemailer = require("nodemailer");

const users = require('../controllers/user');
const recPass = require('../controllers/rec_pass');

const verifyToken = require('../middleware/verifyToken');

function authRouter() {

    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.route('/register').post(function (req, res, next) {

        const body = req.body;

        if((body.name && body.name.trim()!=="") && (body.lastName && body.lastName.trim()!=="") && (body.email && body.email.trim()!=="") && (body.password && body.password.trim()!=="") && (parseInt(body.role)<=1 || !body.role)){
            
            users.create(body).then((user) => users.createToken(user))
            .then((response) => {
                res.status(200);
                res.send({message: "User registered"});
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                res.status(500);
                res.send({message: "error registering user"});
                res.end();
                next();
            });

        } else {
            res.status(500);
            res.send({message: "error registering user"});
            res.end();
            next();
        }
        
    });

    router.route('/recover').post(function (req, res, next) {

        let body = req.body;

        if ((body.email && typeof body.email == "string" && body.email.trim() != "") && Object.keys(body).length == 1) {

            users.findByEmailReq(body.email).then(async (usv) => {

                delete body.email;

                var transporter = nodemailer.createTransport({
                    host: 'smtp-mail.outlook.com',
                    port: 587,
                    auth: {
                        user: 'dalima3@outlook.pt',
                        pass: '123456789!=?'
                    }
                });

                //naotepergunteinadapwa@hotmail.com  123456789!=?

                let createkey = await users.hashPasswordOnUpdate(`${usv._id}.${usv.email}`);
                body.key = createkey.replace(/\//g, "");


                var mailOptions = {
                    from: 'dalima3@outlook.pt',
                    to: usv.email,
                    subject: 'Recuparação da Password',
                    html: `<b>http://127.0.0.1:3000/recoverpass/${body.key}</b>`, // html body
                };


                body.id_user = usv._id;

                recPass.checkById(usv.id).then(() => recPass.create(body)).catch((err) => {
                    //console.log(err);
                    res.status(401);
                    res.end();
                    next();
                });

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {

                        recPass.removeById(usv.id).then(() => {
                            //console.log(error);
                            res.status(401);
                            res.end();
                            next();
                        });

                    }
                });

                res.status(200);
                res.send('Email sent');
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


    //aletara passaword apos receber email, body contem apenas passaword
    router.route('/recover/:key').post(function (req, res, next) {

        let key = req.params.key;
        let body = req.body;

        if ((typeof key == 'string' && key.trim() !== "") && (body.password && typeof body.password == "string" && body.password.trim() != "") && Object.keys(body).length == 1) {

            recPass.findByKey(key).then((reponse) => users.findById(reponse.id_user).then(() => users.updatePassword(reponse.id_user, body.password)).then(() => recPass.removeByKey(key).then(() => {
                res.status(200);
                res.send('Password updated');
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                err.status = err.status || 500;
                res.send(err);
                res.status(401);
                res.end();
                next();
            }))).catch((err) => {
                //console.log(err);
                err.status = err.status || 500;
                res.status(401);
                res.send(err);
                res.end();
                next();
            });

        } else {
            res.status(401);
            res.end();
            next();
        }

    });

    router.route('/login').post(function (req, res, next) {

        const body = req.body;

        if (!(typeof body.email == "string" && body.email.trim() !== "") && !(typeof body.password == "string" && body.password.trim() !== "")) {
            res.status(400).send("All input is required");
            res.end();
            next();
        }

        users.findByEmail(body).then((user) => users.createToken(user)).then((response) => {
            res.cookie('tokenn', response.token, { httpOnly: true });
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

    router.route('/me').get(verifyToken, function (req, res, next) {

        const token = req.cookies.tokenn;

        if (!token) {
            res.status(401).send({ auth: false, message: 'No token provided' }).end();
            next();
        }

        users.verifyToken(token).then((decoded) => {
            res.status(200).send({ auth: true, decoded }).end();
            next();
        }).catch((err) => {
            res.status(500);
            res.send(err);
            res.end();
            next();
        });

    });

    router.route('/logout').get(function (req, res, next) {
        res.clearCookie("tokenn");
        res.status(200);
        res.send({ logout: true });
        next();
    });

    return router;
}

module.exports = authRouter;