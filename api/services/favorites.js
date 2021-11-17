function favoritesService(Model) {
    let service = {
        create,
        findByUserId
    };

    function create(values) {
        let newFavorite = Model(values);
        return new Promise(function (resolve, reject) {
            newFavorite.save(function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function findByUserId(value){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.find({ id_user:value }, function (err, favorites) {
                if (err) reject(err);

                resolve(favorites);
            })
        });
    }


    return service;
}

module.exports = favoritesService;