"use strict";
module.exports = function(mongoose) {

    var ReviewSchema = mongoose.Schema({
        rating: String,
        bookName: String,
        bookId: String,
        comments: String,
        userId: String,
        userName: String,
    }, {collection: 'project.nextReadHunt.review'});

    return ReviewSchema;
};