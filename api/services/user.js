function userService(Model) {

    let service = {
        create,
        findAll,
        findByEmail,
        findById,
        removeById,
        updateById
    };

    function findAll() {
        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, users) {
                if (err) reject(err);

                resolve(users);
            }).select("-password -role");
        });
    }

    function findById(values){
        return new Promise(function (resolve, reject) {
            Model.findOne({ _id: values }, function (err, user) {
                if (err) reject(err);

                resolve(user);
            }).select("-role");
        });
    }

    function findByEmail(values){
        return new Promise(function (resolve, reject) {
            Model.findOne({ email: values }, function (err, user) {
                if (err) reject(err);

                resolve(user);
            }).select("-role");
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

    function updateById(id, values){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id,values, {new: true}, function (err, user) {
                if (err) reject(err);

                resolve(user);
            }).select("-__v");
        });
    }

    function create(values) {
        let newUser = Model(values);
        return new Promise(function (resolve, reject) {
            newUser.save(function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    return service;

}

module.exports = userService;