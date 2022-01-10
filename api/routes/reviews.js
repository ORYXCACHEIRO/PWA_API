const express = require('express');

const reviews = require('../controllers/reviews');

const verifyToken = require('../middleware/verifyToken');
const {limitedAccess, onlyClient} = require('../middleware/verifyAccess');

function reviewRouter() {
    let router = express.Router({mergeParams: true});

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));


    router.route('/').get(function (req, res, next) {

        if (req.params.hotelid && typeof req.params.hotelid == "string") {

            let id = req.params.hotelid;

            reviews.findRevsByHotelId(id).then((avs) => {
                res.send(avs);
                res.status(200);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                res.status(401);
                res.end();
                next();
            });

        } else {
            res.status(401);
            res.end();
            next();
        }

    }).post(verifyToken, onlyClient, function (req, res, next) {

        let body = req.body;

        //TODO: Mudar forma como obtenho o id depois de implementar o sistema de login

        if (
            (body.coment && body.coment.length > 0 && typeof body.coment == 'string' && body.coment.trim() !== "" || !body.coment)
            && (typeof body.review == 'number' && (body.review >= 0 && body.review <= 5))
            && (req.params.hotelid && typeof req.params.hotelid == "string")
            && req.user_role ==0
        ) {

            let id = req.params.hotelid;
            body.id_hotel = id;
            body.id_user = req.user_id;

            reviews.checkReviews(id, body.id_user).then((result) => {

                if (result.length > 0) {
                    res.status(401);
                    res.end();
                    next();
                }

                body.id_hotel = req.params.hotelid;

                if (!body.coment) {
                    body.coment = "";
                }

                reviews.create(body).then(() => {
                    res.status(200);
                    res.send(body);
                    res.end();
                    next();
                }).catch((err) => {
                    //console.log(err);
                    err.status = err.status || 500;
                    res.status(401);
                    res.end();
                    next();
                });

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

    router.route('/:reviewId').delete(verifyToken, limitedAccess, function (req, res, next) {

        if (req.params.reviewId && typeof req.params.reviewId == "string") {

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

        } else {
            res.status(401);
            res.end();
            next();
        }

    });



    return router;

}

module.exports = reviewRouter;

