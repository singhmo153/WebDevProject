"use strict";

var uuid = require('node-uuid');
var q = require("q");
module.exports = function(db, mongoose) {

    var BookSchema = require("./book.schema.server.js")(mongoose);
    var BookModel  = mongoose.model("BookModel", BookSchema);

    var api = {
        Create: Create,
        FindAll: FindAll,
        FindById: FindById,
        Delete: Delete,
        findBookByTitle: findBookByTitle,
        findReviews: findReviews,
        update: update,
        FindAllReviews: FindAllReviews
    };
    return api;

    function Create(book) {
        var deferred = q.defer();
        BookModel.create(book, function(err, book) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(book);
            }
        });
        return deferred.promise;
    }

    function update(bookId, newReview){
        var deferred = q.defer();
        //delete newReview._id;
        BookModel.findOne({bookId: bookId}, function (err, book) {
            if (err) {
                deferred.reject(err);
            } else {
                console.log(book.reviews)
                var reviews = book.reviews;
                for(var i = 0; i<reviews.length; i++){
                    if(reviews[i]._id == newReview._id){
                        reviews.splice(i, 1);
                    }
                }
                console.log(reviews);
                reviews.push(newReview);
                book.reviews = reviews;
                console.log(book.reviews)
                book.save(function (err, updatedBook) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(updatedBook);
                    }
                });
            }
        });
        return deferred.promise;
    }

    function FindAll() {
        var deferred = q.defer();
        BookModel.find(function (err, books) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(books);
            }
        });
        return deferred.promise;
    }

    function FindAllReviews(bookId){
        var deferred = q.defer();
        BookModel.findOne({bookId: bookId}, function (err, book) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(book.reviews);
            }
        });

        return deferred.promise;
    }

    function FindById(id) {
        var deferred = q.defer();
        BookModel.findOne({bookId: id}, function (err, book) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(book);
            }
        });

        return deferred.promise;
    }

    function Delete(id) {
        var deferred = q.defer();
        BookModel.remove({_id: id}, function(err, status) {
            if(err) {
                deferred.reject(err);
            } else {
                status.save(function(err, updatedUser) {
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

    function findBookByTitle(title) {
        var deferred = q.defer();
        BookModel.findOne({title: title}, function (err, book) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(book);
            }
        });

        return deferred.promise;
    }

    function findReviews(id) {
        var deferred = q.defer();
        BookModel.findOne({_id: id}, function (err, book) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(book.reviews);
            }
        });
        return deferred.promise;
    }
}
