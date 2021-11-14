function galleryService(Model) {

    let services = {
        createForHotel,
        createForRoom,
        findAllByHotel,
        findAllByRoom,
        removeById,
        updateById
    };

    function findAllByHotel(id) {
        return new Promise(function (resolve, reject) {
            Model.findById(id, function (err, gallery) {
                if (err) reject(err);

                resolve(gallery);
            }).select("-status -__v");
        });
    }

    function findAllByRoom(id) {
        return new Promise(function (resolve, reject) {
            Model.findById(id, function (err, gallery) {
                if (err) reject(err);

                resolve(gallery);
            }).select("-status -__v");
        });
    }

    function createForHotel(values) {
        let newImg = Model(values);
        return new Promise(function (resolve, reject) {
            newImg.save(function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function createForRoom(values) {
        let newImg = Model(values);
        return new Promise(function (resolve, reject) {
            newImg.save(function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function updateById(id, values){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id,values, {new: true}, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
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

    return services
}

module.exports = galleryService;