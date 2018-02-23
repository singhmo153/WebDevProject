"use strict";

var uuid = require('node-uuid');
var q = require("q");

module.exports = function(db, mongoose) {

    var FormSchema = require("./form.schema.server.js")(mongoose);
    var FormModel  = mongoose.model("FormModel", FormSchema);


    var api = {
        Create: Create,
        FindAll: FindAll,
        FindFormsByUserId: FindFormsByUserId,
        FindById: FindById,
        Update: Update,
        Delete: Delete,
        findFormByTitle: findFormByTitle
    };
    return api;

    function Create(form, userId) {
        var deferred = q.defer();
        form.userId = userId;
        FormModel.create(form, function(err, form) {
            if(err) {
                deferred.reject(err);
            } else {
                console.log("Form>");
                console.log(form);
                deferred.resolve(form);
                form.save(function(err, updatedForm) {
                    if(err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(updatedForm);
                    }
                });
            }
        });
        return deferred.promise;
    }

    function FindAll() {
        var deferred = q.defer();

        FormModel.find(function(err, forms){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(forms);
            }
        });

        return deferred.promise;
    }

    function FindFormsByUserId(userId){
        var deferred = q.defer();

        FormModel.find({userId: {$in: userId}}, function(err, forms){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(forms);
            }
        });

        return deferred.promise;
    }


    function FindById(id) {
        var deferred = q.defer();
        FormModel.find({_id: {$in: id}}, function (err, form) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(form);
            }
        });

        return deferred.promise;
    }

    function Update(id, form) {
        var deferred = q.defer();
        delete form._id;

        FormModel.update({_id: id}, {$set: form}, function(err, form) {
            if(err) {
                deferred.reject(err);
            } else {
                console.log(form);
                deferred.resolve(form);
                form.save(function(err, updatedForm) {
                    if(err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(updatedForm);
                    }
                });
            }
        });

        return deferred.promise;
    }

    function Delete(id) {
        var deferred = q.defer();

        FormModel.remove({_id: id}, function(err, status) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(status);
            }
        });

        return deferred.promise;
    }

    function findFormByTitle(title) {
        var deferred = q.defer();
        FormModel.find({title: {$in: title}}, function (err, form) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(form);
            }
        });

        return deferred.promise;
    }
}
