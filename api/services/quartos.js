function quartoService(Model) {

    let service = {
        create,
        findAll,
        findQuartById,
        findByHotelId
    };

    function findAll() {
        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, quartos) {
                if (err) reject(err);

                resolve(quartos);
            });
        });
    }

    function findQuartById(value){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.findOne({_id:value }, function (err, quartos) {
                if (err) reject(err);

                resolve(quartos);
            }).select("-__v");
        });
    }

    function findByHotelId(value){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.find({id_hotel:value }, function (err, quartos) {
                if (err) reject(err);

                resolve(quartos);
            }).select("-__v");
        });
    }


    function create(values) {
        let newQart = Model(values);
        return new Promise(function (resolve, reject) {
            newQart.save(function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    return service;

}

module.exports = quartoService;