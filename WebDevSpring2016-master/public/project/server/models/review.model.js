"use strict";

var uuid = require('node-uuid');
var q = require("q");
module.exports = function(db, mongoose) {

    var ReviewSchema = require("./review.schema.server.js")(mongoose);
    var ReviwModel  = mongoose.model("ReviewModel", ReviewSchema);

    var api = {
        Create: Create,
        FindAll: FindAll,
        Update: Update,
        Delete: Delete
    };
    return api;

    function Create(review) {
        var deferred = q.defer();
        ReviwModel.create(review, function(err, review) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(review);
            }
        });
        return deferred.promise;
    }

    function FindAll(userId) {
        var deferred = q.defer();

        ReviwModel.findById({userId: userId}, function (err, reviws) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(reviws);
            }
        });
        return deferred.promise;
    }


    function Update(id, review){
        var deferred = q.defer();
        delete review._id;
        ReviwModel.update({_id: id}, {$set: review}, function(err, review) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(review);
            }
        });
        return deferred.promise;
    }

    function Delete(id) {
        var deferred = q.defer();
        ReviwModel.remove({_id: id}, function(err, status) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }
}