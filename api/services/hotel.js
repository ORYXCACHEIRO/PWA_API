function hotelService(Model) {

    let service = {
        create,
        findAll,
        findOneById,
        findAllRecomended,
        updateById,
        removeById,
        findHotelLangs,
        updateHotelLangs,
        removeHotelLang,
        removeHotelLangsAll,
        CheckHotelComs,
        updateHotelComs,
        removeHotelComs,
        removeHotelComsAll,
        searchHotelbyName,
        findByWorkStationsId,
        findByFavId,
        findAllHotelComs
    };

    //---------------------Comodities---------------------------

    //TODO fazer um check se io que está a inserir é uma comodidade existente e se é do tipo de hotel

    function CheckHotelComs(com, id) {
        return new Promise(function (resolve, reject) {
            Model.findOne({"comodities.comodity": com, _id: id}, function (err, coms) {
                if (err) reject(err);

                resolve(coms);
            }).select("");
        });
    }

    function  findAllHotelComs(id) {
        return new Promise(function (resolve, reject) {
            Model.findOne({_id: id}, function (err, coms) {
                if (err) reject(err);

                resolve(coms.comodities);
            }).select("");
        });
    }


    function updateHotelComs(id, value) {
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, { $push: { comodities: { comodity: value } } }, { new: true }, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
            }).select("-__v");
        });
    }

    //remove hotel em especifico
    function removeHotelComs(id, value) {
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, { $pull: { comodities: { comodity: value } } }, { new: true }, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
            }).select("-__v");
        });
    }


    //procura os hoteis por nome, se calhar

    function searchHotelbyName(name) {
        return new Promise(function (resolve, reject) {
            Model.find({ $text: { $search: name } }, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
            }).sort( { name: 1 } );
        });
    }


    //remove de todos os hoteis
    function removeHotelComsAll(value) {
        return new Promise(function (resolve, reject) {
            Model.updateMany({}, { $pull: { comodities: { comodity: value } } }, { new: true }, function (err) {
                if (err) reject(err);

                resolve();
            }).select("-__v");
        });
    }

    //--------------------Languages------------------------------

    function findHotelLangs(id) {
        return new Promise(function (resolve, reject) {
            Model.findById(id, 'languages', function (err, langs) {
                if (err) reject(err);
                resolve(langs);
            }).select("-_id");
        });
    }

    function updateHotelLangs(id, values) {
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, { $push: { languages: { language: values } } }, { new: true }, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
            }).select("-__v");
        });
    }

    function removeHotelLang(id, value) {
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, { $pull: { languages: { language: value } } }, { new: true }, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
            }).select("-__v");
        });
    }

    function removeHotelLangsAll(value) {
        return new Promise(function (resolve, reject) {
            Model.updateMany({}, { $pull: { languages: { language: value } } }, { new: true }, function (err) {
                if (err) reject(err);

                resolve();
            }).select("-__v");
        });
    }

    //-----------------------Hotel--------------------------
    function findAll(pagination) {

        const {limit, skip} = pagination;

        return new Promise(function (resolve, reject) {
            Model.find({}, {}, {skip, limit}, function (err, hoteis) {
                if (err) reject(err);

                resolve(hoteis);
            }).select("-__v");

        }).then( async (hoteis) => {
            const totalHotels = await Model.count();

            return Promise.resolve({
                hotels: hoteis,
                pagination: {
                    pageSize: limit,
                    page: Math.floor(skip/limit),
                    hasMore: (skip+limit)<totalHotels,
                    total: totalHotels
                }
            });
        });
    }

    function findByWorkStationsId(array, pagination) {

        let arrayIds = [];

        for(let i =0; i<array.length;i++){
            arrayIds.push(String(array[i].hotel));
        }

        const {limit, skip} = pagination;

        return new Promise(function (resolve, reject) {
            Model.find({_id: {$in : arrayIds}}, {}, {skip, limit}, function (err, hoteis) {
                if (err) reject(err);

                resolve(hoteis);
            }).select("-__v");

        }).then( async (hoteis) => {
            const totalHotels = await Model.count();

            return Promise.resolve({
                hotels: hoteis,
                pagination: {
                    pageSize: limit,
                    page: Math.floor(skip/limit),
                    hasMore: (skip+limit)<totalHotels,
                    total: totalHotels
                }
            });
        });
    }

    function findByFavId(array, pagination) {

        let arrayIds = [];

        for(let i =0; i<array.length;i++){
            arrayIds.push(String(array[i].id_hotel));
        }

        const {limit, skip} = pagination;

        return new Promise(function (resolve, reject) {
            Model.find({_id: {$in : arrayIds}}, {}, {skip, limit}, function (err, hoteis) {
                if (err) reject(err);               

                resolve(hoteis);
            }).select("-__v");

        }).then( async (hoteis) => {
            const totalHotels = await Model.count();

            return Promise.resolve({
                hotels: hoteis,
                pagination: {
                    pageSize: limit,
                    page: Math.floor(skip/limit),
                    hasMore: (skip+limit)<totalHotels,
                    total: totalHotels
                }
            });
        });
    }

    function findAllRecomended() {
        return new Promise(function (resolve, reject) {
            Model.find({recomended: 1}, function (err, hoteis) {
                if (err) reject(err);

                resolve(hoteis);
            }).select("-__v");
        });
    }

    function findOneById(id) {
        return new Promise(function (resolve, reject) {
            Model.findById(id, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
            }).select("-__v");
        });
    }


    function updateById(id, values) {
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, values, { new: true }, function (err, hotel) {
                if (err) reject(err);

                resolve(hotel);
            }).select("-__v");
        });
    }

    function removeById(id) {
        return new Promise(function (resolve, reject) {
            Model.findByIdAndRemove(id, function (err) {
                if (err) reject(err);

                resolve();
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