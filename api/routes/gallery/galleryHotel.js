const express = require('express');

const gallery = require('../../controllers/gallery');
const config = require('../../config/config');

const verifyToken = require('../../middleware/verifyToken');
const {limitedAccess} = require('../../middleware/verifyAccess');

function galleryRouter() {
    let router = express.Router({mergeParams: true});

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.route('/').get(function (req, res, next) {

        if (req.params.hotelid && typeof req.params.hotelid == "string") {

            let id = req.params.hotelid;

            gallery.findAllByHotel(id).then((photos) => {
                res.send(photos);
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

    }).post(verifyToken, limitedAccess, function (req, res, next) {

        let body = req.body;

        if (req.params.hotelid && typeof req.params.hotelid == "string") {

            let id = req.params.hotelid;

            body.id_room = "";
            body.id_hotel = id;

            if(!body.path || body.path && body.path.trim().length<3){
                res.status(401);
                res.send('Invalid image');
                res.end();
                next();
            }

            let extension = body.path.slice(-4);

            if(!config.valideImgFormat.includes(extension)){
                res.status(401);
                res.send('Invalid image format');
                res.end();
                next();
            }

            gallery.create(body).then(() => {
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

    });

    router.route('/:photoid').delete(verifyToken, limitedAccess,function (req, res, next) {

        if ((req.params.hotelid && typeof req.params.hotelid == "string") && (req.params.photoid && typeof req.params.photoid == "string")) {

            let photoid = req.params.photoid;

            gallery.removeById(photoid).then(() => {
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

module.exports = galleryRouter;