const express = require('express');
const reviews = require('../controllers/reviews');

function avaliacaoRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.route('/h/:hotelid').get(function (req, res, next) { 
        
        if(req.params.hotelid && typeof req.params.hotelid=="string"){

            let id = req.params.hotelid;

            reviews.findRevsByHotelId(id).then((avs) => {
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

    router.route('/:reviewId').get(function (req, res, next) { 

        if(req.params.reviewId && typeof req.params.reviewId=="string"){

            let id = req.params.reviewId;

            reviews.findRevById(id).then(() => {
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

        } else {
            res.status(401);
            res.end();
            next();
        }

    }).delete(function (req, res, next) { 
        
        if(req.params.reviewId && typeof req.params.reviewId=="string"){

            let id = req.params.reviewId;

            reviews.removeByRevId(id).then(() => {
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

        }  else {
            res.status(401);
            res.end();
            next();
        }

    });

    router.route('/u/:userid').get(function (req, res, next) { 

        if(req.params.userid && typeof req.params.userid=="string"){

            let id = req.params.userid;

            reviews.findRevsByUserId(id).then((avs) => {
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

        }  else {
            res.status(401);
            res.end();
            next();
        }

    });
    


    return router;
}

module.exports = avaliacaoRouter;