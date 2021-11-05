const express = require('express');
//var data = require('../config/players');
const users = require('../controllers/user');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');

function userRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));
    router.set('trust proxy', true);

    router.route('/').post(async (req, res, next) => {
        let body = req.body;

        if(!(body.name && body.password && body.lastname && body.email)){

            let encryptedPassword = undefined;

            if(typeof body.password=='string' && body.password.trim()!="" && body.password.length>=4){
                const salt = await bcrypt.genSalt(10);
                encryptedPassword = await bcrypt.hash(body.password, salt);
            }
            
            if(typeof encryptedPassword!='undefined'){

                const newUser = new userModel({
                    name: body.name,
                    lastName: body.lastName,
                    email: body.email.toLowerCase(),
                    password: encryptedPassword,
                    last_ip_con: req.ip
                });
        
                users.create(newUser).then(() => {
                    res.status(200);
                    //res.send(body);
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
            
        } else {
            res.status(401);
            res.end();
            next();
        }
        

    });

    return router;
}

module.exports = userRouter;