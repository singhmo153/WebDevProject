"use strict";

(function(){
    angular
        .module("FormBuilderApp")
        .controller("RegisterController", RegisterController);

    function RegisterController($rootScope, $scope, $location, UserService) {
        $scope.register = function(user) {
            if(user.password != user.verifyPassword || !user.password || !user.verifyPassword) {
                $scope.error = "Your passwords don't match";
            }
            else {
                UserService.register(user)
                    .then(function(response) {
                            var user = response;
                        console.log("in register controller")
                        console.log(user);
                            if (user != null) {
                                $rootScope.currentUser = response;
                                $location.path('/profile');
                            }
                        },
                        function (err) {
                            $scope.error = err;
                        });
            }
        }
    }
})();