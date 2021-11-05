const express = require('express');
const idiomas = require('../controllers/idioma');
const comodidades = require('../controllers/comodidades');
const hotel = require('../controllers/hotel');
const avaliacao = require('../controllers/avaliacoes');
const quartos = require('../controllers/quartos');

function hotelSettingsRouter() {
    let router = express();

    router.use(express.json({ limit: '100mb' }));
    router.use(express.urlencoded({ limit: '100mb', extended: true }));


    router.route('/all').get(function (req, res, next) { 

        hotel.findAll().then((hotel) => {
            res.send(hotel);
            res.end();
            next();
        }).catch((err) => {
            //console.log(err);
            res.end();
            next();
        });

    });

    router.route('/:hotelid').get(function (req, res, next) { 

        let id = req.params.hotelid;

        if(typeof id=='string' && id.trim()!==""){

            hotel.findOneById(id).then((hotel) => {
                res.status(200);
                res.send(hotel);
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

    router.route('/:hotelid/quartos').get(function (req, res, next) { 

        let id = req.params.hotelid;

        if(typeof id=='string' && id.trim()!==""){

            quartos.findByHotelId(id).then((quartos) => {
                res.status(200);
                res.send(quartos);
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

    router.route('/:hotelid/avalicao').get(function (req, res, next) { 
        
        if(req.params.hotelid && typeof req.params.hotelid=="string"){

            let id = req.params.hotelid;

            avaliacao.findAvsByHotelId(id).then((avs) => {
                res.send(avs);
                res.end();
                next();
            }).catch((err) => {
                //console.log(err);
                res.end();
                next();
            });

        }

    }).post(async (req, res, next) => { 

        let body = req.body;

        //TODO: Mudar forma como obtenho o id depois de implementar o sistema de login

        if(
            (body.coment.length>0 && typeof body.coment=='string' && body.coment.trim()!=="" || body.coment.trim().length==0) 
            && (typeof body.id_user=='string' && body.id_user.trim()!=="")
            && (typeof body.avalicao=='number' && body.avalicao>=0 && body.categoria<=10) 
            && (req.params.hotelid && typeof req.params.hotelid=="string")
        ){

            body.id_hotel = req.params.hotelid;

            avaliacao.create(body).then(() => {
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

        } else {
            res.status(401);
            res.end();
            next();
        }

    });
    
    router.route('/create').post(async (req, res, next) => { 

        let body = req.body;

        if(
            (typeof body.name=='string' && body.name.trim()!=="") 
            && (typeof body.descricao=='string' && body.descricao.trim()!=="")
            && (typeof body.categoria=='number' && body.categoria>=0 && body.categoria<=5) 
            && (typeof body.morada=='string' && body.morada.trim()!=="") 
            && (typeof body.cpostal=='string' && body.cpostal.trim()!=="") 
            && (typeof body.local=='string' && body.local.trim()!=="")
            && (typeof body.local_gmaps=='string' && body.local_gmaps.trim()!=="") 
            && (typeof body.imagem_principal=='string' && body.imagem_principal.trim()!=="") 
            && (typeof body.sobre_hotel=='string' && body.sobre_hotel.trim()!=="")
            && typeof body.comodidades=='object' 
            && typeof body.idiomas=='object' 
            && (typeof body.visivel=='number' && (body.visivel==0 || body.visivel==1))
        ){

            let coms = [];
            let idioma = [];

            if(body.comodidades.length>0){
                for(let i = 0;i<body.comodidades.length;i++){

                    await comodidades.findComById(body.comodidades[i]._id).then((como) => {
                        coms.push(como._id);
                    }).catch((err) => {
                      //erro  
                    });
                }
            }

            if(body.idiomas.length>0){
                
                for(let i = 0;i<body.idiomas.length;i++){

                    await idiomas.findById(body.idiomas[i]._id).then((idiom) => {
                        idioma.push(idiom._id);
                    }).catch((err) => {
                      //erro  
                    });
                }
                
            }
                     
            body.comodidades = coms;
            body.idiomas = idioma;
          
            hotel.create(body).then(() => {
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

        } else {
            res.status(401);
            res.end();
            next();
        }

    });

    return router;
}

module.exports = hotelSettingsRouter;