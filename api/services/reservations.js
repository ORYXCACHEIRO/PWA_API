function reservationService(Model) {

    let service = { 
        create,
        removeById,
        findById,
        findAllByRoomId,
        findAll,
        removeAllRoomRes,
        updateById,
        checkAvalability,
        checkAvalabilityOnUpdate,
        findByUserId,
        findByUserIdForTable
    }

    function findByUserId(value){
        return new Promise(function (resolve, reject) {
            Model.find({ id_user:value }, function (err, reserv) {
                if (err) reject(err);

                resolve(reserv);
            }).select("-__v");
        });
    }

    function findByUserIdForTable(value, pagination){

        const {limit, skip} = pagination;

        return new Promise(function (resolve, reject) {
            Model.find({ id_user:value }, {}, {skip, limit}, function (err, reserv) {
                if (err) reject(err);

                resolve(reserv);
            }).select("-__v");

        }).then( async (reserv) => {
            const totalRes = await Model.count();

            return Promise.resolve({
                reserv: reserv,
                pagination: {
                    pageSize: limit,
                    page: Math.floor(skip/limit),
                    hasMore: (skip+limit)<totalRes,
                    total: totalRes
                }
            });
        });
    }

    function findAll(){
        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, reserv) {
                if (err) reject(err);

                resolve(reserv);
            }).select("-__v");
        });
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
        //$gte greater then or equal
        //$lte lower then or equal
        //$ne not equal
        return new Promise(function (resolve, reject) {
            Model.find({ "begin_date" : { $gte:datai }, "end_date": { $lte: dataf }, id_room: idroom}, function (err, reserv) {
                if (err) reject(err);

                //console.log(reserv);

                if(reserv==null || reserv.length>0){
                    reject('No avalability');
                }

                resolve(reserv);
            }).select("-__v");
        });
    }

    function checkAvalabilityOnUpdate(datai, dataf, idroom, idres){
        //{"OrderDateTime":{ $gte:ISODate("2019-02-10"), $lt:ISODate("2019-02-21") }
        //$gte greater then or equal
        //$lte lower then or equal
        //$ne not equal
        return new Promise(function (resolve, reject) {
            Model.find({ "begin_date" : { $gte:datai }, "end_date": { $lte: dataf }, id_room: idroom, "_id": {$ne: idres}}, function (err, reserv) {
                if (err) reject(err);

                //console.log(reserv);

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

        let arrayIds = [];

        for(let i =0; i<id.length;i++){
            arrayIds.push(String(id[i]._id));
        }

        return new Promise(function (resolve, reject) {
            Model.deleteMany({id_room: {$in: arrayIds}}, function (err) {
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