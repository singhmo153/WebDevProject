"use strict";

(function()
{
    angular
        .module("NextReadHuntApp")
        .controller("ProfileController", ProfileController);

    function ProfileController($routeParams,$rootScope, $scope, $location, UserService) {
        var targetProfileId = $routeParams.userId;
        if($rootScope.currentUser){
            if($rootScope.currentUser._id == targetProfileId){
                $scope.currentuser = $rootScope.currentUser;
                $scope.disableProfile = false;

            }else {
                UserService.findUserById(targetProfileId)
                    .then(function (response) {
                        console.log(response);
                        $scope.currentuser = response;
                    });
            }

        }
        $scope.update = function(user) {
            UserService.updateUser(user._id,user)
                .then(function(response){
                    },
                    function(err) {
                        $scope.error = err;
                    });
            $location.path('/profile/'+$rootScope.currentUser._id);
        }
    }
})();