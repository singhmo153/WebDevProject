"use strict";

(function() {
    angular
        .module("NextReadHuntApp")
        .factory("UserService", UserService);

    function UserService($http, $q) {

        var service = {
            login: login,
            logout: logout,
            register: register,
            findAllUsers: findAllUsers,
            deleteUserById: deleteUserById,
            updateUser: updateUser,
            createUser: createUser,
            findAllFollowing: findAllFollowing,
            addFollower: addFollower,
            deleteFollowingById: deleteFollowingById,
            findAllBooks: findAllBooks,
            deleteBookById: deleteBookById,
            findUserById: findUserById,
            updateReview: updateReview,
            deleteReviewById: deleteReviewById,
            findAllReviewsForUser: findAllReviewsForUser
        };

        return service;
        function login(user) {
            var deferred = $q.defer();
            $http.post("/api/project/login", user)
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function logout() {
            var deferred = $q.defer();
            $http.post("/api/project/logout")
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function register(user) {
            var deferred = $q.defer();
            $http.post("/api/project/register", user)
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function updateReview(userId, review){
            var deferred = $q.defer();
            console.log("I anm in client");
            $http.post("/api/project/user/"+ userId+"/review", review)
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }


        function findAllUsers() {
            var deferred = $q.defer();
            $http.get("/api/project/admin/user")
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function findUserByCredentials(username, password) {
            var deferred = $q.defer();
            $http.get("/api/project/user?username=" + username + "&password=" + password)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function createUser(user) {
            var deferred = $q.defer();
            $http.post("/api/project/admin/user", user)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function deleteUserById(userId) {
            var deferred = $q.defer();
            $http.delete("/api/project/admin/user/" + userId)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }
        function deleteReviewById(reviewId, userId) {
            var deferred = $q.defer();
            $http.delete("/api/project/user/"+ userId+"/review/"+reviewId)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function updateUser(userId, user) {
            var deferred = $q.defer();
            $http.put("/api/project/user/"+userId, user)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function findUserByUsername(username) {
            var deferred = $q.defer();
            $http.get("/api/project/user?username=" + username)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function findUserById(id) {
            var deferred = $q.defer();
            $http.get("/api/project/user/" + id)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function findAllFollowing(userId) {
            var deferred = $q.defer();
            $http.get("/api/project/user/" + userId + "/following")
                .success(function (response) {
                    console.log(response)
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function addFollower(userId, follower) {
            console.log("service.client.js");
            console.log(userId);
            console.log("no userid");
            var deferred = $q.defer();
            $http.put("/api/project/user/"+userId+"/following?following="+follower)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function deleteFollowingById(userId, followerId) {
            var deferred = $q.defer();
            $http.delete("/api/project/user/"+ userId+"/"+followerId)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function findAllBooks(userId) {
            var deferred = $q.defer();
            $http.get("/api/project/user/"+ userId+"/books")
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function findAllReviewsForUser(userId) {
            var deferred = $q.defer();
            $http.get("/api/project/user/"+ userId+"/reviews")
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function deleteBookById(bookId, userId) {
            var deferred =$q.defer();
            console.log("I reached in book delete client service")
            $http.delete("/api/project/user/"+ userId+"/books/"+bookId)
                .success(function (response) {
                    console.log("In client services");
                    console.log(response);
                    deferred.resolve(response);
                });
            return deferred.promise;
        }
    }
})();