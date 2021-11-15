const hotel = require ('../controllers/hotel');

function idiomaService(Model) {

    let service = {
        create,
        findAll,
        findById,
        removeById,
        removeLangsFromHotel,
        updateLang
    };

    function removeLangsFromHotel(value){
        return hotel.removeHotelLangsAll(value);
    }

    function findAll() {
        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, languages) {
                if (err) reject(err);

                resolve(languages);
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