const express = require('express');
const comodities = require('../controllers/comodities');

function comoRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.route('/all').get(function (req, res, next) { 

        comodities.findAll().then((comodidades) => {
            res.send(comodidades);
            res.end();
            next();
        }).catch((err) => {
            console.log(err);
            next();
        });

    });

    router.route('/:com').get(function (req, res, next) { 

        if(req.params.com && typeof req.params.com=="string"){
            
            let id = req.params.com;

            comodities.findComById(id).then((com) => {
                res.send(com);
                res.end();
                next();
            }).catch((err) => {
                console.log(err);
                res.end();
                next();
            });

        }

    });

    router.route('/create').post(function (req, res, next) { 

        let body = req.body;

        if((typeof body.name=='string' && body.name.trim()!=="") && (body.free===0 || body.free===1) && body.type>=0){
            
            comodities.create(body).then(() => {
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

    });

    return router;
}

module.exports = comoRouter;