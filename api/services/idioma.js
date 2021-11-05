function idiomaService(Model) {

    let service = {
        create,
        findAll,
        findById
    };

    function findAll() {
        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, idiomas) {
                if (err) reject(err);

                resolve(idiomas);
            });
        });
    }

    function findById(value){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.findOne({_id:value }, function (err, comodidades) {
                if (err) reject(err);

                resolve(comodidades);
            }).select("-__v");
        });
    }

    function create(values) {
        let newIdioma = Model(values);
        return new Promise(function (resolve, reject) {
            newIdioma.save(function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    return service;

}

module.exports = idiomaService;