"use strict";
module.exports = function(mongoose) {
    var BookSchema = require("./book.schema.server.js")(mongoose);
    var ReviewSchema = require("./review.schema.server.js")(mongoose);
    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        emails: [String],
        roles: [String],
        books: [BookSchema],
        reviews: [ReviewSchema],
        following: [String],
    }, {collection: 'project.nextReadHunt.user'});

    return UserSchema;
};