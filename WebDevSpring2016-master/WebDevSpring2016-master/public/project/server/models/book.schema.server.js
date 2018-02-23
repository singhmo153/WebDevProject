"use strict";
module.exports = function(mongoose) {
    var ReviewSchema = require("./review.schema.server.js")(mongoose);
    var BookSchema = mongoose.Schema({
        title: String,
        pic: String,
        authors: [String],
        bookId: String,
        reviews: [ReviewSchema]
    }, {collection: 'project.nextReadHunt.book'});

    return BookSchema;
};