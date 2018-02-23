"use strict";

(function() {
    angular
        .module("NextReadHuntApp")
        .factory("BookService", BookService);

    function BookService($http, $q) {

        var service = {
            addBook: addBook,
            findAllBooks: findAllBooks,
            deleteBookById: deleteBookById,
            getBookById: getBookById,
            update: update,
            deleteReview: deleteReview,
            getAllReviews: getAllReviews
        };

        return service;

        function update(bookId, newReview) {
            var deferred = $q.defer();
            console.log(bookId);
            $http.post("/api/project/book/"+bookId, newReview)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }
        function getBookById(bookId){
            console.log("I am in book service controller");
            var deferred = $q.defer();
            $http.get("/api/project/book/"+bookId)
                .success(function (response) {
                    console.log(response)
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function addBook(book) {
            var deferred = $q.defer();
            $http.post("/api/project/book/", book)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }


        function findAllBooks() {
            var deferred = $q.defer();
            $http.get("/api/project/books")
                .success(function (response) {
                    console.log("In book client service")
                    console.log(response);
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function getAllReviews(bookId) {
            var deferred = $q.defer();
            $http.get("/api/project/book/"+bookId+"/reviews")
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function deleteBookById(bookId) {
            var deferred = $q.defer();
            $http.delete("/api/project/book/"+bookId)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function deleteReview(bookId, currentreview) {
            var deferred = $q.defer();
            $http.delete("/api/project/book/"+bookId+"/review/"+currentreview._id)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }
    }
})();