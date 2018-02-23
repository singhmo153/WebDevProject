"use strict";

(function()
{
    angular
        .module("NextReadHuntApp")
        .controller("ReviewsController", ReviewsController);

    function ReviewsController($routeParams, $rootScope, $scope, ReviewsService, UserService, BookService) {
        $scope.reviews = [];
        $scope.selectedFormIndex = null;
        $scope.disable = true;
        var currentReview = {};

        var targetProfileId = $routeParams.userId;
        if($rootScope.currentUser){
            if($rootScope.currentUser._id == targetProfileId){
                $scope.currentuser = $rootScope.currentUser;
                $scope.disableProfile = false;
                UserService.findAllReviewsForUser($rootScope.currentUser._id)
                    .then(function (response) {
                        $scope.reviews = response;
                    });

            }else {
                UserService.findUserById(targetProfileId)
                    .then(function (response) {
                        console.log(response);
                        $scope.currentuser = response;
                    })
                    .then(function (response) {
                        UserService.findAllReviewsForUser($scope.currentuser._id)
                            .then(function (response) {
                                console.log(response);
                                $scope.reviews = response;
                            });
                    });
            }
        }


        $scope.updateReview = function() {
            if($scope.bookName!=null && $scope.rating!=null && $scope.comments!=null) {
                currentReview = $scope.reviews[$scope.selectedFormIndex];

                currentReview.rating = $scope.rating;
                currentReview.comments = $scope.comments;

                UserService.updateReview($rootScope.currentUser._id, currentReview)
                    .then(function(response){
                        console.log(response);
                       // $scope.reviews[$scope.selectedFormIndex] = response.reviews;
                    })
               ReviewsService.updateReviewById(currentReview._id, currentReview)
                    .then(function (response){
                        console.log(response);
                    });
                BookService.update(currentReview.bookId, currentReview)
                    .then(function(response){

                    })

                currentReview = {};
                $scope.bookId = null;
                $scope.rating = null;
                $scope.comments = null;
                $scope.selectedFormIndex = null;
                $scope.disable = true;
            }
        }

        $scope.deleteReview = function(currentReview) {
            //currentReview = $scope.reviews[index];
            ReviewsService.deleteReviewById(currentReview._id)
                .then(function(response){
                    //$scope.reviews = response;
                });
            UserService.deleteReviewById(currentReview._id, $rootScope.currentUser._id)
                .then(function(response){
                    console.log(response);
                    $scope.reviews = response.reviews;
                })
            BookService.deleteReview(currentReview.bookId, currentReview)
                .then(function(response){

                })

            $scope.selectedFormIndex = null;
            $scope.bookId = null;
            $scope.rating = null;
            $scope.comments = null;
        }

        $scope.selectReview = function(index) {
            $scope.selectedFormIndex = index;
            $scope.bookName = $scope.reviews[index].bookName;
            $scope.bookId = $scope.reviews[index].bookId;
            $scope.rating = $scope.reviews[index].rating;
            $scope.comments = $scope.reviews[index].comments;
            $scope.disable = false;
        }
    }
})();