"use strict";

(function() {
    angular
        .module("NextReadHuntApp")
        .factory("ReviewsService", ReviewsService);

    function ReviewsService($http, $q) {

        var service = {
            addReview: addReview,
            findAllReviewsForUser: findAllReviewsForUser,
            deleteReviewById: deleteReviewById,
            updateReviewById: updateReviewById,

        };

        return service;

        function addReview(review) {
            var deferred = $q.defer();
            $http.post("/api/project/review", review)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }
        function findAllReviewsForUser(userId) {
            var deferred = $q.defer();
            $http.get("/api/project/reviews/"+userId)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function deleteReviewById(reviewId) {
            var deferred = $q.defer();
            $http.delete("/api/project/review/"+reviewId)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function updateReviewById(reviewId, newReview) {
            var deferred = $q.defer();
            $http.put("/api/project/review/" + reviewId, newReview)
                .success(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }
    }
})();