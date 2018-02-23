"use strict";
var passport      = require('passport');
var LocalStrategy    = require('passport-local').Strategy;

module.exports = function(app, userModel) {
    var auth = authorized;
    app.post  ('/api/project/login', passport.authenticate('local'), login);
    app.post  ('/api/project/logout',         logout);
    app.post  ('/api/project/register',       register);
    app.post  ('/api/project/admin/user',     auth, createUser);
    app.get   ('/api/project/loggedin',       loggedin);
    app.get   ('/api/project/admin/user',     auth, findAllUsers);
    app.put   ('/api/project/user/:id', auth, updateUser);
    app.delete('/api/project/admin/user/:id', auth, deleteUser);
    app.get("/api/project/user/:id/following", auth, getFollowing);
    app.put("/api/project/user/:id/following", auth, updateFollowing);
    app.delete("/api/project/user/:id/:followingId", auth, deleteFollowing);
    app.get("/api/project/user/:id/books", getBooks);
    app.get("/api/project/user/:id/reviews", getReviews);
    app.delete("/api/project/user/:userId/books/:bookId", deleteBookById);
    app.get("/api/project/user/:id", getUserById);
    app.post("/api/project/user/:userId/review", updateReview);
    app.delete("/api/project/user/:userId/review/:reviewId", deleteReview);

    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    };

    function localStrategy(username, password, done) {
        userModel
            .findUserByCredentials({username: username, password: password})
            .then(
                function(user) {
                    if (!user) { return done(null, false); }
                    return done(null, user);
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .FindById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function register(req, res) {
        var newUser = req.body;
        newUser.roles = ['user'];

        userModel
            .findUserByUsername(newUser.username)
            .then(
                function(user){
                    if(user) {
                        res.json(null);
                    } else {
                        return userModel.Create(newUser);
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function findAllUsers(req, res) {
        if(isAdmin(req.user)) {
            userModel
                .FindAll()
                .then(
                    function (users) {
                        res.json(users);
                    },
                    function () {
                        res.status(400).send(err);
                    }
                );
        } else {
            res.status(403);
        }
    }

    function deleteUser(req, res) {
        if(isAdmin(req.user)) {

            userModel
                .Delete(req.params.id)
                .then(
                    function(user){
                        return userModel.FindAll();
                    },
                    function(err){
                        res.status(400).send(err);
                    }
                )
                .then(
                    function(users){
                        res.json(users);
                    },
                    function(err){
                        res.status(400).send(err);
                    }
                );
        } else {
            res.status(403);
        }
    }

    function updateUser(req, res) {
        var newUser = req.body;
        userModel
            .Update(req.params.id, newUser)
            .then(
                function(user){
                    if(req.session.passport.user._id == req.params.id) {
                        return user;
                    }
                    else {
                        userModel.FindAll();
                    }

                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(users){
                    res.json(users);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function updateReview(req, res){
        var userId = req.params.userId;
        var newreview = req.body;
        userModel.FindById(userId)
            .then(
                function (user){
                    //console.log()
                    var index = user.reviews.indexOf(newreview._id);
                    var reviews = user.reviews;
                    reviews.splice(index,1);
                    console.log(reviews)
                    //delete newreview._id;
                    reviews.push(newreview)
                    user.reviews = reviews;
                    console.log(user.reviews)
                    userModel
                        .Update(user._id, user)
                        .then(
                            function(user){
                                if(req.session.passport.user._id == req.params.id) {
                                    console.log(user);
                                    return user;
                                }
                                else {
                                    userModel.FindAll();
                                }

                            },
                            function(err){
                                res.status(400).send(err);
                            }
                        )
                        .then(
                            function(users){
                                console.log("I am in second then");
                                console.log(users);
                                res.json(users);
                            },
                            function(err){
                                res.status(400).send(err);
                            }
                        );

                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function getFollowing(req, res) {
        var userId = req.params.id;
        console.log(userId);
        var followingUsers=[];
        userModel.Following(userId)
            .then(
                function (following){
                    res.json(following);
                    var temp=[];
                },
                function () {
                    res.status(400).send(err);
                }
            )
    }

    function updateFollowing(req, res) {
        var userId = req.params.id;
        var following = req.param("following");
        res.json(userModel.updateFollowing(userId, following));
    }

    function deleteFollowing(req, res) {
        var userId = req.params.id;
        var followingId = req.params.followingId;
        userModel.deleteFollowing(userId, followingId)
            .then(
                function (user){
                    res.json(user)
                },
                function(err){
                    res.status(400).send(err);
                }
            )
    }

    function getBooks(req, res) {
        var userId = req.params.id;
        userModel.getBooks(userId)
            .then(
                function(books){
                    res.json(books)
                },
                function(err){
                    res.status(400).send(err);
                }
            )
    }

    function getReviews(req, res) {
        var userId = req.params.id;
        userModel.getReviews(userId)
            .then(
                function(reviews){
                    res.json(reviews)
                },
                function(err){
                    res.status(400).send(err);
                }
            )
    }

    function deleteBookById(req, res) {
        var userId = req.params.userId;
        var bookId = req.params.bookId;

        userModel.deleteBook(userId, bookId)
            .then(
                function(books){
                    res.json(books)
                },
                function(err){
                    res.status(400).send(err);
                }
            )
    }

    function deleteReview(req, res) {
        var userId = req.params.userId;
        var reviewId = req.params.reviewId;
        userModel.deleteReview(userId, reviewId)
            .then(
                function(review){
                    res.json(review);
                },
                function(err){
                    res.status(400).send(err);
                }
            )
    }

    function getUserById(req, res) {
        var id = req.params.id;
        userModel
            .FindById(id)
            .then(function(user){
                res.json(user);
            });
    }

    function createUser(req, res) {
        var newUser = req.body;
        if(newUser.roles && newUser.roles.length > 1) {
            newUser.roles = newUser.roles.split(",");
        } else {
            newUser.roles = ["user"];
        }
        userModel
            .findUserByUsername(newUser.username)
            .then(
                function(user){
                    // if the user does not already exist
                    if(user == null) {
                        // create a new user
                        return userModel.Create(newUser)
                            .then(
                                // fetch all the users
                                function(){
                                    return userModel.FindAll();
                                },
                                function(err){
                                    res.status(400).send(err);
                                }
                            );
                        // if the user already exists, then just fetch all the users
                    } else {
                        return userModel.FindAll();
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(users){
                    res.json(users);
                },
                function(){
                    res.status(400).send(err);
                }
            );
    }

    function isAdmin(req) {
        var user = req;
        if(user.roles.indexOf("admin") > -1) {
            return true;
        }
        else{
            return false;
        }
    }

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    };
}