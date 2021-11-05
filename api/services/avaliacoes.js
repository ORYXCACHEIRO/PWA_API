function avaliaService(Model) {

    let service = {
        create,
        findAll,
        findAvById,
        findAvsByHotelId,
        findAvsByUserId
    };

    function findAll() {
        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, avaliacoes) {
                if (err) reject(err);

                resolve(avaliacoes);
            });
        });
    }

    function findAvById(value){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.findOne({_id:value }, function (err, avaliacao) {
                if (err) reject(err);

                resolve(avaliacao);
            }).select("-__v");
        });
    }

    function findAvsByHotelId(value){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.find({id_hotel:value }, function (err, avaliacoes) {
                if (err) reject(err);

                resolve(avaliacoes);
            }).select("-__v");
        });
    }

    function findAvsByUserId(value){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.find({ id_user:value }, function (err, avaliacoes) {
                if (err) reject(err);

                resolve(avaliacoes);
            }).select("-__v");
        });
    }

    function create(values) {
        let newAv = Model(values);
        return new Promise(function (resolve, reject) {
            newAv.save(function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    return service;

}

module.exports = avaliaService;