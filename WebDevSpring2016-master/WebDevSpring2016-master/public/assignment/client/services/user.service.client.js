"use strict";

(function() {
    angular
        .module("FormBuilderApp")
        .factory("UserService", UserService);

    //function UserService($http, $q) {
    function UserService($http, $q) {
        var service = {
            login: login,
            logout: logout,
            register: register,
            findAllUsers: findAllUsers,
            deleteUser: deleteUser,
            updateUser: updateUser,
            createUser: createUser,
            adminUpdateUser: adminUpdateUser
        };

        return service;

        function login(user) {
            var deferred = $q.defer();
            $http.post("/api/assignment/login", user)
                .success(function(response) {
                    console.log(user);
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function logout() {
            var deferred = $q.defer();
            $http.post("/api/assignment/logout")
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function register(user) {
            var deferred = $q.defer();
            $http.post("/api/assignment/register", user)
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function findAllUsers() {
            var deferred = $q.defer();
            $http.get("/api/assignment/admin/user")
                .success(function(response){
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function findUserByCredentials(username, password) {
            var deferred = $q.defer();
            $http.get("/api/assignment/user?username="+username+"&password="+password)
                .success(function(response){
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function createUser(user) {
            var deferred = $q.defer();
            $http.post("/api/assignment/admin/user", user)
                .success(function(response){
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function deleteUser(userId) {
            var deferred = $q.defer();
            $http.delete("/api/assignment/admin/user/"+userId)
                .success(function(response){
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function updateUser(userId, user) {
            var deferred = $q.defer();
            $http.put("/api/assignment/user/"+userId, user)
                .success(function(response){
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function adminUpdateUser(userId, user) {
            var deferred = $q.defer();
            $http.put("/api/assignment/admin/user/"+userId, user)
                .success(function(response){
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function findUserByUsername(username) {
            var deferred = $q.defer();
            $http.get("/api/assignment/user?username="+username)
                .success(function(response){
                    deferred.resolve(response);
                });
            return deferred.promise;
        }
    }
})();