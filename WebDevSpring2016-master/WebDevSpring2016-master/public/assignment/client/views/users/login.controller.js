"use strict";

(function()
{
    angular
        .module("FormBuilderApp")
        .controller("LoginController", LoginController);

    function LoginController($rootScope, $scope, $location, UserService) {
        $scope.login = function(user) {
            if (user) {
                UserService.login(user)
                    .then(function (response) {
                            $rootScope.currentUser = response;
                            //console.log(response);
                            $location.url('/profile');
                        },
                        function(err) {
                            $scope.error = err;
                        });
            }
        }
    }
})();