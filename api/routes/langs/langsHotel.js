const express = require('express');

const langs = require('../../controllers/langs');
const hotel = require('../../controllers/hotel');

const verifyToken = require('../../middleware/verifyToken');
const {limitedAccess} = require('../../middleware/verifyAccess');

function langsRouter() {
    let router = express.Router({mergeParams: true});

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.route('/').get(function (req, res, next) {

        let id = req.params.hotelid;

        if (typeof id == 'string' && id.trim() !== "") {

            hotel.findHotelLangs(id).then((langs) => {
                res.status(200);
                res.send(langs)
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

    }).put(verifyToken, limitedAccess,function (req, res, next) {

        let id = req.params.hotelid;
        let body = req.body;

        if (typeof id == 'string' && id.trim() !== "" && (body.language && typeof body.language == 'string' && body.language.trim() !== ""))  {

            langs.findById(body.language).then(() => hotel.findHotelLangs(id)).then((langss) => {

                if (langss.languages.filter(function (e) { return e.language === body.language; }).length > 0) {
                    res.status(401);
                    res.send("Language/s is already present at the Hotel");
                    res.end();
                    next();
                } else {

                    hotel.updateHotelLangs(id, body.language).then((hotel) => {
                        res.status(200);
                        res.send(hotel)
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

            }).catch((err) => {
                console.log(err);
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

    router.route('/:langid').put(verifyToken, limitedAccess, function (req, res, next) {

        let idhotel = req.params.hotelid;
        let idlang = req.params.langid;

        if ((typeof idhotel == 'string' && idhotel.trim() !== "") && (typeof idlang == 'string' && idlang.trim() !== "")) {

            hotel.removeHotelLang(idhotel, idlang).then((langs) => {
                res.status(200);
                res.send(langs);
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

module.exports = langsRouter;