function hotelService(Model) {

    let service = {
        create,
        findAll,
        findAllWithStatus,
        findOneById
    };

    function findAll() {
        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, hoteis) {
                if (err) reject(err);

                resolve(hoteis);
            }).select("-visivel -__v");
        });
    }

    function findOneById(values){
        return new Promise(function (resolve, reject) {
            Model.findOne({_id:values}, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
            }).select("-visivel -__v");
        });
    }

    function findAllWithStatus() {
        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, hoteis) {
                if (err) reject(err);

                resolve(hoteis);
            });
        });
    }


    function create(values) {
        let newHotel = Model(values);
        return new Promise(function (resolve, reject) {
            newHotel.save(function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    return service;

}

module.exports = hotelService;