const express = require('express');
const comodities = require('../../controllers/comodities');

const verifyToken = require('../../middleware/verifyToken');
const {onlyAdmin} = require('../../middleware/verifyAccess');
const pagination = require('../../middleware/pagination/paginationLangs');

function comoRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.use(verifyToken);
    router.use(onlyAdmin);
    router.use(pagination);

    router.route('/').get(function (req, res, next) { 

        comodities.findAll(req.paginationLangs).then((comodidades) => {
            res.status(200);
            res.send(comodidades);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            err.status = err.status || 500;
            res.status(401);
            res.end();
            next();
        });

    }).post(function (req, res, next) { 

        let body = req.body;
        console.log(parseInt(body.free))

        if((typeof body.name==='string' && body.name.trim()!=="") && (parseInt(body.free)===0 || parseInt(body.free)===1)){
            
            comodities.create(body).then(() => {
                res.status(200);
                res.send({message: "comodity created"});
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                err.status = err.status || 500;
                res.status(401);
                res.send({message: "error creating comodity"});
                res.end();
                next();
            });

        } else {
            res.status(401);
            res.send({message: "error creating comodity"});
            res.end();
            next();
        }

    });

    router.route('/:com').get(function (req, res, next) { 

        if(req.params.com && typeof req.params.com=="string"){
            
            let id = req.params.com;

            comodities.findComById(id).then((com) => {
                res.status(200);
                res.send(com);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                err.status = err.status || 500;
                res.status(401);
                res.end();
                next();
            });

        }

    }).put(function (req, res, next) { 

        let body = req.body;

        if((typeof body.name=='string' && body.name.trim()!=="") && (parseInt(body.free)===0 || parseInt(body.free)===1)){

            let id = req.params.com;

            comodities.updateCom(id, body).then((com) => {
                res.status(200);
                res.send({message: "comodity edited"});
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                err.status = err.status || 500;
                res.status(401);
                res.send({message: "Error editing comodity"});
                res.end();
                next();
            });

        } else {
            res.status(401);
            res.send({message: "error editing comodity"});
            res.end();
            next();
        }
    
    }).delete(function (req, res, next) { 
        
        let idcom = req.params.com;

        comodities.findComById(idcom).then(() => comodities.removeComsFromHotel(idcom)).then(() => comodities.removeById(idcom))
        .then(() => {
            res.status(200);
            res.end();
            next();
        }).catch((err) => {
            console.log(err);
            err.status = err.status || 500;
            res.status(401);
            res.end();
            next();
        });

    });

    return router;
}

module.exports = comoRouter;