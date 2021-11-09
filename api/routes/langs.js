const express = require('express');
const langs = require('../controllers/langs');

function idiomaRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.route('/all').get(function (req, res, next) {

        langs.findAll().then((idiomas) => {
            res.send(idiomas);
            res.end();
            next();
        }).catch((err) => {
            console.log(err);
            next();
        });

    }).post(function (req, res, next) {

        let body = req.body;

        if(typeof body.name=='string' && body.name.trim()!==""){
            
            langs.create(body).then(() => {
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

    router.route('/:idiom').get(function (req, res, next) { 

        if(req.params.idiom && typeof req.params.idiom=="string"){
            
            let id = req.params.idiom;

            langs.findById(id).then((idi) => {
                res.send(idi);
                res.end();
                next();
            }).catch((err) => {
                console.log(err);
                res.end();
                next();
            });

        }

    }).put(function (req, res, next) { 

        let body = req.body;
        let id = req.params.idiom;
            
        langs.updateLang(id,body).then((lang) => {
            res.status(200);
            res.send(lang);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            err.status = err.status || 500;
            res.status(401);
            res.end();
            next();
        });
            

    }).delete(function (req, res, next) { 

        let id = req.params.idiom;

        langs.removeById(id).then(() => {
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

module.exports = idiomaRouter;