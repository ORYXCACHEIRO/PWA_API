function profileService(Model) {
    let service = {
        findById
    };

    function findById(values) {
        return new Promise(function (resolve, reject) {
            Model.findOne({ _id: values }, function (err, user) {
                if (err) reject(err);

                resolve(user);
            });
        });
    }

    return service;
}

module.exports = profileService;