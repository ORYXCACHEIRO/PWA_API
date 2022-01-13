const express = require('express');
const langs = require('../../controllers/langs');

const verifyToken = require('../../middleware/verifyToken');
const {onlyAdmin, limitedAccess} = require('../../middleware/verifyAccess');
const pagination = require('../../middleware/pagination/paginationLangs');

function idiomaRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.use(verifyToken);
    router.use(pagination);

    router.route('/').get(limitedAccess, function (req, res, next) {

        langs.findAll().then((idiomas) => {
            res.status(200);
            res.send(idiomas);
            res.end();
            next();
        }).catch((err) => {
            console.log(err);
            res.status(401);
            res.send({message: "error getting languages"});
            res.end();
            next();
        });

    }).post(onlyAdmin, function (req, res, next) {

        let body = req.body;

        if(typeof body.name=='string' && body.name.trim()!==""){
            
            langs.create(body).then(() => {
                res.status(200);
                res.send({message: "Language added"});
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                err.status = err.status || 500;
                res.status(401);
                res.send({message: "Error adding language"});
                res.end();
                next();
            });
            
        } else {
            res.status(401);
            res.end();
            next();
        }

    });

    router.route('/table').get(onlyAdmin, function (req, res, next) {

        langs.findAllForTable(req.paginationLangs).then((idiomas) => {
            res.status(200);
            res.send(idiomas);
            res.end();
            next();
        }).catch((err) => {
            console.log(err);
            res.status(401);
            res.send({message: "error getting languages"});
            res.end();
            next();
        });

    });

    router.route('/:idiom').get(onlyAdmin, function (req, res, next) { 

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

    }).put(onlyAdmin, function (req, res, next) { 

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
            

    }).delete(onlyAdmin, function (req, res, next) { 

        let id = req.params.idiom;

        langs.findById(id).then(() => langs.removeLangsFromHotel(id)).then(() => langs.removeById(id)).then(() => {
            res.status(200);
            res.send({message: "Language deleted"});
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            err.status = err.status || 500;
            res.status(401);
            res.send({message: "Error deleting language"});
            res.end();
            next();
        });

    });

    return router;
}

module.exports = idiomaRouter;