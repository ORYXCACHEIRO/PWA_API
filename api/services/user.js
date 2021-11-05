function userService(Model) {

    let service = {
        create,
        findAll,
        findByEmail,
        findById
    };

    function findAll() {
        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, users) {
                if (err) reject(err);

                resolve(users);
            }).select("-password");
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