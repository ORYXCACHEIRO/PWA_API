function reservationService(Model) {

    let service = { 
        create,
        removeById,
        findById,
        findAllByRoomId,
        removeAllRoomRes,
        updateById,
        checkAvalability
    }

    function findAllByRoomId(id) {
        return new Promise(function (resolve, reject) {
            Model.find({id_room: id}, function (err, hoteis) {
                if (err) reject(err);

                resolve(hoteis);
            }).select("-__v");
        });
    }

    function findById(id){
        return new Promise(function (resolve, reject) {
            Model.findById(id, function (err, reserv) {
                if (err) reject(err);

                if(reserv==null){
                    reject('No reservation was found');
                }

                resolve(reserv);
            }).select("-__v");
        });
    }

    function checkAvalability(datai, dataf, idroom){
        //{"OrderDateTime":{ $gte:ISODate("2019-02-10"), $lt:ISODate("2019-02-21") }
        //$gt greater then
        //$lt lower then
        return new Promise(function (resolve, reject) {
            Model.find({ "begin_date" : { $gte:datai }, "end_date": { $lte: dataf }, id_room: idroom}, function (err, reserv) {
                if (err) reject(err);

                console.log(reserv);

                if(reserv==null || reserv.length>0){
                    reject('No avalability');
                }

                resolve(reserv);
            }).select("-__v");
        });
    }

    function updateById(id, values){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id,values, {new: true}, function (err, reserv) {
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

    function removeAllRoomRes(id){
        return new Promise(function (resolve, reject) {
            Model.deleteMany({id_room: id}, function (err) {
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