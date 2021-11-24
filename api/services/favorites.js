function favoritesService(Model) {
    let service = {
        create,
        findByUserId,
        removeById,
        findById
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

    
    function findById(values) {
        return new Promise(function (resolve, reject) {
            Model.findOne({ _id: values }, function (err, user) {
                if (err) reject(err);

                resolve(user);
            });
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



    return service;
}

module.exports = favoritesService;