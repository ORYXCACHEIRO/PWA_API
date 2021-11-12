const jwt = require('jsonwebtoken');
const config = require('../config/db');
const bcrypt = require('bcrypt');

function userService(Model) {

    let service = {
        create,
        findAll,
        findByEmail,
        findById,
        removeById,
        updateById,
        createToken,
        verifyToken
    };

    function findAll() {
        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, users) {
                if (err) reject(err);

                resolve(users);
            }).select("-password -role");
        });
    }

    function findById(values) {
        return new Promise(function (resolve, reject) {
            Model.findOne({ _id: values }, function (err, user) {
                if (err) reject(err);

                resolve(user);
            });
        });
    }

    function findByEmail({ email, password }) {
        return new Promise(function (resolve, reject) {
            Model.findOne({ email }, function (err, user) {
                if (err) reject(err);

                resolve(user);
            });
        }).then((user) => {
            return comparePassword(password, user.password).then((match) => {

                if (!match) return Promise.reject("User is not valid");

                return Promise.resolve(user);

            });
        });
    }

    function createToken(user) {
        let token = jwt.sign({ id: user._id, email: user.email, role: user.role }, config.secret, {
            expiresIn: config.expiresPassword
        });

        return { auth: true, token }
    }

    function verifyToken(token) {
        return new Promise(function (resolve, reject) {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) reject()

                return resolve(decoded);
            });
        });
    }

    function hashPassword(user) {
        return bcrypt.hash(user.password, config.saltRounds);
    }

    function comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }

    function removeById(id) {
        return new Promise(function (resolve, reject) {
            Model.findByIdAndRemove(id, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function updateById(id, values) {
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, values, { new: true }, function (err, user) {
                if (err) reject(err);

                resolve(user);
            }).select("-__v");
        });
    }

    function create(values) {
        return hashPassword(values).then((hashpass, err) => {

            if (err) {
                return Promise.reject("Not saved");
            }

            console.log(values);

            let newUserWithPassword = {
                ...values,
                password: hashpass
            }

            let newUser = Model(newUserWithPassword);
            return save(newUser);
        });
    }

    function save(newUser) {
        return new Promise(function (resolve, reject) {
            newUser.save(function (err) {
                if (err) reject(err);

                resolve('User created!!');
            });
        });
    }

    return service;

}

module.exports = userService;