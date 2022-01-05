function rec_passService(Model) {

    let service = { 
        create,
        removeByKey,
        findByKey,
        checkById,
        removeById
    };

    function findByKey(key){
        return new Promise(function (resolve, reject) {
            Model.findOne({key: key}, function (err, key) {
                if (err) reject(err);
                console.log("ad");
                console.log(key);
                console.log("eb");
                if(key==null || key.expire_date>Date.now){
                    reject('key invalidaaa');
                }


                resolve(key);
            }).select("-__v");
        });
    }


    function checkById(id){
        return new Promise(function (resolve, reject) {
            Model.deleteOne({id_user: id}, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function removeByKey(key){
        return new Promise(function (resolve, reject) {
            Model.deleteOne({key: key}, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function removeById(id){
        return new Promise(function (resolve, reject) {
            Model.deleteOne({_id: id}, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function create(values) {
        let newKey = Model(values);
        return new Promise(function (resolve, reject) {
            newKey.save(function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }


    return service;

}

module.exports = rec_passService;

