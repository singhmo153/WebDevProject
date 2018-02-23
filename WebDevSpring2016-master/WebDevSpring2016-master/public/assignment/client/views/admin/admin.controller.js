"use strict";

(function() {
    angular
        .module("FormBuilderApp")
        .controller("AdminController", AdminController);

    function AdminController($location, $rootScope, $scope, UserService) {
        $scope.users=[];
        $scope.selectedUserIndex = null;
        $scope.disable = true;
        var newUser = {};
        $scope.toggle = false;
        $scope.predicate = 'username';

        if($rootScope.currentUser != null) {
            UserService.findAllUsers()
                .then(function (response) {
                    $scope.users = response;
                });
        }

        $scope.sort = function(predicate) {
            if(predicate === 'username'){
                $scope.toggleUsername = !$scope.toggleUsername;
                $scope.toggle = $scope.toggleUsername;
            }
            if(predicate === 'firstName') {
                $scope.toggleFirstName = !$scope.toggleFirstName;
                $scope.toggle = $scope.toggleFirstName;
            }
            if(predicate === 'lastName') {
                $scope.toggleLastName = !$scope.toggleLastName;
                $scope.toggle = $scope.toggleLastName;
            }
            $scope.predicate = predicate;
        }

        $scope.addNewUser = function(user) {
            console.log($(location).attr('href'));
            UserService.createUser(user)
                .then(function(response) {
                    $location.path('/admin');
                    $scope.users = response;
                }, function (err) {
                    $scope.error = err;
                });
        }

        $scope.updateUser = function(user) {
            UserService.adminUpdateUser(user._id,user)
                .then(function(response){
                    $location.path('/admin');
                       UserService.findAllUsers()
                            .then(function (response) {
                                $scope.users = response;
                                $scope.user={};
                                $scope.disable = true;
                                $scope.selectedUserIndex = null;
                            });
                },
                    function(err) {
                        $scope.error = err;
                    });
        }

        $scope.deleteUser = function(userId) {
            UserService.deleteUser(userId)
                .then(function(response) {
                    $scope.users = response;
                }, function (err) {
                    $scope.error = err;
                });
        }

        $scope.selectUser = function(user, index) {
            $scope.selectedUser = user;
            $scope.slectedUserIndex = index;
            $scope.disable = false;
        }
    }
})();