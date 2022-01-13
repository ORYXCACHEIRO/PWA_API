const hotel = require ('../controllers/hotel');

function idiomaService(Model) {

    let service = {
        create,
        findAll,
        findById,
        removeById,
        removeLangsFromHotel,
        updateLang,
        findAllForTable,
        findAllForHotelTable
    };

    function removeLangsFromHotel(value){
        return hotel.removeHotelLangsAll(value);
    }

    function findAll() {

        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, languages) {
                if (err) reject(err);

                resolve(languages);
            }).select('-__v');
        });
    }

    function findAllForHotelTable(value, pagination) {

        const {limit, skip} = pagination;

        let arrayIds = [];

        if(value!=null){

            for(let i =0; i<value.length;i++){
                arrayIds.push(String(value[i].language));
            }

        }

        var count = 0;

        return new Promise(function (resolve, reject) {
            Model.find({_id: {$in: arrayIds} }, {}, {skip, limit}, function (err, languages) {
                if (err) reject(err);

                if(languages!=null){
                    count = languages.length;
                }

                resolve(languages);
            }).select('-__v');

        }).then( async (languages) => {
            const totalLangs = count; 

            return Promise.resolve({
                langs: languages,
                pagination: {
                    pageSize: limit,
                    page: Math.floor(skip/limit),
                    hasMore: (skip+limit)<totalLangs,
                    total: totalLangs
                }
            });
        });
        
    }

    function findAllForTable(pagination) {

        const {limit, skip} = pagination;

        return new Promise(function (resolve, reject) {
            Model.find({}, {}, {skip, limit}, function (err, languages) {
                if (err) reject(err);

                resolve(languages);
            }).select('-__v');

        }).then( async (languages) => {
            const totalLangs = await Model.count();

            return Promise.resolve({
                langs: languages,
                pagination: {
                    pageSize: limit,
                    page: Math.floor(skip/limit),
                    hasMore: (skip+limit)<totalLangs,
                    total: totalLangs
                }
            });
        });
        
    }

    function findById(value){
        //let model = Model(value);
        return new Promise(function (resolve, reject) {
            Model.findOne({_id:value }, function (err, language) {
                if (err) reject(err);

                if(language==null){
                    reject('No language was found');
                }

                resolve(language);
            }).select("-__v");
        });
    }

    function updateLang(id, values){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id,values, {new: true}, function (err, language) {
                if (err) reject(err);

                resolve(language);
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
        let newIdioma = Model(values);
        return new Promise(function (resolve, reject) {
            newIdioma.save(function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    return service;

}

module.exports = idiomaService;