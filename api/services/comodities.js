const hotel = require('../controllers/hotel');

function comodidadesService(Model) {

    let service = {
        create,
        findAll,
        findComById,
        findHotelComsById,
        updateCom,
        removeById,
        removeComsFromHotel
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

    function findComById(value){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.findOne({_id:value }, function (err, comodidades) {
                if (err) reject(err);

                if(comodidade==null){
                    reject('This isnt a comodity or its type is incorrect');
                }

                resolve(comodidades);
            }).select("-__v");
        });
    }

    //função para verificar que o di que estamos a mandar é de facto
    //uma comodidade
    function findHotelComsById(value){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.findOne({_id: value, type: 0 }, function (err, comodidade) {
                if (err) reject(err);

                if(comodidade==null){
                    reject('This isnt a comodity or its type is incorrect');
                }

                resolve();
            }).select("-__v");
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