const express = require('express');
const idiomas = require('../controllers/idioma');

function idiomaRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.route('/all').get(function (req, res, next) {

        idiomas.findAll().then((idiomas) => {
            res.send(idiomas);
            res.end();
            next();
        }).catch((err) => {
            console.log(err);
            next();
        });

    });

    router.route('/:idiom').get(function (req, res, next) { 

        if(req.params.idiom && typeof req.params.idiom=="string"){
            
            let id = req.params.idiom;

            idiomas.findById(id).then((idi) => {
                res.send(idi);
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

        if(typeof body.name=='string' && body.name.trim()!==""){
            
            idiomas.create(body).then(() => {
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

module.exports = idiomaRouter;