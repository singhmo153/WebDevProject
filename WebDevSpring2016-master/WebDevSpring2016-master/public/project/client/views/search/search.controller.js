"use strict";

(function(){
    angular
        .module("NextReadHuntApp")
        .controller("SearchController", searchController);

    function searchController($scope, $location, $routeParams, GoogleBookService) {
        $scope.search = search;
        $scope.title = $routeParams.title;
        $scope.searchOn = false;

        if($scope.title) {
            search($scope.title);
        }

        function search(title) {
            $location.url("/search/"+$scope.title);
            GoogleBookService.findBookByTitle(
                title,
                function(response){
                    $scope.searchOn = true;
                    $scope.data = response;
                });
        }
    }
})();