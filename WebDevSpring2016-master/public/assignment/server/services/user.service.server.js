"use strict";
var passport      = require('passport');
var LocalStrategy    = require('passport-local').Strategy;

module.exports = function(app, userModel) {
    // var userModel = require("../../models/user/user.model.server.js")();
    var auth = authorized;
    app.post  ('/api/assignment/login', passport.authenticate('local'), login);
    app.post  ('/api/assignment/logout',         logout);
    app.post  ('/api/assignment/register',       register);
    app.post  ('/api/assignment/admin/user',     isAdmin, createUser);
    app.get   ('/api/assignment/loggedin',       loggedin);
    app.get   ('/api/assignment/admin/user',     isAdmin, findAllUsers);
    app.get   ('/api/assignment/admin/user/:id',    isAdmin, getUserById)
    app.put   ('/api/assignment/user/:id', auth, updateUser);
    app.delete('/api/assignment/admin/user/:id', isAdmin, deleteUser);
    app.put   ('/api/assignment/admin/user/:id', isAdmin, adminUserUpdate);

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
        console.log("register user service");
        console.log(newUser);
        newUser.roles = ['student'];

        userModel
            .findUserByUsername(newUser.username)
            .then(
                function(user){
                    if(user) {
                        console.log(user);
                        console.log("user exist");
                        res.json(null);
                    } else {
                        console.log("user does not exist");
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
        // console.log(req.user);
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

    }

    function deleteUser(req, res) {

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

    function adminUserUpdate(req, res) {
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

    function getUserById(req, res) {
        var id = req.params.id;
        userModel
            .FindById(id)
            .then(function(user){
                res.json(user[0]);
            });
    }

    function createUser(req, res) {
        var newUser = req.body;
        if(newUser.roles && newUser.roles.length > 1) {
            newUser.roles = newUser.roles.split(",");
        } else {
            newUser.roles = ["student"];
        }

        // first check if a user already exists with the username
        userModel
            .findUserByUsername(newUser.username)
            .then(
                function(user){
                    // if the user does not already exist
                    if(user == null) {
                        console.log("if 1");
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
                        console.log("if 1");
                        return userModel.FindAll();
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(users){
                    console.log("if 1");
                    res.json(users);
                },
                function(){
                    res.status(400).send(err);
                }
            )
    }

    function isAdmin(req, res, next) {
        // console.log(user[0].roles);
        console.log("I came in is Admin")
        var user = req.user;
        console.log("in user service");
        console.log(req.user);
        if(user[0].roles.indexOf("admin") > -1 && req.isAuthenticated()) {
            console.log("is admin");
            next();
        }
        else{
            res.send(403);
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