"use strict";

(function(){
    angular
        .module("NextReadHuntApp")
        .factory("GoogleBookService", googleBooksService);

    function googleBooksService($http) {
        var api = {
            findBookByTitle: findBookByTitle,
            findBookByID: findBookByID
        };
        return api;

        function findBookByTitle(title, callback) {
            $http.get("https://www.googleapis.com/books/v1/volumes?q="+title+"&key=AIzaSyAx6qr7KcIUkJoHAnJUH-6Ex4xSZHYQKeg")
                .success(callback);
        }

        function findBookByID(id, callback) {
            $http.get("https://www.googleapis.com/books/v1/volumes/"+id+"?key=AIzaSyAx6qr7KcIUkJoHAnJUH-6Ex4xSZHYQKeg")
                .success(callback);
        }
    }
})();