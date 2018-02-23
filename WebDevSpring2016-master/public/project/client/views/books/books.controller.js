"use strict";

(function()
{
    angular
        .module("NextReadHuntApp")
        .controller("BooksController", BooksController);

    function BooksController($routeParams, $rootScope, $scope, BookService, UserService) {
        $scope.books = [];
        $scope.disable = true;
        var currentBook ={};

        var targetProfileId = $routeParams.userId;
        if($rootScope.currentUser){
            if($rootScope.currentUser._id == targetProfileId){
                $scope.currentuser = $rootScope.currentUser;
                $scope.disableProfile = false;
                UserService.findAllBooks($rootScope.currentUser._id)
                    .then(function (response) {
                        $scope.books = response;
                    });

            }else {
                UserService.findUserById(targetProfileId)
                    .then(function (response) {
                        console.log(response);
                        $scope.currentuser = response;
                    })
                    .then(function (response) {
                        UserService.findAllBooks($scope.currentuser._id)
                            .then(function (response) {
                                $scope.books = response;
                            });
                });
            }

        }


        $scope.deleteBook = function(id) {
            UserService.deleteBookById(id, $rootScope.currentUser._id)
                .then(function(response){
                    console.log(response.books);
                   $scope.books = response.books;
                });
            $scope.selectedFormIndex = null;
        }
    }
})();