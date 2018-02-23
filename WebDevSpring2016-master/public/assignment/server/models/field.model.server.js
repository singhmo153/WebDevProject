"use strict";

var uuid = require('node-uuid');
var q = require("q");

module.exports = function(db, mongoose) {

    var FormSchema = require("./form.schema.server.js")(mongoose);
    var FieldModel  = mongoose.model("FieldModel", FormSchema);


    var api = {
        FindAllFields: FindAllFields,
        FindFieldById: FindFieldById,
        DeleteFieldById: DeleteFieldById,
        CreateField: CreateField,
        UpdateField: UpdateField,
        RearrangeFields: RearrangeFields

    };
    return api;

    function FindAllFields(formId) {
        var deferred = q.defer();

        FieldModel.findById({_id: formId}, function (err, form) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(form);
            }
        });
        return deferred.promise;
    }

    function FindFieldById(formId, fieldId) {
        var deferred = q.defer();

        FieldModel.findById({_id: formId}, function (err, form) {
            if (err) {
                deferred.reject(err);
            } else {
                var fields = form.fields;
                for(var i =0; i<fields.length; i++){
                    if(fields[i]._id == fieldId){
                        deferred.resolve(fields[i]);
                        break;
                    }
                }
            }
        });
        return deferred.promise;
    }

    function DeleteFieldById(formId, fieldId) {
        var deferred = q.defer();

        FieldModel.findById(formId, function(err, form){
            if(err) {
                deferred.reject(err);
            } else {
                var fields = form.fields;

                for(var i=0; i<fields.length; i++){
                    if(fields[i]._id == fieldId){
                        fields.splice(i,1);
                    }
                }
                form.fields = fields;
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

    function CreateField(formId, field) {
        var deferred = q.defer();
        if(field._id){
            delete field._id;
        }

        FieldModel.findById({_id : formId}, function(err, form){
            if(err){
                deferred.reject(err);
            }else{
                var fields = form.fields
                fields.push(field);
                form.fields = fields;
                form.save(function(err,updatedForm){
                    if(err)
                    {
                        deferred.reject(err);
                    }
                    else
                    {
                        deferred.resolve(updatedForm);
                    }
                });
            }
        });
        return deferred.promise;
    }

    function UpdateField(formId, fieldId, field) {
        var deferred = q.defer();

        FieldModel.findById({_id: formId}, function (err, form) {
            if (err) {
                deferred.reject(err);
            } else {
                var fields = form.fields;
                for(var i=0; i<fields.length; i++){
                    if (fields[i]._id == fieldId) {
                        fields[i] = field;
                        break;
                    }
                }
                form.fields = fields;
                form.save(function(err,updatedForm){
                    if(err)
                    {
                        deferred.reject(err);
                    }
                    else
                    {
                        deferred.resolve(updatedForm);
                    }
                });
            }
        });
        return deferred.promise;
    }

    function RearrangeFields(formId, fields) {
        var deferred = q.defer();

        FieldModel.findById(formId, function(err, form) {
            if (err) {
                deferred.reject(err);
            } else {
                form.fields = fields;
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
}
