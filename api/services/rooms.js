function quartoService(Model) {

    let service = {
        create,
        findById,
        findByHotelId,
        removeById,
        updateById,
        removeAllHotelRooms
    };

    function findById(id){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.findById(id, function (err, quarto) {
                if (err) reject(err);

                resolve(quarto);
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

    function removeAllHotelRooms(id){
        return new Promise(function (resolve, reject) {
            Model.deleteMany({id_hotel: id}, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function updateById(id, values){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id,values, {new: true}, function (err, room) {
                if (err) reject(err);

                resolve(room);
            }).select("-__v");
        });
    }

    function findByHotelId(id){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.find({id_hotel: id}, function (err, quartos) {
                if (err) reject(err);

                resolve(quartos);
            }).select("-__v");
        });
    }


    function create(values) {
        let newQart = Model(values);
        return new Promise(function (resolve, reject) {
            newQart.save(function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    return service;

}

module.exports = quartoService;