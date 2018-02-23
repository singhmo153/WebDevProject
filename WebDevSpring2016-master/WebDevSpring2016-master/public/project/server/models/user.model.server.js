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
        findUserByCredentials: findUserByCredentials,
        Following: Following,
        updateFollowing: updateFollowing,
        deleteFollowing: deleteFollowing,
        getBooks: getBooks,
        deleteBook: deleteBook,
        deleteReview: deleteReview,
        getReviews: getReviews
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
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
               // console.log(user);
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


    function Following(userId) {
        var deferred = q.defer();

        UserModel.find({_id: {$in: userId}}, function (err, users) {

            if (err) {
                deferred.reject(err);
            } else {
                var following = [];
                var userFollowing = users[0].following;
                deferred.resolve(userFollowing);
            }
        });

        return deferred.promise;
    }

    function getBooks(userId) {
        var deferred = q.defer();
        UserModel.findOne({_id: userId}, function (err, users) {
            if (err) {

                deferred.reject(err);
            } else {
                deferred.resolve(users.books);
            }
        });

        return deferred.promise;
    }

    function getReviews(userId) {
        var deferred = q.defer();
        UserModel.findOne({_id: userId}, function (err, users) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(users.reviews);
            }
        });

        return deferred.promise;
    }

    function updateFollowing(userId, following) {
        var deferred = q.defer();
        var newFollowing=null;
        UserModel.findOne({_id: userId}, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                UserModel.findOne({username: following}, function (err, followingUser) {
                    if(err) {
                        deferred.reject(err);
                    } else {
                        newFollowing = followingUser;
                        user.following.push(followingUser._id);
                    }
                });

                deferred.resolve(newFollowing);
            }
        });

        return deferred.promise;
    }

    function deleteFollowing(userId, followingId) {
        var deferred = q.defer();
        var newFollowing=null;
        UserModel.findOne({_id: userId}, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                var following = user.following;
                for(var i=0; i<following.length; i++){
                    if(following[i] == followingId || following[i] == null){
                        following.splice(i,1);
                    }
                }
                user.following = following;
                user.save(function(err, updatedUser) {
                    if(err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(updatedUser);
                    }
                });
            }
        });

        return deferred.promise;
    }

    function deleteBook(userId, bookId) {
        var deferred = q.defer();
        var newFollowing=null;
        UserModel.findOne({_id: userId}, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                var books = user.books;

                for(var i=0; i<books.length; i++){
                    if(books[i]._id == bookId){
                        books.splice(i,1);
                    }
                }
                user.books = books;
                user.save(function(err, updatedUser) {
                    if(err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(updatedUser);
                    }
                });
            }
        });

        return deferred.promise;
    }

    function deleteReview(userId, reviewId) {
        var deferred = q.defer();
        var newFollowing=null;
        UserModel.findOne({_id: userId}, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                var reviews = user.reviews;

                for(var i=0; i<reviews.length; i++){
                    if(reviews[i]._id == reviewId){
                        reviews.splice(i,1);
                    }
                }
                user.reviews = reviews;
                user.save(function(err, updatedUser) {
                    if(err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(updatedUser);
                    }
                });
            }
        });

        return deferred.promise;
    }
}