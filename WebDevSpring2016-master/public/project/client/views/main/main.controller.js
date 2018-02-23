"use strict";

(function(){
    angular
        .module("NextReadHuntApp")
        .controller("MainController", MainController);

    function MainController($scope, $location) {
        $scope.$location = $location;
    }
})();