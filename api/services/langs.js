function idiomaService(Model) {

    let service = {
        create,
        findAll,
        findById,
        removeById,
        updateLang
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

    function updateLang(id, values){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id,values, {new: true}, function (err, language) {
                if (err) reject(err);

                resolve(language);
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