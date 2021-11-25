const hotel = require('../controllers/hotel');

const express = require('express');

function searchRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));

    router.route('/hotel/:name').get(function (req, res, next) {
           
            let name = req.params.name;
            String(name);
            //console.log(name);
            hotel.searchHotelbyName(name).then((avs) => {
                //console.log("b");
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


    });

    return router;
}

module.exports = searchRouter;