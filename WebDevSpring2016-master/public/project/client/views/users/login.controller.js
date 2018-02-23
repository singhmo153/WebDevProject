"use strict";

(function()
{
    angular
        .module("NextReadHuntApp")
        .controller("LoginController", LoginController);

    function LoginController($rootScope, $scope, $location, UserService) {
        $scope.login = function(user) {
            if(user){
                UserService.login(user)
                    .then(function(response){
                        $rootScope.currentUser = response;
                        $location.url('/profile/'+$rootScope.currentUser._id);
                    },
                        function(err) {
                            $scope.error = err;
                        });
            }

        }
    }
})();