function quartoService(Model) {

    let service = {
        create,
        findById,
        findByHotelId,
        removeById,
        updateById,
        removeAllHotelRooms,
        removeRoomComs,
        findRoomComs,
        updateRoomComs,
        findIdsByHotelId,
        findByRoomAndHotel
    };

    function findById(id){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.findById(id, function (err, room) {
                if (err) reject(err);

                resolve(room);
            }).select("-__v");
        });
    }

    function findRoomComs(id){
        return new Promise(function (resolve, reject) {
            Model.findById(id, function (err, room) {
                if (err) reject(err);

                resolve(room.comodities);
            }).select();
        });
    }

    function findByRoomAndHotel(idroom, idhotel){
        return new Promise(function (resolve, reject) {
            Model.findOne({_id: idroom, id_hotel: idhotel}, function (err, room) {
                if (err) reject(err);

                //console.log(room);

                if(room==null){
                    reject('Erro finding room');
                }

                resolve(room);
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

    function removeRoomComs(id, value){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, { $pull: { comodities:{ comodity: value } } }, {new: true}, function (err, room) {
                if (err) reject(err);

                resolve(room);
            }).select("-__v");
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

    function updateRoomComs(id, value){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, { $push: { comodities:{ comodity: value } } }, {new: true}, function (err, room) {
                if (err) reject(err);

                resolve(room);
            }).select("-__v");
        });
    }

    function findByHotelId(id, pagination){
        //let model = Model(value);
        var count = 0;

        const {limit, skip} = pagination;

        return new Promise(function (resolve, reject) {
            Model.find({id_hotel: id}, {}, {skip, limit}, function (err, rooms) {
                if (err) reject(err);

                count = rooms.length;

                resolve(rooms);
            }).select("-__v");

        }).then( async (rooms) => {
            const totalRooms = count || 0;

            return Promise.resolve({
                rooms: rooms,
                pagination: {
                    pageSize: limit,
                    page: Math.floor(skip/limit),
                    hasMore: (skip+limit)<totalRooms,
                    total: totalRooms
                }
            });
        });
    }

    function findIdsByHotelId(id){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.find({id_hotel: id}, '_id', function (err, rooms) {
                if (err) reject(err);

                resolve(rooms);
            });
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