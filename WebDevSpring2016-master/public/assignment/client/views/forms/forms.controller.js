"use strict";

(function() {
    angular
        .module("FormBuilderApp")
        .controller("FormController", FormController);

    function FormController($rootScope, $scope, FormService) {
        $scope.forms = [];
        $scope.selectedFormIndex = null;
        $scope.disable = true;
        var currentForm = {};


        if($rootScope.currentUser != null) {
            FormService.findAllFormsForUser($rootScope.currentUser._id)
                .then(function (response) {
                    $scope.forms = response;
                });
        }

        $scope.addForm = function() {
            if($scope.formName == null) {
                currentForm.title = "NewForm";
            }
            else{
                currentForm.title = $scope.formName;
            }
                FormService.createFormForUser($rootScope.currentUser._id, currentForm)
                    .then(function(response){
                        $scope.forms.push(response);
                    });
                $scope.formName = null;
                currentForm = {};
            }


        $scope.updateForm = function() {
            if($scope.formName!=null) {
                currentForm = $scope.forms[$scope.selectedFormIndex];
                currentForm.title = $scope.formName;
                FormService.updateFormById(currentForm._id, currentForm)
                    .then(function (response){
                        $scope.forms[$scope.selectedFormIndex] = response;
                    });
                currentForm = {};
                $scope.formName = null;
                $scope.selectedFormIndex = null;
                $scope.disable = true;
            }
        }

        $scope.deleteForm = function(index) {
            currentForm = $scope.forms[index];
            FormService.deleteFormById(currentForm._id)
                .then(function(response){
                    $scope.forms.splice(index,1);
                });
            $scope.selectedFormIndex = null;
            $scope.formName = null;
        }

        $scope.selectForm = function(index) {
            $scope.selectedFormIndex = index;
            $scope.formName = $scope.forms[index].title;
            $scope.disable = false;
        }
    }
})();