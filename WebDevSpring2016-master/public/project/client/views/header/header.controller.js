"use strict";

(function(){
    angular
        .module("NextReadHuntApp")
        .controller("HeaderController", HeaderController);

    function HeaderController($location, $scope, $rootScope, UserService) {
        console.log("In header controller");
        console.log($rootScope.currentUser);

        $scope.reset = function() {
            UserService
                .logout()
                .then(
                    function(response){
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    },
                    function(err) {
                        $scope.error = err;
                    }
                );
        }
    }
})();