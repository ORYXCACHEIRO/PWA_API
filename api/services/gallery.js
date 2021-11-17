function galleryService(Model) {

    let services = {
        create,
        findAllByHotel,
        findAllByRoom,
        removeById,
        removeByHotelId,
        removeByRoomId
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

    function create(values) {
        let newImg = Model(values);
        return new Promise(function (resolve, reject) {
            newImg.save(function (err) {
                if (err) reject(err);

                resolve();
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

    function removeByHotelId(id){
        return new Promise(function (resolve, reject) {
            Model.deleteMany({id_hotel: id}, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function removeByRoomId(id){
        return new Promise(function (resolve, reject) {
            Model.deleteMany({id_room: id}, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    return services
}

module.exports = galleryService;