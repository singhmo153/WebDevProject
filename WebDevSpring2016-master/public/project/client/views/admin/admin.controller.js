"use strict";

(function() {
    angular
        .module("NextReadHuntApp")
        .controller("AdminController", AdminController);

    function AdminController($rootScope, $scope, UserService) {
        $scope.users=[];
        $scope.selectedUserIndex = null;
        $scope.disable = true;
        $scope.add = add;
        $scope.remove = remove;


        function init() {
            UserService
                .findAllUsers()
                .then(handleSuccess, handleError);
        }
        init();

        function remove(user)
        {
            UserService
                .deleteUserById(user._id)
                .then(handleSuccess, handleError);
        }
        function add(user)
        {
            UserService
                .createUser(user)
                .then(handleSuccess, handleError);
        }
        function handleSuccess(response) {
            $scope.users = response;
        }

        function handleError(error) {
            $scope.error = error;
        }
    }
})();