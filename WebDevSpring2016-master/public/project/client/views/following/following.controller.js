"use strict";

(function()
{
    angular
        .module("NextReadHuntApp")
        .controller("FollowingController", FollowingController);

    function FollowingController($routeParams, $rootScope, $scope, UserService) {
        $scope.following = [];
        $scope.selectedFormIndex = null;
        $scope.disable = true;
        var currentFollower;

        var targetProfileId = $routeParams.userId;
        if($rootScope.currentUser){
            if($rootScope.currentUser._id == targetProfileId){
                $scope.currentuser = $rootScope.currentUser;
                $scope.disableProfile = false;
                UserService.findAllFollowing($rootScope.currentUser._id)
                    .then(function (response) {
                        var following =[];
                        for(var j=0; j<response.length; j++){
                            if(response[j]!=null){
                                console.log(response[j]);
                                UserService.findUserById(response[j])
                                    .then(function (response) {
                                        console.log(response);
                                        if(typeof response =='object' && response!=null){
                                            following.push(response);
                                        }

                                    });
                            }
                        }
                        $scope.following = following;
                    });

            }else {
                UserService.findUserById(targetProfileId)
                    .then(function (response) {
                        $scope.currentuser = response;
                    })
                    .then(function (response) {
                        UserService.findAllFollowing($scope.currentuser._id)
                            .then(function (response) {
                                var following =[];
                                for(var j=0; j<response.length; j++){
                                    if(response[j]!=null){
                                        UserService.findUserById(response[j])
                                            .then(function (response) {
                                                if(typeof response =='object' && response!=null){
                                                    following.push(response);
                                                }
                                            });
                                    }

                                }
                                console.log(following);
                                $scope.following = following;
                            });
                    });
            }

        }

        $scope.addFollower = function() {
            if($scope.followerId!=null) {
                currentFollower = $scope.followerId;
                UserService.addFollower($rootScope.currentUser._id, currentFollower)
                    .then(function(response){
                        if(response!=null) {
                            $scope.following.push(response);
                        }
                    });
                $scope.followerId = null;
                currentFollower = null;
            }
        }

        $scope.deleteFollower = function(currentFollower) {
            UserService.deleteFollowingById($rootScope.currentUser._id, currentFollower._id)
                .then(function(response){
                    var following = [];
                    for(var i=0; i<response.following.length; i++){
                        UserService.findUserById(response.following[i])
                            .then(function (response) {
                                if(typeof response =='object' && response!=null){
                                    following.push(response);
                                }
                            });
                    }
                    $scope.following = following;
                });
            $scope.selectedFormIndex = null;
            $scope.formName = null;
        }
    }
})();