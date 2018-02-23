"use strict";

module.exports = function(app, db, mongoose) {
    var userModel    = require("./models/user.model.server.js")(db, mongoose);
    var bookModel   = require("./models/book.model.server.js")(db, mongoose);
    var reviewModel = require("./models/review.model.js")(db, mongoose);

    var UserService  = require("./services/user.service.server.js") (app, userModel);
    var BookService = require("./services/book.service.server.js")(app, bookModel);
    var ReviewsService = require("./services/review.service.server.js")(app, reviewModel)
};