function reservationService(Model) {

    let service = { 
        create,
        removeById,
        findOneById,
        findAllByRoomId
    }

    function findAllByRoomId(id) {
        return new Promise(function (resolve, reject) {
            Model.find({id_room: id}, function (err, hoteis) {
                if (err) reject(err);

                resolve(hoteis);
            }).select("-__v");
        });
    }

    function findOneById(id){
        return new Promise(function (resolve, reject) {
            Model.findById(id, function (err, reserv) {
                if (err) reject(err);

                resolve(reserv);
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
        let newReservation = Model(values);
        return new Promise(function (resolve, reject) {
            newReservation.save(function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    return service;
}

module.exports = reservationService;