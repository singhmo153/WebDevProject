"use strict";

var uuid = require('node-uuid');
var q = require("q");
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

module.exports = function(db, mongoose) {

    var UserSchema = require("./user.schema.server.js")(mongoose);
    var UserModel  = mongoose.model("UserModel", UserSchema);


    var api = {
        Create: Create,
        FindAll: FindAll,
        FindById: FindById,
        Update: Update,
        Delete: Delete,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials
    };
    return api;

    function Create(user) {
        var deferred = q.defer();
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if (err) return deferred.promise;
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return deferred.promise;
                user.password = hash;
                UserModel.create(user, function(err, user) {
                    if(err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(user);
                    }
                });
            });

        });

        return deferred.promise;
    }

    function FindAll() {
        var deferred = q.defer();
        UserModel.find(function (err, users) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(users);
            }
        });

        return deferred.promise;
    }

    function FindById(id) {
        var deferred = q.defer();
        UserModel.find({_id: {$in: id}}, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
        });

        return deferred.promise;
    }

    function Update(id, user) {
        var deferred = q.defer();

        delete user._id;
        UserModel.findOne({_id:id}, function(err, oldUser) {
            if(oldUser.password == user.password){
                UserModel.update({_id: id}, {$set: user}, function(err, user) {
                    if(err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(user);
                    }
                });
            }
            else{
                bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                    if (err) return deferred.promise;
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err) return deferred.promise;
                        user.password = hash;
                        UserModel.update({_id: id}, {$set: user}, function(err, user) {
                            if(err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(user);
                            }
                        });
                    });
                });
            }
        });
        return deferred.promise;
    }

    function Delete(id) {
        var deferred = q.defer();

        UserModel.remove({_id: id}, function(err, status) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(status);
            }
        });

        return deferred.promise;
    }

    function findUserByUsername(username) {
        var deferred = q.defer();
        UserModel.findOne({username: username}, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
        });

        return deferred.promise;
    }

    function findUserByCredentials(credentials) {
        var deferred = q.defer();

        UserModel.findOne(
            {
                username: credentials.username
            },
            function (err, user) {
                if (err) {
                    deferred.reject(err);
                } else {
                    bcrypt.compare(credentials.password, user.password, function (err, isMatch){
                        if(isMatch) {
                            deferred.resolve(user);
                        }
                    });

                }
            });

        return deferred.promise;
    }
}