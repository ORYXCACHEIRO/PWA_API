const hotel = require('../controllers/hotel');
const room = require ('../controllers/rooms');

function comodidadesService(Model) {

    let service = {
        create,
        findAll,
        findComById,
        updateCom,
        removeById,
        removeComsFromHotel,
        findComByIdTable,
        findAllTable
    };

    //type 0 - hotel, 1 - quarto

    //free 0 - não, 1 - sim

    function removeComsFromHotel(value){
        return hotel.removeHotelComsAll(value);
    }

    function findAll() {

        return new Promise(function (resolve, reject) {

            Model.find({}, function (err, comodidades) {
                if (err) reject(err);

                resolve(comodidades);
            });

        });
    }

    function findAllTable(pagination) {

        const {limit, skip} = pagination;

        return new Promise(function (resolve, reject) {

            Model.find({}, {}, {skip, limit}, function (err, comodidades) {
                if (err) reject(err);

                resolve(comodidades);
            });

        }).then( async (comodidades) => {
            const totalComs = await Model.count();

            return Promise.resolve({
                coms: comodidades,
                pagination: {
                    pageSize: limit,
                    page: Math.floor(skip/limit),
                    hasMore: (skip+limit)<totalComs,
                    total: totalComs
                }
            });
        });
    }

    function findComById(value){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.findOne({_id:value }, function (err, comodidades) {
                if (err) reject(err);

                if(comodidades==null){
                    reject('This isnt a comodity or its type is incorrect');
                }

                resolve(comodidades);
            }).select("-__v");
        });
    }

    function findComByIdTable(value, pagination){
        //let model = Model(value);
        let arrayIds = [];

        if(value!=null){

            for(let i =0; i<value.length;i++){
                arrayIds.push(String(value[i].comodity));
            }

        }
        
        var count = 0;

        const {limit, skip} = pagination;

        return new Promise(function (resolve, reject) {
            Model.find({_id: {$in: arrayIds} }, {}, {skip, limit}, function (err, comodidades) {
                if (err) reject(err);

                if(comodidades==null){
                    reject('This isnt a comodity or its type is incorrect');
                }

                count = comodidades.length;

                resolve(comodidades);
            }).select("-__v");

        }).then( async (comodidades) => {
            const totalHotels = count;

            return Promise.resolve({
                comodidades: comodidades,
                pagination: {
                    pageSize: limit,
                    page: Math.floor(skip/limit),
                    hasMore: (skip+limit)<totalHotels,
                    total: totalHotels
                }
            });
        });
    }

    function updateCom(id, values){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id,values, {new: true}, function (err, comodidade) {
                if (err) reject(err);

                resolve(comodidade);
            }).select("-__v");
        });
    }

    function removeById(id){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndRemove(id, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function create(values) {
        let newComo = Model(values);
        return new Promise(function (resolve, reject) {
            newComo.save(function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    return service;

}

module.exports = comodidadesService;