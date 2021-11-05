function comodidadesService(Model) {

    let service = {
        create,
        findAll,
        findComById
    };

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

                resolve(comodidades);
            }).select("-__v");
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