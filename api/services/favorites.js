function favoritesService(Model) {
    let service = {
        create,
        findByUserId,
        removeById,
        findById,
        removeByHotelId,
        removeByUserId,
        checkIfFavorite,
        removeOneByHotelId,
        findByUserIdForTable
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

    function findByUserIdForTable(value, pagination){

        const {limit, skip} = pagination;
        
        return new Promise(function (resolve, reject) {
            Model.find({ id_user:value }, {}, {skip, limit}, function (err, favorites) {
                if (err) reject(err);

                resolve(favorites);
            });
        }).then( async (favorites) => {
            const totalFavs = await Model.count();

            return Promise.resolve({
                favorites: favorites,
                pagination: {
                    pageSize: limit,
                    page: Math.floor(skip/limit),
                    hasMore: (skip+limit)<totalFavs,
                    total: totalFavs
                }
            });
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

    function removeById(id, idhotel){
        return new Promise(function (resolve, reject) {
            Model.findOneAndDelete({$and: [{"id_user": id}, {"id_hotel": idhotel}]}, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function checkIfFavorite(iduser, idhotel){
        return new Promise(function (resolve, reject) {
            Model.find({ id_user: iduser, id_hotel: idhotel}, function (err, user) {
                if (err) reject(err);

                if(user==null || user.length>0){
                    reject('Error adding hotel to favorites');
                }

                resolve();
            });
        });
    }

    function removeByHotelId(id){
        return new Promise(function (resolve, reject) {
            Model.deleteMany({id_hotel: id}, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function removeOneByHotelId(id){
        return new Promise(function (resolve, reject) {
            Model.deleteOne({id_hotel: id}, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function removeByUserId(id){
        return new Promise(function (resolve, reject) {
            Model.deleteMany({id_user: id}, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }



    return service;
}

module.exports = favoritesService;