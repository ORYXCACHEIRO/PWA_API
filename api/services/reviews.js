function reviewService(Model) {

    let service = {
        create,
        findRevById,
        findRevsByHotelId,
        findRevsByUserId,
        removeByRevId,
        checkReviews
    };


    function removeByRevId(id){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndRemove(id, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function findRevById(id){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.findById(id, function (err, avaliacao) {
                if (err) reject(err);

                resolve(avaliacao);
            }).select("-__v");
        });
    }

    //Ve se o utilziador ja tem uma reviw no hotel, e no caso de ja ter retorna true
    function checkReviews(idhotel, iduser){
        return new Promise(function (resolve, reject) {
            Model.find({id_hotel:idhotel, id_user: iduser}, function (err, review) {
                if (err) reject(err);

                resolve(review);
            });
        });
    }

    function findRevsByHotelId(value){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.find({id_hotel:value }, function (err, avaliacoes) {
                if (err) reject(err);

                resolve(avaliacoes);
            }).select("-__v");
        });
    }

    function findRevsByUserId(value){
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

module.exports = reviewService;