const express = require('express');
const avaliacao = require('../controllers/avaliacoes');
//const user = require('../controllers/user');
//const hotel = require('../controllers/hotel');

function avaliacaoRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));


    router.route('/h/:hotelid').get(function (req, res, next) { 
        
        if(req.params.hotelid && typeof req.params.hotelid=="string"){

            let id = req.params.hotelid;

            avaliacao.findAvsByHotelId(id).then((avs) => {
                res.send(avs);
                res.end();
                next();
            }).catch((err) => {
                console.log(err);
                res.end();
                next();
            });

        }

    });

    router.route('/u/:userid').get(function (req, res, next) { 

        if(req.params.userid && typeof req.params.hotelid=="string"){

            let id = req.params.userid;

            avaliacao.findAvsByUserId(id).then((avs) => {
                res.status(200);
                res.send(avs);
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

    });
    


    return router;
}

module.exports = avaliacaoRouter;