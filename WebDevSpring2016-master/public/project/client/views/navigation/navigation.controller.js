"use strict";
(function(){
    angular
        .module("NextReadHuntApp")
        .controller("NavController", navController);

    function navController($scope, $location) {
        $scope.$location = $location;
    }
})();