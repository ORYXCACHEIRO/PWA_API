const jwt = require('jsonwebtoken');
const config = require('../config/config');
const bcrypt = require('bcrypt');

function userService(Model) {

    let service = {
        create,
        findAll,
        findByEmail,
        findById,
        removeById,
        removeWorkStation,
        updateById,
        createToken,
        verifyToken,
        findAllWorkStations,
        addWorkStation,
        findByEmailReq,
        updatePassword,
        hashPasswordOnUpdate,
        checkWorkStation,
        checkIfUserAdmin,
        checkIfUserEmployee,
        checkIfUserClient
    };

    function findAll() {
        return new Promise(function (resolve, reject) {
            Model.find({}, function (err, users) {
                if (err) reject(err);

                resolve(users);
            }).select("-password");
        });
    }

    function findById(id) {
        //console.log(id);
        return new Promise(function (resolve, reject) {
            Model.findById(id, function (err, user) {
                if (err) reject(err);

                resolve(user);
            }).select("-password");
        });
    }

    function findByEmailReq(email) {
        return new Promise(function (resolve, reject) {
            Model.findOne({email: email}, function (err, user) {
                if (err) reject(err);

                resolve(user);
            }).select("-password");
        });
    }


    function findAllWorkStations(id,) {
        return new Promise(function (resolve, reject) {
            Model.findById(id, function (err, users) {
                if (err) reject(err);

                resolve(users.workStation);
            }).select("-password");
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
        let token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, config.secret, {
            expiresIn: config.expiresPassword
        });

        return { auth: true, token }
    }

    function verifyToken(token) {
        return new Promise(function (resolve, reject) {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) reject(err)

                return resolve(decoded);
            });
        });
    }

    function hashPassword(user) {
        return bcrypt.hash(user.password, config.saltRounds);
    }

    //esta funcção é utilizada também para criar keys para recuparação de passwords
    function hashPasswordOnUpdate(password) {
        return bcrypt.hash(password, config.saltRounds);
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

    async function updatePassword(id, password){
        
        let hashPass = await hashPasswordOnUpdate(password);

        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, {password: hashPass}, { new: true }, function (err) {
                if (err) reject(err);

                resolve();
            });
        });
    }

    function addWorkStation(id, value){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, { $push: { workStation:{ hotel: value } } }, {new: true}, function (err, workStations) {
                if (err) reject(err);

                resolve(workStations);
            }).select("-__v");
        });
    }

    
    function removeWorkStation(id, value){
        return new Promise(function (resolve, reject) {
            Model.findByIdAndUpdate(id, { $pull: { workStation:{ hotel: value } } }, {new: true}, function (err, workStations) {
                if (err) reject(err);

                resolve(workStations);
            }).select("-__v");
        });
    }

    function checkIfUserAdmin(id){
        return new Promise(function (resolve, reject) {
            Model.findById(id, function (err, user) {
                if (err) reject(err);

                if(user==null || user.length==0 || user.role==2 ){
                    reject('Error deleting this user');
                }

                resolve(user);
            }).select("-password -__v");
        });
    }

    function checkIfUserClient(id){
        return new Promise(function (resolve, reject) {
            Model.findById(id, function (err, user) {
                if (err) reject(err);

                if(user==null || user.length==0 || user.role!=0 ){
                    reject('User not valid');
                }

                resolve(user);
            }).select("-password -__v");
        });
    }

    function checkIfUserEmployee(id){
        return new Promise(function (resolve, reject) {
            Model.find({ $and: [{_id: id, role: 1}]}, function (err, user) {
                if (err) reject(err);

                if(user==null || user.length==0 || user.role!=1){
                    reject('Error deleting this user');
                }

                resolve();
            }).select("-password -__v");
        });
    }

    function checkWorkStation(id, idhotel){
        return new Promise(function (resolve, reject) {
            Model.find({_id: id, workStation:{ $elemMatch: { hotel: idhotel} }}, function (err, users) {
                if (err) reject(err);

                //console.log(users);

                if(users==null || users.length>0){
                    reject('User already has one workstation with that value');
                }

                resolve();
            });
        });
    }

    function create(values) {
        return hashPassword(values).then((hashpass, err) => {

            if (err) {
                return Promise.reject("Not saved");
            }

            //console.log(values);

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